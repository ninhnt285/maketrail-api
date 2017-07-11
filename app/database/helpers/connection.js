import { getNodeFromId } from './node';
import { cursorToOffset, connectionFromArray } from '../../lib/connection';

export async function connectionFromModel(model, args, processFunc) {
  // NOTE: Don't support args.last

  /*
  args:
    - all fields from connections: before, after, first, last
    - user: null || Object { id }
    - filter: Object
  */
  const user = args.user ? args.user : null;

  // Parse Args: first, last
  let limit = 10;
  limit = args.first || args.last || limit;

  // Parse Args: before, after
  const afterNode = args.after ? await getNodeFromId(cursorToOffset(args.after), user) : null;
  const beforeNode = args.before ? await getNodeFromId(cursorToOffset(args.before), user) : null;

  // Find arrays from args with Model and processFunc
  let sort = args.sort ? args.sort : 'createdAt';

  let sortNode = args.sortNode ? args.sortNode : sort;
  let signed = false;
  if (sortNode.charAt(0) === '-') {
    sortNode = sortNode.substring(1, sortNode.length);
    signed = true;
  }

  const filter = Object.assign({}, args.filter);

  if (afterNode) {
    filter[sortNode] = filter[sortNode] ? filter[sortNode] : {};
    if (signed) {
      filter[sortNode].$lt = afterNode[sortNode];
    } else {
      filter[sortNode].$gt = afterNode[sortNode];
    }
  }
  if (beforeNode) {
    filter[sortNode] = filter[sortNode] ? filter[sortNode] : {};
    if (signed) {
      filter[sortNode].$gt = beforeNode[sortNode];
    } else {
      filter[sortNode].$lt = beforeNode[sortNode];
    }
  }

  const total = await model.count(args.filter);
  const count = await model.count(filter);
  const items = await model.find(filter)
                  .sort(sort)
                  .limit(limit)
                  .exec();

  // TODO: Need to improve
  if (items.length < count) {
    args.hasNextPage = args.hasNextPage || (args.first > 0);
  }
  if (afterNode) {
    args.hasNextPage = args.hasNextPage || (items.length < count);
    args.hasPreviousPage = args.hasPreviousPage || (count < total);
  }
  if (beforeNode) {
    args.hasPreviousPage = args.hasPreviousPage || (items.length < count);
    args.hasNextPage = args.hasNextPage || (count < total);
  }

  if (processFunc) {
    const results = await Promise.all(items.map(processFunc));
    return connectionFromArray(results, args);
  }

  return connectionFromArray(items, args);
}
