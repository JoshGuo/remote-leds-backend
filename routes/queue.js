const router = require('express').Router();
let QueueModel = require('../models/queue.model');
const { application } = require('express');
const e = require('express');

//Get Requests

//Peek at entire queue
router.route('/').get((req, res) => {
    QueueModel.findOne()
        .then(Queue => res.json(Queue))
        .catch(err => res.status(400).json('Error: ' + err));
});

//Dequeue
router.route('/dequeue').get((req, res) => {
    QueueModel.findOne()
        .then(Queue => {
            if(Queue) {
                let queue = Queue.queue;
                if(queue.length === 0) {
                    res.status(400).json("There is nothing in the queue");
                }else{
                    let mode = queue.shift();
                    Queue.set("queue", queue).save().then(() => {
                        res.json(mode);
                    });
                }
            }else{
                res.status(400).json("There is no queue");
            }
        }).catch(err => res.status(400).json('Error: ' + err));
});

//Put Requests

//Enqueue
router.route('/enqueue').post((req, res) => {
    QueueModel.findOne()   
        .then(Queue => {
            if(Queue) {
                let queue = Queue.queue;
                queue.push(req.body);
                Queue.set("queue", queue).save().then(() => res.json("Saved!"));
            }else{
                new QueueModel({}).save().then(Queue => {
                    let queue = Queue.queue;
                    queue.push(req.body);
                    Queue.set("queue", queue).save().then(() => res.json("Saved!"));
                });
            }
        }).catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;