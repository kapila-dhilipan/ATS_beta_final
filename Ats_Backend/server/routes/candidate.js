const express = require("express");
const router = express.Router();
const candidate_controller = require("../controllers/candidate_controller")
const {mediaUploadS3} = require("../utils/s3_helper")


router.post("/createCandidate", candidate_controller.createCandidate.controller)
router.post("/updateCandidate", candidate_controller.updateCandidate.controller)
router.post("/deleteCandidate", candidate_controller.deleteCandidate.controller)
router.post("/uploadCandidateResume",mediaUploadS3("candidate_resume").single("file"), candidate_controller.uploadCandidateResume.controller)


router.get("/listCandidates", candidate_controller.listCandidates.controller)
router.get("/downloadCandidates",candidate_controller.downloadCandidates.controller)
router.get("/getCandidateDetails", candidate_controller.getCandidateDetails.controller)
router.get("/searchCandidates", candidate_controller.searchCandidates.controller)



module.exports = router