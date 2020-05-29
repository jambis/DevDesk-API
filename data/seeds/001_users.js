const bcrypt = require("bcryptjs");

exports.seed = function (knex) {
  return knex("users").insert([
    {
      username: "Section Lead",
      password: `${bcrypt.hashSync("pass", 12)}`,
      role: "helper",
    },
    {
      username: "Student Success",
      password: `${bcrypt.hashSync("pass", 12)}`,
      role: "helper",
    },
    {
      username: "Human Resources",
      password: `${bcrypt.hashSync("pass", 12)}`,
      role: "helper",
    },
    {
      username: "Katherine",
      password: `${bcrypt.hashSync("pass", 12)}`,
      role: "student",
    },
    {
      username: "Russell",
      password: `${bcrypt.hashSync("pass", 12)}`,
      role: "student",
    },
    {
      username: "Milo",
      password: `${bcrypt.hashSync("pass", 12)}`,
      role: "student",
    },
    {
      username: "Darrell",
      password: `${bcrypt.hashSync("pass", 12)}`,
      role: "student",
    },
    {
      username: "James",
      password: `${bcrypt.hashSync("pass", 12)}`,
      role: "helper",
    },
    {
      username: "Daisy",
      password: `${bcrypt.hashSync("pass", 12)}`,
      role: "helper",
    },
  ]);
};
