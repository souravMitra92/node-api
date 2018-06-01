var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var EmployeeSchema   = new Schema({
    employee_fname: String,
    employee_lname: String,
    employee_id: String
});

module.exports = mongoose.model('Employee', EmployeeSchema, 'employees');