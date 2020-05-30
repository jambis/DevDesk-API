const router = require("express").Router();

const dbStudent = require("./student-model");
const { isCreator, isStudent, ticketExists } = require("./student-middleware");

/**
 * @api {get} /api/students/tickets List of the Tickets
 * @apiName List of Tickets
 * @apiGroup Students
 *
 * @apiHeader {String} authorization user's access token.
 *
 * @apiExample {js} Example usage
 * axios.get("https://devdeskqueue-api.herokuapp.com/api/students/tickets")
 *
 * @apiSuccess (200) {Array} Array List of the student's open and closed tickets
 *
 * @apiSuccessExample {json} Successful Response
 * [
 *   {
 *     "id": 2,
 *     "title": "Team is not communicating",
 *     "category": "People",
 *     "tried": "Slack DMs with students and PL",
 *     "additional_info": "I'm currently in build week PT, on project DevDesk Queue and my team isn't communicating.",
 *     "created_by": 6,
 *     "created_on": "2020-05-29T23:08:26.450Z",
 *     "assigned": true,
 *     "assigned_to": 1,
 *     "completed": false
 *   },
 *   {
 *     "id": 5,
 *     "title": "Does Lambda School hire students?",
 *     "category": "Other",
 *     "tried": "",
 *     "additional_info": "Really interested in working for Lambda School and was wondering if they ever hire students.",
 *     "created_by": 6,
 *     "created_on": "2020-05-29T23:08:26.450Z",
 *     "assigned": false,
 *     "assigned_to": null,
 *     "completed": false
 *   },
 *   {
 *     "id": 7,
 *     "title": "Hiatus Please",
 *     "category": "Track",
 *     "tried": "",
 *     "additional_info": "I have a lot of stuff going in real life and feeling really overwhelmed with the material, would greatly appreciate a month hiatus to take care of things and clear my mind.",
 *     "created_by": 6,
 *     "created_on": "2020-05-29T23:08:26.450Z",
 *     "assigned": true,
 *     "assigned_to": 2,
 *     "completed": false
 *   }
 * ]
 *
 */
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

/**
 * @api {post} /api/students/tickets/ Create a new ticket
 * @apiName Create Ticket
 * @apiGroup Students
 *
 * @apiParam {String} title Title of the ticket, required
 * @apiParam {String} category Category of the ticket, required
 * @apiParam {String} tried What has the student tried to fix the issue, optional
 * @apiParam {String} additional_info Additional information student wants to add, optional
 * @apiHeader {String} authorization user's access token.
 *
 * @apiExample {js} Example usage
 * axios.post("https://devdeskqueue-api.herokuapp.com/api/students/tickets", {
 *     "title": "Loaner Laptop Request",
 *     "category":"Other",
 *     "additional_info": "I would like to request a loaner laptop, my laptop is giving major problems."
 * })
 *
 * @apiSuccess (201) {Array} Array List of the student's open and closed tickets
 *
 * @apiSuccessExample {json} Successful Response
 *
 * [
 *   {
 *     "id": 1,
 *     "title": "Laptop Stopped Working",
 *     "category": "Equipment",
 *     "tried": "Reboot, Apple Genius bar",
 *     "additional_info": "I took my laptop to the Apple Genius bar and they weren't able to get it to work, I don't have the money for a replacement right now.",
 *     "created_by": 5,
 *     "created_on": "2020-05-29T18:01:42.667Z",
 *     "assigned": true,
 *     "assigned_to": 2,
 *     "completed": false
 *   },
 *   {
 *     "id": 3,
 *     "title": "Hiatus Request",
 *     "category": "Track",
 *     "tried": "",
 *     "additional_info": "I need to take a hiatus, I've been diagnosed with Covid-19.",
 *     "created_by": 5,
 *     "created_on": "2020-05-29T18:01:42.667Z",
 *     "assigned": true,
 *     "assigned_to": 2,
 *     "completed": true
 *   },
 *   {
 *     "id": 12,
 *     "title": "Loaner Laptop Request",
 *     "category": "Other",
 *     "tried": null,
 *     "additional_info": "I would like to request a loaner laptop, my laptop is giving major problems.",
 *     "created_by": 5,
 *     "created_on": "2020-05-29T21:37:06.340Z",
 *     "assigned": false,
 *     "assigned_to": null,
 *     "completed": false
 *   }
 * ]
 *
 */

