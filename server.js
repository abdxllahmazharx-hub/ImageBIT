// server.js
const express = require('express');
const stripe = require('stripe')('whsec_280a7aa0fea3c07f1e688265b2cbc9344049b53ec94c7282248573c430af0f42');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080; // Railway sets the PORT automatically

// Serve all static files (HTML, images, CSS, JS) from the root folder
app.use(express.static(path.join(__dirname)));

// Stripe webhook endpoint
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, 'endpoint_secret_de_la_stripe');
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log(`Payment received! Add credits for: ${session.customer_details.email}`);
    // TODO: add your database logic here
  }

  res.json({ received: true });
});

// Catch-all route for 404 (optional)
app.use((req, res) => res.status(404).send('Page not found'));

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
