var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date
    },
    createdBy: {
        type: String
    },
    status: {
        type: String
    },
    dueDate: {
        type: Date
    },
    priority: {
        type: String
    }
});
var task = new mongoose.model('Task', schema);
module.exports = task;