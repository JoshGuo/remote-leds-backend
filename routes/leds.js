const router = require('express').Router();
let LED = require('../models/led.model');
const { application } = require('express');

//Get Requests

//Get All LEDs
router.route('/').get((req, res) => {
    LED.find()
        .then(LEDs => res.json(LEDs))
        .catch(err => res.status(400).json('Error: ' + err));
});

//Post Requests

//Add New LED
router.route('/add').post((req, res) => {
    const name = req.body.name;
    const pos = req.body.pos;
    const hexColor = req.body.color;

    LED.findOne({pos: pos}).then((led) => {
        if(led) { //If there is an existing LED, throw error
            res.status(400).json("LED already exists at this position");
        } else if(pos < 0 || pos > 299) {
            res.status(400).json("Invalid index selected for the LED");
        } else {
            const newLED = new LED({
                        name, 
                        pos, 
                        hexColor
                    });
            newLED.save().then(() => res.json(`LED (${pos}) by ${name} with color ${hexColor} created`));
        }
    }).catch((err) => res.json(err));
});

//Clear LEDs
router.route('/delete/:pass').post((req, res) => {
    const password = req.params.pass;
    if (password === 'admin') {
         LED.remove().then(() => res.json("Documents Deleted"));
    }else {
        res.status(401).json('Incorrect Password');
    }
});

module.exports = router;