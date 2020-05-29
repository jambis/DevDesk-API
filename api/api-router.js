const router = require("express").Router();

const { restricted } = require("../auth/auth-middleware");

const authRouter = require("../auth/auth-router");

router.use("/auth", authRouter);
// router.use("/users", restricted, usersRouter);
// router.use("/vacations", restricted, vacationsRouter);

module.exports = router;
