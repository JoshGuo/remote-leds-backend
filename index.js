const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//MongoDB and Mongoose
const uri = process.env.ATLAS_URI
mongoose.connect("mongodb+srv://jjguo:NHY6f1enDADHAOZJ@main-cluster.9ozqm.gcp.mongodb.net/led_constellation?retryWrites=true&w=majority", {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});

mongoose.connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
})

//Routes
const ledsRouter = require('./routes/leds');
const queueRouter = require('./routes/queue');

app.use('/leds', ledsRouter);
app.use('/queue', queueRouter);

//Launch App
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})