import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("points", (table) => {
    table.increments("id").primary();
    table.string("image").notNullable();
    table.string("name").notNullable();
    table.string("email").notNullable();
    table.string("whatsapp").notNullable();
    table.string("cep").notNullable();
    table.string("state", 2).notNullable();
    table.string("city").notNullable();
    table.string("neighborhood").notNullable();
    table.string("street").notNullable();
    table.string("streetNumber").notNullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("point");
}
