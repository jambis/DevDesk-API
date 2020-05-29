exports.up = function (knex) {
  return knex.schema
    .createTable("users", (tbl) => {
      tbl.increments();
      tbl.string("username").unique().notNullable();
      tbl.string("password").notNullable();
      tbl.string("role").notNullable();
    })
    .createTable("tickets", (tbl) => {
      tbl.increments();
      tbl.string("title").notNullable();
      tbl.string("category").notNullable();
      tbl.text("tried");
      tbl.text("additionalInfo");
      tbl.integer("created_by").references("id").inTable("users").notNullable();
      tbl.dateTime("created_on", { precision: 6 }).defaultTo(knex.fn.now());
      tbl.boolean("assigned").defaultTo(false).notNullable();
      tbl.integer("assigned_to").unsigned().references("id").inTable("users");
      tbl.boolean("completed").defaultTo(false).notNullable();
    });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("tickets").dropTableIfExists("users");
};
