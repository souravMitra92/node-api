// call the packages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Employee = require('./employee-model');
var mongoose = require('mongoose');
var mongo = require('mongodb');
var assert = require('assert');

var url = 'mongodb://127.0.0.1:27017/twa';


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




var port = process.env.PORT || 8080;

var router = express.Router();

router.use(function (req, res, next) {
    next();
});

// // test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/addEmployee').post(function (req, res) {
    var respJson = getResponseStructure();
    var emp = new Employee();
    emp.employee_fname = req.body.fname;
    emp.employee_lname = req.body.lname;
    emp.employee_id = req.body.id;
    mongoose.connect(url, function (err, db) {
        if (err) {
            respJson.response.header.statusCode = "9999";
            respJson.response.header.statusDesc = "Service error. Please try again.";
            res.json(respJson);
            mongoose.disconnect();
        } else {
            console.log("done!!!");
            var emp = new Employee();
            emp.employee_fname = req.body.fname;
            emp.employee_lname = req.body.lname;
            emp.employee_id = req.body.id;
            Employee.find({ "employee_id": emp.employee_id }, function (err, docs) {
                if (docs.length) {
                    respJson.response.header.statusCode = "0001";
                    respJson.response.header.statusDesc = "Employee exists already.";
                    res.json(respJson);
                    mongoose.disconnect();
                } else {
                    emp.save(function (err) {
                        if (err) {
                            respJson.response.header.statusCode = "9999";
                            respJson.response.header.statusDesc = "Service error. Please try again.";
                            res.json(respJson);
                            mongoose.disconnect();
                        } else {
                            respJson.response.header.statusCode = "0000";
                            respJson.response.header.statusDesc = "Employee inserted successfully.";
                            res.json(respJson);
                            mongoose.disconnect();
                        }
                    });
                }
            });
        }
    });
})
router.route('/getRecord').post(function(req, res) {
    /*
    {
	    "fetchAll": true
    }
    -OR-
    {
        "fetchAll": false,
        "id": "441297"
    }
    */
    var respJson = {
        "response": {
            "header": {
                "statusCode": "",
                "statusDesc": ""
            },
            "body": {
                "employees": []
            }
        }
    };
    mongoose.connect(url, function (err, db) {
        if (err) {
            respJson.response.header.statusCode = "9999";
            respJson.response.header.statusDesc = "Service error. Please try again.";
            res.json(respJson);
            mongoose.disconnect();
        } else {
            console.log("done!!!");
            var requestPayload = req.body.fetchAll ? {} : { "employee_id": req.body.id }
            Employee.find(requestPayload, function (err, docs) {
                if (docs.length) {
                    respJson.response.header.statusCode = "0000";
                    respJson.response.header.statusDesc = "Record found.";
                    respJson.response.body.employees = docs;
                    res.json(respJson);
                    mongoose.disconnect();
                } else {
                    respJson.response.header.statusCode = "0001";
                    respJson.response.header.statusDesc = "Record not found.";
                    res.json(respJson);
                    mongoose.disconnect();
                }
            });
        }
    });
})

router.route('/removeRecord').post(function(req, res) {
    /*
    {
        "id": "441297"
    }
    */
    var respJson = getResponseStructure();

    mongoose.connect(url, function (err, db) {
        if (err) {
            respJson.response.header.statusCode = "9999";
            respJson.response.header.statusDesc = "Service error. Please try again.";
            res.json(respJson);
            mongoose.disconnect();
        } else {
            console.log("done!!!");
            var requestPayload = { "employee_id": req.body.id }
            Employee.find(requestPayload).remove().exec(function(err, response){
                if(err) {
                    respJson.response.header.statusCode = "9999";
                    respJson.response.header.statusDesc = "Service error. Please try again.";
                    res.json(respJson);
                } else {
                    if (response.n > 0) {
                        respJson.response.header.statusCode = "0000";
                        respJson.response.header.statusDesc = "Record removed.";
                    } else {
                        respJson.response.header.statusCode = "0001";
                        respJson.response.header.statusDesc = "Record not found.";
                    }
                    res.json(respJson);
                }
            });
        }
    });
})

router.route('/updateRecord').post(function(req, res) {
    /*
    {
        "fname": "Subir",
        "lname": "Mitra",
        "id": "123456"
    }
    */
    var respJson = getResponseStructure();
    mongoose.connect(url, function (err, db) {
        if (err) {
            respJson.response.header.statusCode = "9999";
            respJson.response.header.statusDesc = "Service error. Please try again.";
            res.json(respJson);
            mongoose.disconnect();
        } else {
            console.log("done!!!");
            var requestPayload = { "id": "123456" }
            Employee.findOneAndUpdate( requestPayload, {$set: {"fname": "Santu"}}, {new: true}, function(err, docs){
                if(err) {
                    console.log(err);
                } else {
                    console.log(docs);
                }
            });
        }
    });
})

app.use('/api', router);


function getResponseStructure() {
    var resp = {
        "response": {
            "header": {
                "statusCode": "",
                "statusDesc": ""
            }
        }
    }
    return resp;
}

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);