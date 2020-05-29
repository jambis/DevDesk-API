exports.seed = function (knex) {
  return knex("tickets").insert([
    {
      title: "Laptop Stopped Working",
      category: "Equipment",
      tried: "Reboot, Apple Genius bar",
      additional_info:
        "I took my laptop to the Apple Genius bar and they weren't able to get it to work, I don't have the money for a replacement right now.",
      created_by: 5,
      assigned: true,
      assigned_to: 2,
      completed: false,
    },
    {
      title: "Team is not communicating",
      category: "People",
      tried: "Slack DMs with students and PL",
      additional_info:
        "I'm currently in build week PT, on project DevDesk Queue and my team isn't communicating.",
      created_by: 6,
      assigned: true,
      assigned_to: 1,
      completed: false,
    },
    {
      title: "Hiatus Request",
      category: "Track",
      tried: "",
      additional_info:
        "I need to take a hiatus, I've been diagnosed with Covid-19.",
      created_by: 5,
      assigned: true,
      assigned_to: 2,
      completed: true,
    },
    {
      title: "Lost my ISA password",
      category: "Finances",
      tried: "Emailing ISA holder",
      additional_info:
        "I can't seem to get into my ISA account, I forgot my password and don't know where to go to reset my password.",
      created_by: 7,
      assigned: false,
      completed: false,
    },
    {
      title: "Does Lambda School hire students?",
      category: "Other",
      tried: "",
      additional_info:
        "Really interested in working for Lambda School and was wondering if they ever hire students.",
      created_by: 6,
      assigned: false,
      completed: false,
    },
    {
      title: "Problems with SL",
      category: "People",
      tried: "Talking to TL",
      additional_info:
        "My SL is giving me an attitude, TL said to open a frontdesk ticket.",
      created_by: 4,
      assigned: false,
      completed: false,
    },
    {
      title: "Hiatus Please",
      category: "Track",
      tried: "",
      additional_info:
        "I have a lot of stuff going in real life and feeling really overwhelmed with the material, would greatly appreciate a month hiatus to take care of things and clear my mind.",
      created_by: 6,
      assigned: true,
      assigned_to: 2,
      completed: false,
    },
  ]);
};
