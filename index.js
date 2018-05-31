// call the packages we need
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var Employee = require('./employee-model');
var mongoose   = require('mongoose');
var mongo = require('mongodb');
var assert = require('assert');

var url = 'mongodb://127.0.0.1:27017/twaNew';


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




// set our port
var port = process.env.PORT || 8080;

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// // test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/addEmployee')

    .post(function(req, res) {

        var emp = new Employee();      // create a new instance of the Bear model
        emp.employee_fname = req.body.fname;  // set the bears name (comes from the request)
        emp.employee_lname = req.body.lname;
        emp.employee_id = req.body.id;
        console.log(emp);
        // mongo.connect(url, function(err, db) {
        //     console.log("hi");
        //     assert.equal(null, err);
        //     console.log(db);
        // });
        mongoose.connect(url, function(err, db) {
            if(err) {
                console.log(err);
            } else{
                console.log("done!!!");
                var emp = new Employee();      // create a new instance of the Bear model
                emp.employee_fname = req.body.fname;  // set the bears name (comes from the request)
                emp.employee_lname = req.body.lname;
                emp.employee_id = req.body.id;
                console.log(emp);
                // save the bear and check for errors
                emp.save(function(err) {
                    console.log("hi");
                    if (err)
                        res.send(err);
                    res.json({ message: 'Employee created!' });
                });
            }
        });



    });
// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);