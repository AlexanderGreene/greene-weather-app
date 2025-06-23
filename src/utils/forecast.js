const request = require('request');

const forecast = (latitude, longitude, callback) => {
	const baseUrl = 'http://api.weatherstack.com/current';
	const queryParams = {
		lat: latitude,
		long: longitude,
		// TODO: Don't store the api key here like this
		apiKey: '7b549f097c520ee732a0581c5741fd39',
	};
	const { lat, long, apiKey } = queryParams;
	//TODO: Make this url construction better
	const url =
		baseUrl +
		'?access_key=' +
		apiKey +
		'&query=' +
		lat +
		',' +
		long +
		// TODO: Make units configurable
		'&units=f';

	request({ url, json: true }, (error, { body } = {}) => {
		const { current, location } = body;
		const {
			weather_descriptions: descriptions,
			temperature,
			feelslike,
		} = current;
		const description = descriptions[0];
		if (error) {
			callback(
				'Unable to connect to weather service. See error below for details.\n' +
					error,
				undefined
			);
		} else if (body.error) {
			callback(body.error.info, undefined);
		} else {
			callback(undefined, {
				location: body.location.name,
				description,
				temperature: temperature + '\u00B0 F',
				feelslike: feelslike + '\u00B0 F',
			});
		}
	});
};

module.exports = forecast;

// // Weather simple example

// request({ url: url, json: true }, (error, response) => {
// 	if (error) {
// 		console.log(
// 			'Unable to connect to weather service. See error below for details.\n',
// 			error
// 		);
// 	} else if (response.body.error) {
// 		console.log(
// 			'Unable to find location. See error below for details.\n',
// 			response.body.error.info
// 		);
// 	} else {
// 		console.log(
// 			'The weather is currently ' +
// 				response.body.current.weather_descriptions[0].toLowerCase() +
// 				'. It is ' +
// 				response.body.current.temperature +
// 				' degrees out, but it feels like ' +
// 				response.body.current.feelslike +
// 				' degrees.'
// 		);
// 	}
// });
