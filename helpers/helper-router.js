const router = require("express").Router();

const dbHelper = require("./helper-model");
const { isCreator, isHelper, ticketExists } = require("./helper-middleware");

router.get("/", isHelper, async (req, res) => {
  try {
    const uid = req.decodedJwt.id;
    console.log(uid);
    const helpers = await dbHelper.findHelpers(uid);

    res.status(200).json(helpers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch helpers" });
  }
});

router.get("/tickets", isHelper, async (req, res) => {
  try {
    const openTickets = await dbHelper.findAll();

    res.status(200).json(openTickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tickets for helper" });
  }
});

router.put("/tickets/:id", ticketExists, isHelper, async (req, res) => {
  let changes = {};

  if (req.body.assigned_to)
    changes = { ...changes, assigned_to: req.body.assigned_to };

  if (req.body.assinged) {
    changes = { ...changes, assigned: req.body.assigned };
  }
  if (req.body.completed) {
    changes = { ...changes, completed: req.body.completed };
  }

  if (Object.getOwnPropertyNames(changes).length == 0) {
    res.status(400).json({
      message: "Please provide assigned_to, assigned or completed fields",
    });
  }

  try {
    const tickets = await dbHelper.update(changes, req.params.id);
    const openTickets = await dbHelper.findAll();

    ticekts
      ? res.status(202).json(openTickets)
      : res.status(404).json({ message: "Ticket with that ID was not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update ticket" });
  }
});

module.exports = router;
