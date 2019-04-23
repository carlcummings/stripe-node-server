require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const app = express();


app.use(cors())
app.use(bodyParser.json());

app.get('/', (request, response) => {
  response.send("I am have successfully started a backend server");
});

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

app.listen(process.env.PORT, () => {
  console.log(`I am live on port ${process.env.PORT}`);
});