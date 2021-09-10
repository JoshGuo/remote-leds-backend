const router = require('express').Router();
let QueueModel = require('../models/queue.model');
const { application } = require('express');
const e = require('express');

//Get Requests

//Peek at entire queue
router.route('/').get((req, res) => {
    QueueModel.findOne()
        .then((Queue) => {
            if(Queue)
                res.json(Queue);
            else{
                new QueueModel({}).save().then((Queue) => res.json(Queue));
            }
        }).catch(err => res.status(400).json('Error: ' + err));
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
                    Queue.currentMode = mode;
                    Queue.dequeueHistory.push(mode);
                    if(Queue.dequeueHistory.length > 10) Queue.dequeueHistory.shift();
                    Queue.save().then(() => {
                        res.json(mode);
                    });
                }
            }else{
                res.status(400).json("There is no queue");
            }
        }).catch(err => res.status(400).json('Error: ' + err));
});

//Dequeue First
router.route('/current').get((req, res) => {
  QueueModel.findOne()
    .then(Queue => {
      if(Queue) {
        let {currentMode} = Queue;
        if(!currentMode) {
          res.status(400).json("No current mode found");
        }else {
          res.json(currentMode);
        }
      }else{
        res.status(400).json("There is no queue");
      }
    }).catch(err => res.status(400).json('Error: asdf ' + err));
})

//Put Requests

//Enqueue
router.route('/enqueue').post((req, res) => {
    if(verifyEnqueueRequest(req.body)){
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
    }else {
        res.status(400).json("Error: Incorrect parameters for body");
    }
});

//Destroy queue
router.route('/destroy').post((req, res) => {
    QueueModel.findOneAndDelete()
        .then(() => res.json("Queue deleted"))
        .catch((err) => res.status(400).json("Error: " + err));
})

function verifyEnqueueRequest(body) {
    if(body.mode === null || !body.name)  {console.log("Missing");return false;}
    switch(body.mode) {
        case 0: if(!body.color) return false; 
                break;
        case 1: if(body.color) return false; 
                break;
        case 2: if(!body.color) return false; 
                break;
        default:
    }
    return true;
}

module.exports = router;