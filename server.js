const stripe = require('stripe')('whsec_280a7aa0fea3c07f1e688265b2cbc9344049b53ec94c7282248573c430af0f42');
const express = require('express');
const path = require('path');
const app = express();

// Serve your static HTML/CSS/JS from the /main folder
app.use(express.static(path.join(__dirname, 'main')));

// Stripe webhook route
app.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
  const sig = request.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, 'endpoint_secret_de_la_stripe');
  } catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log(`Payment received! Add credits for: ${session.customer_details.email}`);
  }

  response.json({ received: true });
});

// Serve index.html on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'main', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
