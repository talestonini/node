const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const SERVER_PORT = process.env.PORT || 3000;
const LOG_FILE = 'server.log';

let app = express();
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.use((req, res, next) => {
  let now = new Date().toString();
  let log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile(LOG_FILE, log + '\n', (err) => {
    if (err) {
      console.log(`Unable to append to ${LOG_FILE}`);
    }
  });
  next();
});

// app.use((req, res, next) => {
//   res.render('maintenance.hbs', {
//     pageTitle: 'We\'ll be right back',
//     msg: 'Sorry. We\'re undergoing some maintenance at the moment...'
//   });
// });

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('currYear', () => new Date().getFullYear());
hbs.registerHelper('screamIt', (text) => text.toUpperCase());

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    user: 'Tales Tonini'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMsg: 'Sorry. Something went bad...'
  });
});

app.listen(SERVER_PORT, () => {
  console.log('Server is up on port', SERVER_PORT);
});
