const db = require("../data/dbConfig");

module.exports = { findAll, findHelpers, findBy, update };

async function findAll() {
  const openTickets = await db("tickets").where({ completed: false });

  return openTickets;
}

async function findHelpers(uid) {
  const helpers = await db("users")
    .whereIn("id", [1, 2, 3, uid])
    .select("id", "username");

  return helpers;
}

async function findBy(filter) {
  const studentTicket = await db("tickets").where(filter).first();

  return studentTicket;
}

async function update(changes, id) {
  await db("tickets").update(changes).where({ id });

  return db("tickets").where({ id }).first();
}
