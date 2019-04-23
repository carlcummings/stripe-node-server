require('dotenv').config();
// Express Middleware
const express = require('express');
// Body Parser Middle ware
const bodyParser = require('body-parser');
// Stripe Library
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// Enable Cors
const cors = require('cors');
//Set up application
const app = express();

//Use Cors
app.use(cors())
//Use Body Parser
app.use(bodyParser.json());

// Create Dummy Route to test if working
app.get('/', (request, response) => {
  response.send("I am have successfully started a backend server");
});

// Create Payment Route
app.post('/payment', (request, response) => {
  // Stripe Charges
  stripe.charges.create({
      amount: request.body.price * 100,
      currency: 'usd',
      source: request.body.stripeToken,
      description: request.body.email,
      metadata: {
        name: request.body.name,
        email: request.body.email
      }
    })
    .then(charge => {
      response.send(charge);
    })
    .catch(err => {
      response.status(500).send({
        error: true,
        message: err.message
      })
    })
})

// Activate Server to start listening to defined port
app.listen(process.env.PORT, () => {
  console.log(`I am live on port ${process.env.PORT}`);
});