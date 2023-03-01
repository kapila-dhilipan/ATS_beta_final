const mongoose = require("mongoose");
const Schema = mongoose.Schema

const demand_schema = new Schema({
    job_title: { type: String },
    assigned_to: {type: Schema.Types.ObjectId, ref: 'employee'},
    status:{ type: String },
    no_of_positions:{ type: Number },
    priority:{ type: String },
    client:{ type: String },
    job_description: { type: String },
    additional_details: { type: String },
    due_date:{ type: String },
    notice_period:{ type: String },
    minimum_experience:{ type: Number },
    maximum_experience:{ type: Number },
    mode_of_hire:{ type: String },
    vendor_name:{ type: String },
    poc_vendor:{ type: String },
    job_rr_id:{ type: String },
    skillset:[{type:Object}],
    lead:{type: String},
    created_by: {type: Schema.Types.ObjectId, ref: 'employee'},
    is_deleted: { type: Boolean, default: false }
},
{
    timestamps: true
});

module.exports = demand_schema;