router.post("/tickets", isStudent, async (req, res) => {
  let ticketData = { created_by: req.decodedJwt.id };

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

    success ? res.status(201).json(studentTickets) : console.log("uhoh");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tickets for student" });
  }
});

/**
 * @api {put} /api/students/tickets/:id Update a ticket
 * @apiName Update Ticket
 * @apiGroup Students
 *
 * @apiParam {String} title Title of the ticket, optional
 * @apiParam {String} category Category of the ticket, optional
 * @apiParam {String} tried What has the student tried to fix the issue, optional
 * @apiParam {String} additional_info Additional information student wants to add, optional
 * @apiParam {Boolean} completed Boolean to mark a ticket resolved, optional
 * @apiHeader {String} authorization user's access token.
 *
 * @apiExample {js} Example usage
 * axios.put("https://devdeskqueue-api.herokuapp.com/api/students/tickets/12", {"tried": "Giving Laptop CPR"})
 *
 * @apiSuccess (202) {Array} Array List of the student's open and closed tickets
 *
 * @apiSuccessExample {json} Successful Response
 *
 * [
 *   {
 *     "id": 1,
 *     "title": "Laptop Stopped Working",
 *     "category": "Equipment",
 *     "tried": "Reboot, Apple Genius bar",
 *     "additional_info": "I took my laptop to the Apple Genius bar and they weren't able to get it to work, I don't have the money for a replacement right now.",
 *     "created_by": 5,
 *     "created_on": "2020-05-29T18:01:42.667Z",
 *     "assigned": true,
 *     "assigned_to": 2,
 *     "completed": false
 *   },
 *   {
 *     "id": 3,
 *     "title": "Hiatus Request",
 *     "category": "Track",
 *     "tried": "",
 *     "additional_info": "I need to take a hiatus, I've been diagnosed with Covid-19.",
 *     "created_by": 5,
 *     "created_on": "2020-05-29T18:01:42.667Z",
 *     "assigned": true,
 *     "assigned_to": 2,
 *     "completed": true
 *   },
 *   {
 *     "id": 12,
 *     "title": "Loaner Laptop Request",
 *     "category": "Other",
 *     "tried": "Giving Laptop CPR",
 *     "additional_info": "I would like to request a loaner laptop, my laptop is giving major problems.",
 *     "created_by": 5,
 *     "created_on": "2020-05-29T21:37:06.340Z",
 *     "assigned": false,
 *     "assigned_to": null,
 *     "completed": false
 *   }
 * ]
 *
 */

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

      success ? res.status(202).json(studentTickets) : console.log("uhoh");
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch tickets for student" });
    }
  }
);

/**
 * @api {delete} /api/students/tickets/:id Delete a ticket
 * @apiName Delete Ticket
 * @apiGroup Students
 *
 * @apiHeader {String} authorization user's access token.
 *
 * @apiExample {js} Example usage
 * axios.delete("https://devdeskqueue-api.herokuapp.com/api/students/tickets/12")
 *
 * @apiSuccess (202) {Array} Array List of the student's open and closed tickets
 *
 * @apiSuccessExample {json} Successful Response
 *
 * [
 *   {
 *     "id": 1,
 *     "title": "Laptop Stopped Working",
 *     "category": "Equipment",
 *     "tried": "Reboot, Apple Genius bar",
 *     "additional_info": "I took my laptop to the Apple Genius bar and they weren't able to get it to work, I don't have the money for a replacement right now.",
 *     "created_by": 5,
 *     "created_on": "2020-05-29T18:01:42.667Z",
 *     "assigned": true,
 *     "assigned_to": 2,
 *     "completed": false
 *   },
 *   {
 *     "id": 3,
 *     "title": "Hiatus Request",
 *     "category": "Track",
 *     "tried": "",
 *     "additional_info": "I need to take a hiatus, I've been diagnosed with Covid-19.",
 *     "created_by": 5,
 *     "created_on": "2020-05-29T18:01:42.667Z",
 *     "assigned": true,
 *     "assigned_to": 2,
 *     "completed": true
 *   }
 * ]
 *
 */

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
