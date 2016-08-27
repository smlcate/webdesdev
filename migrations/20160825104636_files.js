
exports.up = function(knex, Promise) {
  return knex.schema.createTable('files', function(table) {
    table.increments();
    table.string('project')
    table.string('type'); //Example: JavaScript, HTML, CSS..
    table.string('name');
    table.string('file_data'); //JSON
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('files');
};
