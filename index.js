const express = require('express');
const stripe = require('stripe')('sk_test_51HoxQlHz');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const PORT = 8080;
const app = express();


//middleware
app.use(express.json());
app.use(cors());



//routes
app.get('/', (req, res) => {
    res.send('Success')
});

app.post('/payment', (req, res) => {

    const { product, token } = req.body;
    console.log('PRODUCT', product);
    console.log('PRICE', product.price);
    const itempontencyKey = uuid();

    return stripe.customers.create({
        email: token.email,
        source: token.id
    }).then(customer => {
        stripe.charges.create({
            amount: product.price * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: `purchase of product.name`,
            shipping: {
                name: token.card.name,
                address: {
                    country: token.card.address_country,
                }
            } 
        }, {itempontencyKey})
    })
    .then(result => res.status(200).json(result))
    .catch(err => console.log(err))

});


//listen
app.listen(PORT, () => 
    console.log(`Listening on PORT ${PORT}`)
);