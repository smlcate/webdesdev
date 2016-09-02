
exports.up = function(knex, Promise) {
  return knex.schema.createTable('projects', function(table) {
    table.increments();
    table.integer('pivotalId');
    table.integer('owner_id');
    table.string('title');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('projects');
};
