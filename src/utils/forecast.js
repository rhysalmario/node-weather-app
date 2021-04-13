const request = require('request');

let forecast = (latitude, longitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=c578fa863f58be040e6072fe0936c35a&query=${latitude},${longitude}&units=f`
  request({ url, json: true}, (error, response) => {
    const { body } = response;
    if (error) {
      callback('Unable to connect to weather service!', undefined);
    } else if (body.error) {
      callback(body.error.info, undefined);
    } else {
      let data = body.current;
      callback(undefined, `${data.weather_descriptions[0]}. Temperature is ${data.temperature}. Feels like ${data.feelslike}`);
    }
  })
}

module.exports = forecast;