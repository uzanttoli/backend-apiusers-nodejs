var db = require("../database/connection");
var bcrypt = require("bcrypt");
const PasswordToken = require("./PasswordToken");

class User {
  async findAll() {
    try {
      var result = await db
        .select(["id", "name", "email", "role"])
        .table("users");
      return result;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async findById(id) {
    try {
      var result = await db
        .select(["id", "name", "email", "role"])
        .table("users")
        .where({ id: id });

      if (result.length > 0) {

        return result[0];

      } else {

        return undefined;

      }
    } catch (error) {
        
      console.log(error);
      return undefined;
      
    }
  }


  async findByEmail(email) {
    try {
      var result = await db
        .select(["id", "name", "password", "email", "role"])
        .table("users")
        .where({ email: email });

      if (result.length > 0) {

        return result[0];

      } else {

        return undefined;

      }
    } catch (error) {
        
      console.log(error);
      return undefined;
      
    }
  }

  async new(email, name, password) {
    try {
      //   var { email, name, password } = user;
      var hash = await bcrypt.hash(password, 10);

      await db.insert({ email, name, password: hash, role: 0 }).table("users");
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async findEmail(email) {
    try {
      var result = await db.select("*").from("users").where({ email: email });

      if (result.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }


  async update(id, name, email, role){
    var user = await this.findById(id);

    if(user != undefined){

      var editUser = {};

      if(email != undefined){
        if(email != user.email){
          var result  = await this.findEmail(email);
          if(result == false){
            editUser.email = email;
          }else{
            return {status: false, err: "O email ja esta cadastrado!"};
          }
        }
      }

      if(name != undefined){
        editUser.name = name;
      }

      if(role != undefined){
        editUser.role = role;
      }


      try {
        await db.update(editUser).where({id:id}).table("users");
        return {status: true};
      } catch (error) {
        return {status: false, err: error};
      }

    }else{
      return {status: false, err: "O usuario nao existe!"}
    }
  }


  async delete(id){
    var user =  await this.findById(id);

    if(user != undefined){

      try {

        await db.delete().where({id:id}).table("users");
        return {status: true};

      } catch (error) {

        return {status: false, err: error};

      }
    }else{
      return {status: false, err: "Usuario nao existe!"}
    }
  }


  async changePassword(newPassword, id, token){

    var hash = await bcrypt.hash(newPassword, 10);
    await db.update({password: hash}).where({id: id}).table("users");
    await PasswordToken.setUserd(token);

  }
}

module.exports = new User();
