const router = require("express").Router();

const dbHelper = require("./helper-model");
const { isHelper, ticketExists } = require("./helper-middleware");

/**
 * @api {get} /api/helpers/ List of Helpers
 * @apiName List of Helpers
 * @apiGroup Helpers
 *
 * @apiHeader {String} authorization user's access token.
 *
 * @apiExample {js} Example usage
 * axios.get("https://devdeskqueue-api.herokuapp.com/api/helpers/")
 *
 * @apiSuccess (200) {Array} Array List of helpers that you can assign tickets to
 *
 * @apiSuccessExample {json} Successful Response
 * [
 *   {
 *     "id": 1,
 *     "username": "Section Lead"
 *   },
 *   {
 *     "id": 2,
 *     "username": "Student Success"
 *   },
 *   {
 *     "id": 3,
 *     "username": "Human Resources"
 *   },
 *   {
 *     "id": 8,
 *     "username": "James"
 *   }
 * ]
 *
 */

router.get("/", isHelper, async (req, res) => {
  try {
    const uid = req.decodedJwt.id;

    const helpers = await dbHelper.findHelpers(uid);

    res.status(200).json(helpers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch helpers" });
  }
});

/**
 * @api {get} /api/helpers/tickets List of Open Tickets
 * @apiName List of Open Tickets
 * @apiGroup Helpers
 *
 * @apiHeader {String} authorization user's access token.
 *
 * @apiExample {js} Example usage
 * axios.get("https://devdeskqueue-api.herokuapp.com/api/helpers/tickets")
 *
 * @apiSuccess (200) {Array} Array List of open tickets
 *
 * @apiSuccessExample {json} Successful Response
 * [
 *   {
 *     "id": 1,
 *     "title": "Laptop Stopped Working",
 *     "category": "Equipment",
 *     "tried": "Reboot, Apple Genius bar",
 *     "additional_info": "I took my laptop to the Apple Genius bar and they weren't able to get it to work, I don't have the money for a replacement right now.",
 *     "created_by": 5,
 *     "created_on": "2020-05-29T23:08:26.450Z",
 *     "assigned": true,
 *     "assigned_to": 2,
 *     "completed": false
 *   },
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
 *     "id": 4,
 *     "title": "Lost my ISA password",
 *     "category": "Finances",
 *     "tried": "Emailing ISA holder",
 *     "additional_info": "I can't seem to get into my ISA account, I forgot my password and don't know where to go to reset my password.",
 *     "created_by": 7,
 *     "created_on": "2020-05-29T23:08:26.450Z",
 *     "assigned": false,
 *     "assigned_to": null,
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
 *     "id": 6,
 *     "title": "Problems with SL",
 *     "category": "People",
 *     "tried": "Talking to TL",
 *     "additional_info": "My SL is giving me an attitude, TL said to open a frontdesk ticket.",
 *     "created_by": 4,
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

router.get("/tickets", isHelper, async (req, res) => {
  try {
    const openTickets = await dbHelper.findAll();

    res.status(200).json(openTickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tickets for helper" });
  }
});

/**
 * @api {put} /api/helpers/ticekts/:id Update Ticket
 * @apiName Update Ticket
 * @apiGroup Helpers
 *
 * @apiParam {Number} assigned_to Helper's id that the ticket is assigend to, optional
 * @apiParam {Boolean} assigned Boolean to determine if ticket is assigned to a helper or not, optional
 * @apiParam {Boolean} completed Boolean to determine if ticket has been resolved, optional
 * @apiHeader {String} authorization user's access token.
 *
 * @apiExample {js} Example usage
 * axios.put("https://devdeskqueue-api.herokuapp.com/api/helpers/tickets/2", {
 *    assigned_to: 1,
 *    assigned: true
 * })
 *
 * @apiSuccess (202) {Array} Array List containing all open tickets
 *
 * @apiSuccessExample {json} Successful Response
 *
 * [
 *  {
 *    "id": 1,
 *    "title": "Laptop Stopped Working",
 *    "category": "Equipment",
 *    "tried": "Reboot, Apple Genius bar",
 *    "additional_info": "I took my laptop to the Apple Genius bar and they weren't able to get it to work, I don't have the money for a replacement right now.",
 *    "created_by": 5,
 *    "created_on": "2020-05-29T18:01:42.667Z",
 *    "assigned": true,
 *    "assigned_to": 2,
 *    "completed": false
 *  },
 *  {
 *    "id": 2,
 *    "title": "Team is not communicating",
 *    "category": "People",
 *    "tried": "Slack DMs with students and PL",
 *    "additional_info": "I'm currently in build week PT, on project DevDesk Queue and my team isn't communicating.",
 *    "created_by": 6,
 *    "created_on": "2020-05-29T18:01:42.667Z",
 *    "assigned": true,
 *    "assigned_to": 1,
 *    "completed": false
 *  },
 *  {
 *    "id": 4,
 *    "title": "Lost my ISA password",
 *    "category": "Finances",
 *    "tried": "Emailing ISA holder",
 *    "additional_info": "I can't seem to get into my ISA account, I forgot my password and don't know where to go to reset my password.",
 *    "created_by": 7,
 *    "created_on": "2020-05-29T18:01:42.667Z",
 *    "assigned": false,
 *    "assigned_to": null,
 *    "completed": false
 *  },
 *  {
 *    "id": 5,
 *    "title": "Does Lambda School hire students?",
 *    "category": "Other",
 *    "tried": "",
 *    "additional_info": "Really interested in working for Lambda School and was wondering if they ever hire students.",
 *    "created_by": 6,
 *    "created_on": "2020-05-29T18:01:42.667Z",
 *    "assigned": false,
 *    "assigned_to": null,
 *    "completed": false
 *  },
 *  {
 *    "id": 6,
 *    "title": "Problems with SL",
 *    "category": "People",
 *    "tried": "Talking to TL",
 *    "additional_info": "My SL is giving me an attitude, TL said to open a frontdesk ticket.",
 *    "created_by": 4,
 *    "created_on": "2020-05-29T18:01:42.667Z",
 *    "assigned": false,
 *    "assigned_to": null,
 *    "completed": false
 *  },
 *  {
 *    "id": 7,
 *    "title": "Hiatus Please",
 *    "category": "Track",
 *    "tried": "",
 *    "additional_info": "I have a lot of stuff going in real life and feeling really overwhelmed with the material, would greatly appreciate a month hiatus to take care of things and clear my mind.",
 *    "created_by": 6,
 *    "created_on": "2020-05-29T18:01:42.667Z",
 *    "assigned": false,
 *    "assigned_to": 2,
 *    "completed": false
 *  }
 * ]
 *
 */

router.put("/tickets/:id", ticketExists, isHelper, async (req, res) => {
  let changes = {};

  if (req.body.assigned === false && req.body.assigned_to === null) {
    try {
      const tickets = await dbHelper.update(
        { assigned: false, assigned_to: null, completed: false },
        req.params.id
      );
      const openTickets = await dbHelper.findAll();

      tickets
        ? res.status(202).json(openTickets)
        : res
            .status(404)
            .json({ message: "Ticket with that ID was not found" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update ticket" });
    }
  }

  if (req.body.assigned_to) {
    changes = { ...changes, assigned_to: req.body.assigned_to };
  }

  if (req.body.assigned) {
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

    tickets
      ? res.status(202).json(openTickets)
      : res.status(404).json({ message: "Ticket with that ID was not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update ticket" });
  }
});

module.exports = router;
