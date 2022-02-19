const uuid = require('uuid');
const bcrypt = require('bcrypt');
const saltRounds = 10;

@ServerInitializer

function ServerInitializer() {

  @Autowire(name = "dbSession")
  this.dbSession;

  this.onBeforeLoad = () => {

    return new Promise(async (resolve, reject) => {
      if (process.env.LABELIFY_CREATE_TABLES === "false") {
        return resolve();
      }
      console.log("Configuring database...");
      var existsUserTable = await this.dbSession.schema.hasTable('user');
      if (!existsUserTable) {
        return this.dbSession.schema.createTable('user', (table) => {
          table.increments('id').primary();
          table.string('username', 25).unique().notNullable();
          table.string('password', 255).notNullable();
          table.string('role', 50).notNullable();
        }).createTable('iam', function(table) {
          table.increments('id').primary();
          table.string('role', 25).notNullable();
          table.string('resource', 50).notNullable();
          table.string('permission', 150).notNullable();
        }).createTable('image', function(table) {
          table.increments('id').primary();
          table.string('tag', 50).notNullable();
          table.string('url', 255).notNullable();
          table.string('file_name', 50).notNullable();
          table.string('expected_classes', 50);
        }).createTable('user_annotation_group', function(table) {
          table.integer('user_id').notNullable();
          table.string('annotation_group_identifier', 50);
        }).createTable('annotation', function(table) {
          table.increments('id').primary();
          table.integer('user_id').notNullable();
          table.integer('image_id').notNullable();
          table.string('annotation_group_identifier').notNullable();
          table.integer('x1');
          table.integer('y1');
          table.integer('x2');
          table.integer('y2');
          table.integer('x3');
          table.integer('y3');
          table.integer('x4');
          table.integer('y4');
          table.date("last_update");
        }).then(async () => {

          var annotation_group_identifier = process.env.LABELIFY_ANNOTATION_GROUP_IDENTIFIER || uuid.v4();
          var plainPassword = process.env.LABELIFY_ADMIN_PASSWORD || uuid.v4();

          console.log("-------------------------------");
          if (typeof process.env.LABELIFY_ADMIN_PASSWORD === 'undefined') {
            console.log("admin password: " + plainPassword);
          }
          if (typeof process.env.LABELIFY_ANNOTATION_GROUP_IDENTIFIER === 'undefined') {
            console.log("uuid: " + annotation_group_identifier);
          }
          console.log("-------------------------------");

          var hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
          await this.dbSession("user").insert([{
            username: "admin",
            password: hashedPassword,
            role: "admin"
          }])
          await this.dbSession("iam").insert([{
            role: "admin",
            resource: "image",
            permission: "get-next"
          }, {
            role: "admin",
            resource: "annotation",
            permission: "create"
          }])
          await this.dbSession("user_annotation_group").insert([{
            user_id: 1,
            annotation_group_identifier: annotation_group_identifier
          }])
          await this.dbSession("image").insert([{
            tag: "2022",
            url: "https://www.gannett-cdn.com/media/2019/04/25/USATODAY/usatsports/247WallSt.com-247WS-543507-ms.jpg",
            file_name: "car0001.jpg",
            expected_classes: "car"
          }, {
            tag: "2022",
            url: "http://cms.haymarketindia.net/model/uploads/modelimages/Volvo-S60-130220211541.jpg",
            file_name: "car0002.jpg",
            expected_classes: "car"
          }, {
            tag: "2022",
            url: "https://stat.overdrive.in/wp-content/odgallery/2020/06/57263_2020_Mercedes_Benz_GLS.jpg",
            file_name: "car0003.jpg",
            expected_classes: "car"
          }])
          await this.dbSession("annotation").insert([{
            user_id: 1,
            image_id: 1,
            annotation_group_identifier: annotation_group_identifier
          }, {
            user_id: 1,
            image_id: 2,
            annotation_group_identifier: annotation_group_identifier
          }, {
            user_id: 1,
            image_id: 3,
            annotation_group_identifier: annotation_group_identifier
          }])
          resolve();
        });
      } else {
        console.log("user table already exist");
        resolve();
      }
    });
  }

}

module.exports = ServerInitializer;
