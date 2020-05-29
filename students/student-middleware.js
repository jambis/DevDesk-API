const dbStudent = require("./student-model");

module.exports = { isCreator, isStudent, ticketExists };

async function isCreator(req, res, next) {
  try {
    const ticket = await dbStudent.findBy({ id: req.params.id });

    if (req.decodedJwt.id != ticket.created_by) {
      res.status(403).json({
        message: "Sorry only the creator of the ticket can preform this action",
      });
    } else {
      next();
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to verify user's permission to preform this action",
    });
  }
}

async function ticketExists(req, res, next) {
  try {
    const ticket = await dbStudent.findBy({ id: req.params.id });

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

async function isStudent(req, res, next) {
  if (req.decodedJwt.role !== "student") {
    res.status(403).json({
      message: "Sorry you aren't a student",
    });
  } else {
    next();
  }
}
