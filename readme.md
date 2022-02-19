# Labelify

LabelImg is a graphical image annotation tool. Just like [labelImg](https://github.com/tzutalin/labelImg) but web and responsive to easily annotations with smartphones

### Requirements

- Node.js > 14.*
- Mysql database. You could use [docker](https://gist.github.com/jrichardsz/73142c5c7eb7136d80b165e75d3a1e22)
- Create a database and execute this ddl to create the required tables: [./database/ddl.sql](./database/ddl.sql)


### Settings


|key | sample value | description|
|---|---|---|
|PORT | 8080 | change the port of server. Default is 2708|
|LABELIFY_DATABASE_HOST | 10.20.30.40 | some ip of your mysql database|
|LABELIFY_DATABASE_USER | usr_labelify | the mysql user for your my database. Root is not required.|
|LABELIFY_DATABASE_PASSWORD | ***** |  password related to the mysql user|
|LABELIFY_DATABASE_PORT | 3306 | mysql port. Default is 3306|
|LABELIFY_DATABASE_NAME | labelify | name of your mysql database|
|LABELIFY_CREATE_TABLES | true | create tables at startup|
|TOKEN_SECRET | ***** | secret for jwt generation|


### For developers

- [export variables](https://github.com/jrichardsz/labelify/wiki/Export-variables-Linux)
- execute
```
npm install
npm run dev
```

### For servers

- [export variables](https://github.com/jrichardsz/labelify/wiki/Export-variables-Linux)
- execute
```
npm install
npm run start
```

### For servers with docker

Complete details [here](https://github.com/jrichardsz/labelify/wiki/Launch-with-Docker)

### Users

admin password and demo data are created at first startup when tables don't exist. Search in the log for something like this:

```
--------------------------------------
admin password: 0b85fb7a55094e
uuid: 1d7024e08-e11f65978b69
--------------------------------------
```

Use these values in the login.

### Usage

Open your browser pointing at:

- http://localhost:8080

If no errors, you will see the Login

![](https://i.ibb.co/BgGTRGG/labelify-login.png)

An after login an image will be ready for your human box annotation:

![home](https://i.ibb.co/2WDpCWK/image-ready-for-annotation.png)

Just perform the annotation just like labelImg (mouse drag)

![](https://i.ibb.co/hZt32Hw/annotation-example.png)

Press submit, the box coordinates will be sent to the database

![](https://i.ibb.co/LtYSDws/annotation-coordinates.png)

And then a new image will be loaded

### Roadmap

- [ ] unit test, coverage, badges
- [ ] user crud
- [ ] images crud
- [ ] annotation view
- [ ] fba protection


### Made with

- Node.js
- Mysql
- Nodeboot framework: https://github.com/nodeboot


### Contributors

Thanks goes to these wonderful people :

<table>
  <tbody>
    <td>
      <img src="https://avatars0.githubusercontent.com/u/3322836?s=460&v=4" width="100px;"/>
      <br />
      <label><a href="http://jrichardsz.github.io/">JRichardsz</a></label>
      <br />
    </td>    
  </tbody>
</table>
