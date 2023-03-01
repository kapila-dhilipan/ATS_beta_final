const candidate_services = require("../services/candidate_services")
const Excel =require('exceljs')
const crypto = require('crypto')
const fs = require('fs')
const {ISOdateToCustomDate } = require("../utils/ISO_date_helper")

const createCandidate = {
    controller: async (req, res) => {
        let new_obj = {...req.body}
        new_obj["created_by"] = req.auth.user_id
        let new_candidate = await candidate_services.create(new_obj)
        res.respond(new_candidate, 200, 'New candidate created successfully.');
    }
}

const updateCandidate = {
    controller: async (req, res) => {
        await candidate_services.updateCandidate(req.body)
        res.respond("Candidate updated successfully", 200, 'Candidate updated successfully.');
    }
}

const deleteCandidate = {
    controller: async (req, res) => {
        await candidate_services.deleteCandidate(req.body._id)
        res.respond("Candidate deleted successfully", 200, 'Candidate deleted successfully.');
    }
}

const listCandidates = {
    controller: async (req, res) => {
        let Candidates = await candidate_services.listCandidates(req.query)
        res.respond(Candidates, 200, 'Candidates fetched sucessfully');
    }
}

const downloadCandidates ={ 
    controller: async (req,res)=>{

        let random_prefix = crypto.randomBytes(20).toString('hex')
        let candidates = await candidate_services.listCandidates(req.query)
        let excel_candidates = candidates.map(c=>{
            let transformed = {
                candidate_id:c?._id,
                candidate_name: c?.first_name + ' ' + c?.last_name,
                date_of_sourcing: c?.createdAt,
                mobile_number:c?.mobile_number,
                email: c?.email,
                recruiter: c?.created_by?.first_name + ' '+c?.created_by?.last_name,
                primary_skill: c?.skillset?.[0]?.skill,
                primary_skill_experience_months: c?.skillset?.[0]?.exp,
                secondary_skill: c?.skillset?.[1]?.skill,
                secondary_skill_experience_months: c?.skillset?.[1]?.exp,
                notice_period:c?.notice_period,
                current_company: c?.employment_details?.[0]?.company_name,
                current_location: c?.current_location,
                current_ctc: c?.employment_details?.[0]?.ctc,
                expected_ctc: c?.expected_ctc,
                preferred_location: c?.prefered_location,
                resume_link: c?.resume_url ,
                status: c?.status,
                timestamp:ISOdateToCustomDate(c?.updatedAt)
            }
            return transformed
        })
        let workbook = new Excel.Workbook();
        let worksheet = workbook.addWorksheet("candidate_list");

        worksheet.columns = [
            { header: 'candidate_id', key: 'candidate_id' },
            { header: 'candidate_name', key: 'candidate_name' },
            { header: 'date_of_sourcing', key: 'date_of_sourcing' },
            { header: 'mobile_number', key: 'mobile_number' },
            { header: 'email', key: 'email'},
            { header: 'recruiter', key: 'recruiter' },
            { header: 'primary_skill', key: 'primary_skill' },
            { header: 'primary_skill_experience_months', key: 'primary_skill_experience_months' },
            { header: 'secondary_skill', key: 'secondary_skill' },
            { header: 'secondary_skill_experience_months', key: 'secondary_skill_experience_months' },
            { header: 'notice_period', key: 'notice_period' },
            { header: 'current_company', key: 'current_company' },
            { header: 'current_location', key: 'current_location' },
            { header: 'current_ctc', key: 'current_ctc' },
            { header: 'expected_ctc', key: 'expected_ctc' },
            { header: 'preferred_location', key: 'preferred_location' },
            { header: 'resume_link', key: 'resume_link' },
            { header: 'status', key: 'status' },
            { header: 'timestamp', key: 'timestamp' }
            


        ]
        worksheet.addRows(excel_candidates);
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

const getCandidateDetails = {
    controller: async (req, res) => {
        let Candidate = await candidate_services.getCandidateDetails(req.query.candidate_id)
        res.respond(Candidate, 200, 'Candidate fetched sucessfully');
    }
}

const searchCandidates = {
    controller: async (req, res) => {
        let Candidate = await candidate_services.searchCandidates(req.query.field_name,req.query.field_value)
        res.respond(Candidate, 200, 'Candidate fetched sucessfully');
    }
}

const uploadCandidateResume = {
    controller: async (req, res) => {
        res.respond({document:req.file.location}, 200, 'Document uploaded sucessfully');
    }
}


module.exports = { 
    createCandidate,
    updateCandidate,
    deleteCandidate,
    listCandidates,
    getCandidateDetails,
    uploadCandidateResume,
    downloadCandidates,
    searchCandidates
}