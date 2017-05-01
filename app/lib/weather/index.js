/**
 * Created by hoangtran on 4/29/2017.
 */
import request from 'request-promise';

export async function getForecastOne(lat, lng, time) {
  try {
    const options = {
      method: 'GET',
      uri: `https://api.darksky.net/forecast/39b9ea3d97d443d633bab7ad089a0a3e/${lat},${lng},${time}`,
      qs: {
        exclude: 'currently,hourly,flags',
      }
    };
    const res = JSON.parse(await request(options)
      .then(ggRes => ggRes)).daily.data[0];
    return res;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function getForecastWithHistory(lat, lng, time) {
  try {
    const date = new Date(time * 1000);
    const inp = [time];
    for (let i = 0; i < 3; i++) {
      date.setYear(date.getFullYear() - 1);
      inp.push(date.getTime() / 1000);
    }
    const data = await Promise.all(inp.map(t => getForecastOne(lat, lng, t)));
    return {
      lat,
      lng,
      data
    };
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function getForecast(lat, lng, time) {
  try {
    if (time) return await getForecastWithHistory(lat, lng, time);
    const options = {
      method: 'GET',
      uri: `https://api.darksky.net/forecast/39b9ea3d97d443d633bab7ad089a0a3e/${lat},${lng}`,
      qs: {
        exclude: 'currently,hourly,flags,minutely',
      }
    };
    const data = JSON.parse(await request(options)
      .then(ggRes => ggRes)).daily.data;
    return {
      lat,
      lng,
      data
    };
  } catch (e) {
    console.log(e);
    return null;
  }
}
