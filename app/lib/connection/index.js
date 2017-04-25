import {
  base64,
  unbase64
} from './utils';

export function cursorToOffset(cursor) {
  return unbase64(cursor);
}

export function edgeFromNode(node) {
  if (node) {
    return {
      node,
      cursor: node.cursor ? base64(node.cursor) : base64(node.id)
    };
  }

  return null;
}

export function connectionFromArray(nodes, args) {
  const edges = nodes.map(node => ({
    node,
    cursor: node.cursor ? base64(node.cursor) : base64(node.id)
  }));

  const firstEdge = edges[0];
  const lastEdge = edges[edges.length - 1];

  return {
    edges,
    pageInfo: {
      startCursor: firstEdge ? firstEdge.cursor : null,
      endCursor: lastEdge ? lastEdge.cursor : null,
      hasPreviousPage: typeof args.hasPreviousPage === 'undefined' ? false : args.hasPreviousPage,
      hasNextPage: typeof args.hasNextPage === 'undefined' ? false : args.hasNextPage
    }
  };
}
