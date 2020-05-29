const db = require("../data/dbConfig");

module.exports = { findAll, findBy, add, update, remove };

async function findAll(uid) {
  const studentTickets = await db("tickets").where(uid);

  return studentTickets;
}

async function findBy(filter) {
  const studentTicket = await db("tickets").where(filter).first();

  return studentTicket;
}

async function add(ticketData) {
  const studentTicket = await db("tickets").insert(ticketData);

  return studentTicket;
}

async function update(changes, id) {
  const studentTicket = await db("tickets").update(changes).where({ id });

  return studentTicket;
}

async function remove(id) {
  return await db("tickets").where({ id }).del();
}
