const employee = require("./employee");
const demand = require("./demand")
const candidate = require("./candidate")
const submission = require("./submission")

const { expressjwt: expressJwt } = require('express-jwt');

var config = require("../../config");

module.exports.setup = (app) => {

    console.log("Setting up routes.");

    app.use(
        "/api/v1",
        function(req, res, next) {
            next();
        },
        expressJwt({
            secret: config.jwtSecret,
            algorithms: ['HS256']
        }).unless({
            path: [
                "/api/v1/employee/createEmployee",
                "/api/v1/employee/signIn",
                "/api/v1/employee/resetPasswordRequest"
            ],
        })
    );

    // Route Specific API endpoints
    app.use("/api/v1/employee", employee);
    app.use("/api/v1/demand", demand);
    app.use("/api/v1/candidate", candidate);
    app.use("/api/v1/submission", submission);
     
};

