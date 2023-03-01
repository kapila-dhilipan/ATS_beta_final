const demand_services = require("../services/demand_services")
const Excel =require('exceljs')
const crypto = require('crypto')
const fs = require('fs')
const {ISOdateToCustomDate } = require("../utils/ISO_date_helper")

const createDemand = {
    controller: async (req, res) => {
        let new_obj = {...req.body}
        new_obj["created_by"] = req.auth.user_id
        let new_demand = await demand_services.create(new_obj)
        res.respond(new_demand, 200, 'Demand created successfully.');
    }
}

const updateDemand = {
    controller: async (req, res) => {
        await demand_services.updateDemand(req.body)
        res.respond("Demand updated successfully", 200, 'Demand updated successfully.');
    }
}

const deleteDemand = {
    controller: async (req, res) => {
        await demand_services.deleteDemand(req.body._id)
        res.respond("Demand deleted successfully", 200, 'Demand deleted successfully.');
    }
}

const listDemands = {
    controller: async (req, res) => {
        let demands = await demand_services.listDemands(req.query)
        res.respond(demands, 200, 'Demands fetched sucessfully');
    }
}


const downloadDemands = {
    controller: async (req,res)=>{

        let random_prefix = crypto.randomBytes(20).toString('hex')
        let demands = await demand_services.listDemands(req.query)
        let excel_demands = demands.map(d=>{
            let transformed = {
                demand_id:d?._id,
                requirement: d?.job_title,
                received_date: ISOdateToCustomDate(d?.createdAt),
                POC: d?.poc_vendor,
                sub_vendor: d?.vendor_name,
                lead: d?.created_by?.first_name + ' ' + d?.created_by?.last_name,
                client: d?.client,
                minimum_experience_months: d?.minimum_experience,
                primary_skill: d?.skillset?.[0]?.skill,
                primary_skill_experience_months: d?.skillset?.[0]?.exp,
                secondary_skill: d?.skillset?.[1]?.skill,
                secondary_skill_experience_months: d?.skillset?.[1]?.exp,
                timestamp:ISOdateToCustomDate(d?.updatedAt)
            }
            return transformed
        })
        let workbook = new Excel.Workbook();
        let worksheet = workbook.addWorksheet("demand_list");

        worksheet.columns = [
            { header: 'demand_id', key: 'demand_id' },
            { header: 'requirement', key: 'requirement' },
            { header: 'received_date', key: 'received_date' },
            { header: 'POC', key: 'POC' },
            { header: 'sub_vendor', key: 'sub_vendor'},
            { header: 'lead', key: 'lead' },
            { header: 'client', key: 'client' },
            { header: 'minimum_experience_months', key: 'minimum_experience_months' },
            { header: 'primary_skill', key: 'primary_skill' },
            { header: 'primary_skill_experience_months', key: 'primary_skill_experience_months' },
            { header: 'secondary_skill', key: 'secondary_skill' },
            { header: 'secondary_skill_experience_months', key: 'secondary_skill_experience_months' },
            { header: 'timestamp', key: 'timestamp' }
        ]
        worksheet.addRows(excel_demands);
        await workbook.xlsx
        .writeFile(`./${random_prefix}_list.xlsx`)
        .then(function () {
            res.download(`./${random_prefix}_list.xlsx`, 'list.xlsx', function (err) {
                if (err) {
                    console.log(err)
                } else {
                    fs.unlink(`./${random_prefix}_list.xlsx`, function() {
                        console.log(`${random_prefix}_list.xlsx file deleted`)
                        });
                }
                })
        });

        



    }

}
    


const getDemandDetails = {
    controller: async (req, res) => {
        let demand = await demand_services.getDemandDetails(req.query.demand_id)
        res.respond(demand, 200, 'Demands fetched sucessfully');
    }
}

const searchDemand = {
    controller: async (req, res) => {
        let demand = await demand_services.searchDemand(req.query.field_name,req.query.field_value)
        res.respond(demand, 200, 'Demands fetched sucessfully');
    }
}


module.exports = { 
    createDemand,
    updateDemand,
    deleteDemand,
    listDemands,
    getDemandDetails,
    searchDemand,
    downloadDemands
}