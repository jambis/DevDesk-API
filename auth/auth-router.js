const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const dbAuth = require("./auth-model");
const generateToken = require("./generate-token");

/**
 * @api {post} /api/auth/register Register User
 * @apiName Register User
 * @apiGroup Auth
 *
 * @apiParam {string} username User's name, unique, required
 * @apiParam {string} password User's password, required
 * @apiParam {string} role User's role, required
 *
 * @apiParamExample {json} Example Body
 * {
 *   "username": "Milo",
 *   "password": "pass"
 * }
 *
 * @apiExample {js} Example usage
 * axios.post("https://devdeskqueue-api.herokuapp.com/api/auth/register", {
 *    username: "Milo"
 *    password: "pass"
 *    role: "student"
 * })
 *
 * @apiSuccess (200) {Number} id User's id
 * @apiSuccess (200) {String} username User's name
 * @apiSuccess (200) {String} role User's role
 * @apiSuccess (200) {String} token User's access token
 *
 * @apiSuccessExample {json} Successful Response
 * {
 *   "id": 6,
 *   "username": "Milo",
 *   "role": "student",
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImphbWJpczYiLCJpYXQiOjE1NzM5MjEyMjYsImV4cCI6MTU3NDAwNzYyNn0.lbAqXnl1s1aIK9TgMSFJNt2ej63lfqn_dsDdNpH1ZMs"
 * }
 *
 */

router.post("/register", async (req, res) => {
  if (
    !req.body.role ||
    (req.body.role != "student" && req.body.role != "helper")
  ) {
    res
      .status(400)
      .json({ message: "User must have a role of student or helper" });
  }

  if (!req.body.username) {
    res.status(400).json({ message: "Please include a username field" });
  }

  if (!req.body.password) {
    res.status(400).json({ message: "Please include a password field" });
  }

  let { username, password, role } = req.body;

  const hash = bcrypt.hashSync(password, 12);
  password = hash;

  try {
    const userExists = await dbAuth.getBy({ username });

    if (userExists) {
      res.status(400).json({ message: "Username must be unique" });
    }

    const user = await dbAuth.add({ username, password, role });
    const token = generateToken(user);

    res.status(201).json({ ...user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to register user" });
  }
});

/**
 * @api {post} /api/auth/login Login User
 * @apiName Login User
 * @apiGroup Auth
 *
 * @apiParam {string} username User's name, required
 * @apiParam {string} password User's password, required
 *
 * @apiParamExample {json} Example Body
 * {
 *   "username": "Milo",
 *   "password": "pass"
 * }
 *
 * @apiExample {js} Example usage
 * axios.post("https://devdeskqueue-api.herokuapp.com/api/auth/login", {
 *    username: "Milo"
 *    password: "pass"
 * })
 *
 * @apiSuccess (200) {Number} id User's id
 * @apiSuccess (200) {String} username User's name
 * @apiSuccess (200) {String} role User's role
 * @apiSuccess (200) {String} token User's access token
 *
 * @apiSuccessExample {json} Successful Response
 * {
 *   "id": 6,
 *   "username": "Milo",
 *   "role": "student",
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImphbWJpczYiLCJpYXQiOjE1NzM5MjEyMjYsImV4cCI6MTU3NDAwNzYyNn0.lbAqXnl1s1aIK9TgMSFJNt2ej63lfqn_dsDdNpH1ZMs"
 * }
 *
 */

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await dbAuth.getBy({ username });

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user);

      res
        .status(200)
        .json({ id: user.id, username: user.username, role: user.role, token });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to login" });
  }
});

module.exports = router;
