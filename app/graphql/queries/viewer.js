import ViewerType from '../types/viewer';

const viewerQuery = {
  type: ViewerType,

  resolve: () => ({
    id: 'viewer-fixed'
  })
};

export default viewerQuery;
