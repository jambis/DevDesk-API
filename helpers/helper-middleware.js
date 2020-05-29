const dbHelper = require("./helper-model");

module.exports = { isHelper, ticketExists };

async function ticketExists(req, res, next) {
  try {
    const ticket = await dbHelper.findBy({ id: req.params.id });

    if (ticket) {
      next();
    } else {
      res.status(404).json({ message: "Ticket with that ID doesn't exist" });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to verify if ticket ID exists",
    });
  }
}

async function isHelper(req, res, next) {
  if (req.decodedJwt.role !== "helper") {
    res.status(403).json({
      message: "Sorry you aren't a helper",
    });
  } else {
    next();
  }
}
