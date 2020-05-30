const router = require("express").Router();

const dbStudent = require("./student-model");
const { isCreator, isStudent, ticketExists } = require("./student-middleware");

router.get("/tickets", isStudent, async (req, res) => {
  try {
    const studentTickets = await dbStudent.findAll({
      created_by: req.decodedJwt.id,
    });

    res.status(200).json(studentTickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tickets for student" });
  }
});

router.post("/tickets", isStudent, async (req, res) => {
  let ticketData = { created_by: req.decodedJwt.id };
  console.log(req.decodedJwt);
  if (req.body.title) {
    ticketData = { ...ticketData, title: req.body.title };
  } else {
    res
      .status(400)
      .json({ message: "Please provide the required title field" });
  }

  if (req.body.category) {
    ticketData = { ...ticketData, category: req.body.category };
  } else {
    res
      .status(400)
      .json({ message: "Please provide the required category field" });
  }

  if (req.body.tried) ticketData = { ...ticketData, tried: req.body.tried };

  if (req.body.additional_info)
    ticketData = { ...ticketData, additional_info: req.body.additional_info };

  try {
    const success = await dbStudent.add(ticketData);
    const studentTickets = await dbStudent.findAll({
      created_by: req.decodedJwt.id,
    });

    success ? res.status(200).json(studentTickets) : console.log("uhoh");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tickets for student" });
  }
});

router.put(
  "/tickets/:id",
  ticketExists,
  isStudent,
  isCreator,
  async (req, res) => {
    let changes = {};

    if (req.body.title) changes = { ...changes, title: req.body.title };

    if (req.body.category)
      changes = { ...changes, category: req.body.category };

    if (req.body.tried) changes = { ...changes, tried: req.body.tried };

    if (req.body.additional_info)
      changes = { ...changes, additional_info: req.body.additional_info };

    if (req.body.completed)
      changes = { ...changes, completed: req.body.completed };

    if (Object.getOwnPropertyNames(changes).length == 0) {
      res.status(400).json({
        message:
          "Please provide title, category, tried, additional_info or completed fields",
      });
    }

    try {
      const success = await dbStudent.update(changes, req.params.id);
      const studentTickets = await dbStudent.findAll({
        created_by: req.decodedJwt.id,
      });

      success ? res.status(200).json(studentTickets) : console.log("uhoh");
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch tickets for student" });
    }
  }
);

router.delete(
  "/tickets/:id",
  ticketExists,
  isStudent,
  isCreator,
  async (req, res) => {
    try {
      const deleted = await dbStudent.remove(req.params.id);
      const studentTickets = await dbStudent.findAll({
        created_by: req.decodedJwt.id,
      });

      deleted
        ? res.status(202).json(studentTickets)
        : res
            .status(404)
            .json({ message: "Ticket with that ID was not found" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete ticket" });
    }
  }
);
module.exports = router;
