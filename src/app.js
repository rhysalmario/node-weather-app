const path = require('path');
const express = require('express');
const hbs = require('hbs');

const app = express()
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

//Setup handlebars engine
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'Rhys Almario'
  });
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Me',
    name: 'Rhys Almario'
  })
})

app.get('/help', (req, res) => {
  res.render('help', {
    message: 'Suggem some tiddies',
    title: 'Help',
    name: 'Rhys Almario'
  })
})

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'You must provide a location'
    });
  }

  geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
    if (error) {
      return res.send({
        error
      });
    }
  
    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({
          error
        });
      }
  
      console.log(location);
      console.log(forecastData);
      res.send({
        location,
        forecast: forecastData,
        address: req.query.address,
      });
    })
  })
  
})

app.get('/products', (req, res) => {
  if (!req.query.search) {
      return res.send({
        error: 'You must provide a search term'
      })
  }
  console.log(req.query);
  res.send({
    products: []
  })
})

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404 Error',
    errorMessage: 'Help article not found',
    name: 'Rhys Almario'
  });
})

app.get('*', (req, res) => {
  res.render('404', {    
    title: '404 Error',
    errorMessage: 'Page not found',
    name: 'Rhys Almario'
  })
})

app.listen(PORT, () => {
  console.log(`Server is up on port ${port}.`);
})