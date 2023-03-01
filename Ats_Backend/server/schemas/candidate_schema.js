const mongoose = require("mongoose");
const Schema = mongoose.Schema

const candidate_schema = new Schema({
    first_name:{ type: String },
	last_name:{ type: String },
	email:{ type: String },
	mobile_number:{ type: String },
	gender:{ type: String },
	state: { type: String },
	city:{ type: String },
	pincode:{ type: String },
	current_location: { type: String },
	willing_to_relocate: { type: Boolean },
	prefered_location:{ type: String },
	expected_ctc:{ type: String },
	notice_period:{ type: String },
	status:{ type: String },
	prefered_mode_of_hire:{ type: String },
	resume_url: { type: String },
    skillset:[{type:Object}],
    employment_details:[{type:Object}],
    created_by: {type: Schema.Types.ObjectId, ref: 'employee'},
    is_deleted: { type: Boolean, default: false }
},
{
    timestamps: true
});

module.exports = candidate_schema;

