// call the packages we need
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var Employee = require('./employee-model');
var mongoose   = require('mongoose');
var mongo = require('mongodb');
var assert = require('assert');

var url = 'mongodb://127.0.0.1:27017/twa';


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




var port = process.env.PORT || 8080;

var router = express.Router();

router.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});

// // test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/addEmployee').post(function(req, res) {
        var respJson = {
            "response": {
                "header": {
                    "statusCode": "",
                    "statusDesc": ""
                }
            }
        }
        var emp = new Employee();      
        emp.employee_fname = req.body.fname;
        emp.employee_lname = req.body.lname;
        emp.employee_id = req.body.id;
        mongoose.connect(url, function(err, db) {
            if(err) {
                console.log(err);
            } else{
                console.log("done!!!");
                var emp = new Employee(); 
                emp.employee_fname = req.body.fname;
                emp.employee_lname = req.body.lname;
                emp.employee_id = req.body.id;
                Employee.find({"employee_id": emp.employee_id}, function(err, docs){
                    if (docs.length){
                        respJson.response.header.statusCode = "0001";
                        respJson.response.header.statusDesc = "Employee exists already.";
                        res.json(respJson);
                    } else{
                        emp.save(function(err) {
                            if (err){
                                respJson.response.header.statusCode = "9999";
                                respJson.response.header.statusDesc = "Service error. Please try again.";
                                res.json(respJson);
                            } else {
                                respJson.response.header.statusCode = "0000";
                                respJson.response.header.statusDesc = "Employee inserted successfully.";
                                res.json(respJson);
                            }   
                        });
                    }
                });
            }
        });



    });

app.use('/api', router);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);