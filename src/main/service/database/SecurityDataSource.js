@Service

function SecurityDataSource() {

  @Autowire(name = "dbSession")
  this.dbSession;

  this.hasPermissionSqlString = `
  select case when
  count(*) > 0
  then 'true'
  else 'false'
  end as has_permission
  from iam
  where resource  = :resource
  and permission  = :permission
  and role = :role
  `

  this.findUserByName = (name) => {
    return new Promise(async (resolve, reject) => {
      try {
        var user = await this.dbSession
          .select('*')
          .from('user')
          .where('username', name);
        resolve(user);
      } catch (err) {
        console.log(err);
        reject("Failed to find user by name");
      }
    });
  }

  this.hasPermissions = (role, resource, permission) => {
    return new Promise(async (resolve, reject) => {
      try {

        var params = {
          resource: resource,
          permission: permission,
          role: role
        };

        var countPermissions = await this.dbSession
          .raw(this.hasPermissionSqlString, params);
        resolve(countPermissions[0][0]);
      } catch (err) {
        console.log(err);
        reject("Failed to find next image");
      }
    });
  }

}

module.exports = SecurityDataSource;
