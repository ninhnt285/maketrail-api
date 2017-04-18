import { nodeDefinitions } from 'graphql-relay';

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId, { user }) => {
    let type = 'Viewer';

    if (globalId !== 'viewer-fixed') {
      type = 'test';
    }

    switch (type) {
      case 'test': return {
        id: globalId
      };
      default: return {
        id: 'viewer-fixed'
      };
    }
  },
  (obj) => {
    let type = 'Viewer';

    switch (type) {
      /*eslint-disable */
      default: return require('../types/viewer').default;
      /* eslint-enable */
    }
  }
);

export {
  nodeInterface,
  nodeField
};
