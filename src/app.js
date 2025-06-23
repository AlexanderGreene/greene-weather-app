const path = require('path');
const express = require('express');
const hbs = require('hbs');
const forecast = require('./utils/forecast');
const geocode = require('./utils/geocode');

const app = express();
const port = process.env.PORT || 3000;

// define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// enroll handlebars and views location into express
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

// app.com
app.get('', (req, res) => {
	res.render('index', {
		title: 'Weather App!',
		name: 'Alex Greene',
	});
});

// app.com/about
app.get('/about', (req, res) => {
	res.render('about', {
		title: 'About!',
		name: 'Alex Greene',
		description: 'handsome',
	});
});

// app.com/help
app.get('/help', (req, res) => {
	res.render('help', {
		title: 'Help!',
		name: 'Alex Greene',
		suggestion: 'turning it on and off again',
	});
});

app.get('/help/*', (req, res) => {
	res.render('404', {
		title: "404'd!",
		name: 'Alex Greene',
		message:
			"I couldn't find that help article!. Looks like you're on your own!",
	});
});

// app.com/weather;
app.get('/weather', (req, res) => {
	const { query } = req;
	if (!query.address) {
		return res.send({
			error: 'No address entered. Please try again.',
		});
	}
	geocode(query.address, (error, { latitude, longitude, location } = {}) => {
		if (error) return res.send({ error });
		forecast(
			latitude,
			longitude,
			(error, { description, temperature, feelslike } = {}) => {
				if (error) return res.send({ error });
				const { address } = query;
				res.send({
					address,
					location,
					description,
					temperature,
					feelslike,
				});
			}
		);
	});
});

// Demonstration endpoint (doesn't really do anything)
// app.get('/products', (req, res) => {
// 	if (!req.query.search) {
// 		return res.send({
// 			error: 'You must provide a search term!',
// 		});
// 	}
// 	res.send({
// 		products: [],
// 	});
// });

app.get('*', (req, res) => {
	res.render('404', {
		title: "404'd!",
		name: 'Alex Greene',
		message: "I couldn't find the thing. Try another thing!",
	});
});

app.listen(port, () => {
	console.log('Server running on port ' + port + '.');
});
