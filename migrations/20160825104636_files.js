
exports.up = function(knex, Promise) {
  return knex.schema.createTable('files', function(table) {
    table.increments();
    table.integer('projectId')
    table.string('type'); //Example: JavaScript, HTML, CSS..
    table.string('name');
    table.string('file_data'); //JSON
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('files');
};
