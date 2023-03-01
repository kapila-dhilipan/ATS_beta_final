const fast_connection = require("../connections/fastconnection");

class submission_services {

  static async create(data) {
    try {
      const new_submission = new fast_connection.models.submission(data);
      return await new_submission.save();
    } catch (error) {
      throw error;
    }
  }

  static async updateSubmission(body) {
    try {
      return await fast_connection.models.submission.findOneAndUpdate({_id:body._id},body);
    } catch (error) {
      throw error;
    }
  }

  static async deleteSubmission(_id) {
    try {
      return await fast_connection.models.submission.findOneAndUpdate({_id:_id},{is_deleted:true});
    } catch (error) {
      throw error;
    }
  }

  static async listSubmissions({skip,limit,sort_type,sort_field}) {
    try {
      return await fast_connection.models.submission.find({is_deleted:false}).populate([{path: 'submitted_by', select: '_id first_name last_name'}, {path: 'demand'}, {path: 'candidate'}]).skip(skip).limit(limit).sort([[sort_field, sort_type]]).skip(skip).limit(limit).sort([[sort_field, sort_type]]);
    } catch (error) {
      throw error;
    }
  }

  static async getSubmissionDetails(_id) {
    try {
      return await fast_connection.models.submission.findOne({is_deleted:false,_id:_id}).populate([{path: 'demand', select: '_id'}, {path: 'candidate'}]);
    } catch (error) {
      throw error;
    }
  }

  static async getSubmissionByDemand(demand) {
    try {
      return await fast_connection.models.submission.find({is_deleted:false,demand:demand}).populate([{path: 'submitted_by', select: '_id first_name last_name'}, {path: 'demand'}, {path: 'candidate'}]);
    } catch (error) {
      throw error;
    }
  }

  static async searchSubmission(field_name,filed_value) {
    try {
      let query_obj = {is_deleted:false}
      query_obj[field_name] = filed_value
      return await fast_connection.models.submission.find(query_obj).populate([{path: 'submitted_by', select: '_id first_name last_name'}, {path: 'demand'}, {path: 'candidate'}]);
    } catch (error) {
      throw error;
    }
  }
  

}

module.exports = submission_services;
