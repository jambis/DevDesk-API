const router = require("express").Router();

const { restricted } = require("../auth/auth-middleware");

const authRouter = require("../auth/auth-router");
const helperRouter = require("../helpers/helper-router");
const studentRouter = require("../students/student-router");

router.use("/auth", authRouter);
router.use("/helpers", restricted, helperRouter);
router.use("/students", restricted, studentRouter);

module.exports = router;
