const fast_connection = require("../connections/fastconnection");

class user_services {

  static async create(data) {
    try {
      const new_employee = new fast_connection.models.employee(data);
      return await new_employee.save();
    } catch (error) {
      throw error;
    }
  }

  static async getByEmail(email) {
    try {
      return await fast_connection.models.employee.findOne({email:email});
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      return await fast_connection.models.employee.findOne({_id:id}).populate({path:"reports_to",select:["_id","first_name","last_name"]});
    } catch (error) {
      throw error;
    }
  }

  static async getByType(role) {
    try {
      return await fast_connection.models.employee.find({role,is_deleted:false}).select(["_id","first_name","last_name","email"]);
    } catch (error) {
      throw error;
    }
  }

  static async listEmployees({skip,limit,sort_type,sort_field}) {
    try {
      return await fast_connection.models.employee.find({is_deleted:false}).skip(skip).limit(limit).sort([[sort_field, sort_type]]);
    } catch (error) {
      throw error;
    }
  }

  static async updateEmployee(body) {
    try {
      return await fast_connection.models.employee.findOneAndUpdate({_id:body._id},body);
    } catch (error) {
      throw error;
    }
  }

  static async getByReportsto(reports_to) {
    try {
      return await fast_connection.models.employee.find({reports_to,is_deleted:false}).select(["_id","first_name","last_name"]);
    } catch (error) {
      throw error;
    }
  }


  static async deleteEmployee(employee_id) {
    try {
      return await fast_connection.models.employee.findOneAndUpdate({_id:employee_id},{is_deleted:true});
    } catch (error) {
      throw error;
    }
  }

  static async searchEmployee(field_name,filed_value) {
    try {
      let query_obj = {is_deleted:false}
      query_obj[field_name] = filed_value
      return await fast_connection.models.employee.find(query_obj);
    } catch (error) {
      throw error;
    }
  }
  
}

module.exports = user_services;
