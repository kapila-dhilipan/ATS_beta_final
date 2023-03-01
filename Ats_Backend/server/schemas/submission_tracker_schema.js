const mongoose = require("mongoose");
const Schema = mongoose.Schema

const submission_tracker_schema = new Schema({
    submission_id: {type: Schema.Types.ObjectId, ref: 'submission'},
    demand_id: {type: Schema.Types.ObjectId, ref: 'demand'},
    candidate_id:{type: Schema.Types.ObjectId, ref: 'candidate'},
    status:{type:String, default:"initial_screening_select"},
    failed:{type:Boolean, default:false},
    remarks:[{type: Object}],
    is_deleted: { type: Boolean, default: false }
},
{
    timestamps: true
});

module.exports = submission_tracker_schema;

