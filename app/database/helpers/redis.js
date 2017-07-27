import { createClient } from 'then-redis';

let redis = null;

try {
  redis = createClient({ reconnectionDelay: 5000 });
  // redis = createClient('tcp://localhost:6379');
  redis.on('error', (err) => {
    console.error('Error connecting to redis', err);
  });
} catch (e) {
  console.log('Init redis failed!');
}

const RedisService = {};

RedisService.get = async function (id) {
  try {
    if (!redis) return null;
    return JSON.parse(await redis.get(id));
  } catch (e){
    console.log(e);
  }
};

RedisService.set = async function (id, obj) {
  try {
    if (!redis) return;
    delete obj._id;
    await redis.set(id, JSON.stringify(obj));
  } catch (e){
    console.log(e);
  }
};

export default RedisService;
