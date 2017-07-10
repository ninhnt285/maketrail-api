import TraceModel from '../models/trace';
import UserTripRelationModel from '../models/userTripRelation';
import { convertGeoToId } from '../../lib/map';

const TraceService = {};

TraceService.add = async function (tripId, location, arrivalTime) {
  const users = await UserTripRelationModel.find({ tripId });
  const svgs = await convertGeoToId(location.lat, location.lng);
  if (svgs && svgs !== false) {
    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < svgs.length; j++) {
        await this.addToUser(users[i].userId, svgs[j], arrivalTime);
      }
    }
  }
};

TraceService.remove = async function (tripId, location) {
  const users = await UserTripRelationModel.find({ tripId });
  const svgIds = await convertGeoToId(location.lat, location.lng);
  if (svgIds && svgIds !== false) {
    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < svgIds.length; j++) {
        await this.removeFromUser(users[i].userId, svgIds[j]);
      }
    }
  }
};

TraceService.addToUser = async function (userId, svg, arrivalTime) {
  const trace = await TraceModel.findOne({ userId, svgId: svg.id });
  if (!trace) {
    await TraceModel.create({ userId, svgId: svg.id, parentId: svg.parentId, arrivalTime });
  } else {
    await TraceModel.findByIdAndUpdate(trace.id, { arrivalTime });
  }
};

TraceService.removeFromUser = async function (userId, svgId) {
  await TraceModel.findOneAndUpdate({ userId, svgId }, { arrivalTime: undefined });
};

export default TraceService;
