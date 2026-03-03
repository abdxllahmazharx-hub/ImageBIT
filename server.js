    const stripe = require('stripe')('whsec_280a7aa0fea3c07f1e688265b2cbc9344049b53ec94c7282248573c430af0f42');
const express = require('express');
const app = express();

app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, 'endpoint_secret_de_la_stripe');
  } catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Aici e magia: daca plata a reusit
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Aici scrii codul care adauga creditele in baza de date
    console.log(`Bani primiti! Adauga credite pentru: ${session.customer_details.email}`);
  }

  response.json({received: true});
});

app.listen(4242, () => console.log('Serverul asculta pe portul 4242'));