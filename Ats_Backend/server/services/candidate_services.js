const fast_connection = require("../connections/fastconnection");

class candidate_services {

  static async create(data) {
    try {
      const new_candidate = new fast_connection.models.candidate(data);
      return await new_candidate.save();
    } catch (error) {
      throw error;
    }
  }

  static async updateCandidate(body) {
    try {
      return await fast_connection.models.candidate.findOneAndUpdate({_id:body._id},body);
    } catch (error) {
      throw error;
    }
  }

  static async deleteCandidate(_id) {
    try {
      return await fast_connection.models.candidate.findOneAndUpdate({_id:_id},{is_deleted:true});
    } catch (error) {
      throw error;
    }
  }

  static async listCandidates({skip,limit,sort_type,sort_field}) {
    try {
      return await fast_connection.models.candidate.find({is_deleted:false}).populate("created_by", { _id: 1, first_name: 1, last_name: 1}).skip(skip).limit(limit).sort([[sort_field, sort_type]]);
    } catch (error) {
      throw error;
    }
  }

  static async getCandidateDetails(_id) {
    try {
      return await fast_connection.models.candidate.findOne({is_deleted:false,_id:_id}).populate("created_by", { _id: 1, first_name: 1, last_name: 1});
    } catch (error) {
      throw error;
    }
  }

  static async searchCandidates(field_name,filed_value) {
    try {
      let query_obj = {is_deleted:false}
      query_obj[field_name] = filed_value
      return await fast_connection.models.candidate.find(query_obj).populate("created_by", { _id: 1, first_name: 1, last_name: 1});
    } catch (error) {
      throw error;
    }
  }

  
  

}

module.exports = candidate_services;