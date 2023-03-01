const submission_services = require("../services/submission_services")
const submission_tracker_services = require("../services/submission_tracker_services")
const Excel =require('exceljs')
const crypto = require('crypto')
const fs = require('fs')
const {ISOdateToCustomDate} = require('../utils/ISO_date_helper')

const createSubmission = {
    controller: async (req, res) => {
        let new_obj = {...req.body}
        new_obj["submitted_by"] = req.auth.user_id
        let new_submission = await submission_services.create(new_obj)
        let submission_tracker_obj = {
            submission_id: new_submission._id,
            demand_id: req.body.demand,
            candidate_id: req.body.candidate
        }
        await submission_tracker_services.create(submission_tracker_obj)
        res.respond(new_submission, 200, 'Submission created successfully.');
    }
}

const updateSubmission = {
    controller: async (req, res) => {
        await submission_services.updateSubmission(req.body)
        res.respond("Submission updated successfully", 200, 'Submission updated successfully.');
    }
}

const deleteSubmission = {
    controller: async (req, res) => {
        await submission_services.deleteSubmission(req.body._id)
        res.respond("Submission deleted successfully", 200, 'Submission deleted successfully.');
    }
}

const listSubmissions = {
    controller: async (req, res) => {
        let submissions = await submission_services.listSubmissions(req.query)
        res.respond(submissions, 200, 'Submissionss fetched sucessfully');
    }
}

const downloadSubmissions = {
    controller: async (req, res) => {

        let random_prefix = crypto.randomBytes(20).toString('hex')
        let submissions = await submission_services.listSubmissions(req.query)
        let excel_submissions = submissions.map(s=>{
            let transformed = {
                demand_id:s?.demand?._id,
                recruiter: s?.submitted_by?.first_name + ' ' +  s?.submitted_by?.last_name,
                submission_id:s?._id,
                submission_date:ISOdateToCustomDate(s?.createdAt),
                candidate_id: s?.candidate?._id,
                mobile: s?.candidate?.mobile_number,
                email: s?.candidate?.email,
                status: s?.status
            }
            return transformed
        })
        let workbook = new Excel.Workbook();
        let worksheet = workbook.addWorksheet("submission_list");

        worksheet.columns = [
            { header: 'demand_id', key: 'demand_id' },
            { header: 'recruiter', key: 'recruiter' },
            { header: 'submission_id', key: 'submission_id' },
            { header: 'submission_date', key: 'submission_date' },
            { header: 'candidate_id', key: 'candidate_id'},
            { header: 'mobile', key: 'mobile' },
            { header: 'email', key: 'email' },
            { header: 'status', key: 'status' },
        ]
        worksheet.addRows(excel_submissions);
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

const getSubmissionDetails = {
    controller: async (req, res) => {
        let submission = await submission_services.getSubmissionDetails(req.query.submission_id)
        res.respond(submission, 200, 'Submission fetched sucessfully');
    }
}

const updateSubmissionTracker = {
    controller: async (req, res) => {
        await submission_tracker_services.updateSubmissionTracker(req.body)
        res.respond("Submission tracker updated successfully", 200, 'Submission tracker updated successfully.');
    }
}

const getSubmissionByDemand = {
    controller: async (req, res) => {
        let submission = await submission_services.getSubmissionByDemand(req.query.demand_id)
        res.respond(submission, 200, 'Submissions fetched sucessfully');
    }
}

const getSubmissionTracker = {
    controller: async (req, res) => {
        let submission = await submission_tracker_services.getSubmissionTrackerDetails(req.query.submission_id)
        res.respond(submission, 200, 'Submission tracker fetched sucessfully');
    }
}

const searchSubmission = {
    controller: async (req, res) => {
        let submissions = await submission_services.searchSubmission(req.query.field_name,req.query.field_value)
        res.respond(submissions, 200, 'Submission fetched sucessfully');
    }
}

module.exports = { 
    createSubmission,
    updateSubmission,
    deleteSubmission,
    getSubmissionDetails,
    listSubmissions,
    updateSubmissionTracker,
    getSubmissionByDemand,
    getSubmissionTracker,
    searchSubmission,
    downloadSubmissions
}