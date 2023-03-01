const fast_connection = require("../connections/fastconnection");

class demand_services {

  static async create(data) {
    try {
      const new_demand = new fast_connection.models.demand(data);
      return await new_demand.save();
    } catch (error) {
      throw error;
    }
  }

  static async updateDemand(body) {
    try {
      return await fast_connection.models.demand.findOneAndUpdate({_id:body._id},body);
    } catch (error) {
      throw error;
    }
  }

  static async deleteDemand(_id) {
    try {
      return await fast_connection.models.demand.findOneAndUpdate({_id:_id},{is_deleted:true});
    } catch (error) {
      throw error;
    }
  }

  static async listDemands({skip,limit,sort_type,sort_field}) {
    try {
      return await fast_connection.models.demand.find({is_deleted:false}).populate([{path: 'assigned_to', select: '_id first_name last_name'}, {path: 'created_by', select: '_id first_name last_name'}]).skip(skip).limit(limit).sort([[sort_field, sort_type]]);
    } catch (error) {
      throw error;
    }
  }

  static async getDemandDetails(_id) {
    try {
      return await fast_connection.models.demand.findOne({is_deleted:false,_id:_id}).populate([{path: 'assigned_to', select: '_id first_name last_name'}, {path: 'created_by', select: '_id first_name last_name'}]);
    } catch (error) {
      throw error;
    }
  }

  static async searchDemand(field_name,filed_value) {
    try {
      let query_obj = {is_deleted:false}
      query_obj[field_name] = filed_value
      return await fast_connection.models.demand.find(query_obj).populate([{path: 'assigned_to', select: '_id first_name last_name'}, {path: 'created_by', select: '_id first_name last_name'}]);
    } catch (error) {
      throw error;
    }
  }
  

}

module.exports = demand_services;
