const express = require ('express');
const connectDB = require ('./config/db');
const { check, validationResult } = require('express-validator');
const path = require('path');


const app = express ();


// Connect database

connectDB();

//init Middleware
app.use(express.json({ extended: false}));

// removed for production--> app.get('/', (req, res) => res.send('API running'));

// define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

// Serve static assets in production

if(process.env.NODE_ENV === 'production') {
    //set static folder

    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client','index.html' ));
    });
}


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));