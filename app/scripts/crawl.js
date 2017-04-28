import request from 'request-promise';
import CategoryModel from '../database/models/category';
import connectDb from '../database/connectDb';

async function extract(categories, parentId = 'rootCategory') {
  categories.forEach(async (category) => {
    let tmp = await CategoryModel.findOne({ foursquareId: category.id });
    if (!tmp) {
      tmp = await CategoryModel.create({
        foursquareId: category.id,
        name: category.name,
        pluralName: category.pluralName,
        shortName: category.shortName,
        parentId
      });
    }
    if (category.categories) {
      extract(category.categories, tmp.id);
    }
  });
}

async function onConnected() {
  const options = {
    method: 'GET',
    uri: 'https://api.foursquare.com/v2/venues/categories',
    qs: {
      oauth_token: 'LUAYPC4BD2FR3WSOZ4QQ0RZ34BKWISMYUSXEZKNWBKU0OAEH',
      v: '20170427'
    },
    encoding: 'utf8'
  };
  await request(options)
    .then((res) => {
      const categories = JSON.parse(res).response.categories;
      extract(categories);
    });
  console.log('done');
}

connectDb(onConnected);

