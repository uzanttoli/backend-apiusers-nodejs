var User = require("../models/User");
var PasswordToken = require("../models/PasswordToken");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");

var secret = "eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY1Nzc1MTQyMywiaWF0IjoxNjU3NzUxNDIzfQ";


class UsersController {
  async index(req, res) {
    var users = await User.findAll();
    res.json(users);
  }

  async findUser(req, res) {
    var id = req.params.id;
    var user = await User.findById(id);

    if (user == undefined) {
      res.status(404);
      res.json({ err: "Não encontrado!" });
    } else {
      res.json(user);
    }
  }

  async create(req, res) {
    var { email, name, password } = req.body;

    if (email == undefined || email == '' || email == ' ') {
      res.status(400);
      res.json({ err: "O e-mail é invalido" });
      return;
    }

    var emailExists = await User.findEmail(email);

    if (emailExists) {
      res.status(406);
      res.json({ err: "Este email ja está em uso!" });
      return;
    }
    await User.new(email, name, password);
    res.status(200);
    res.send("Tudo OK!");
  }


  async edit(req, res){
    var {id, name, email, role} = req.body;

    var result = await User.update(id, name, email, role);

    if(result != undefined){
      if(result.status){
        res.send("Tudo Ok!");
      }else{
        res.status(406);
        res.json(result.err);
      }
    }else{
      res.status(406);
      res.send('Ocorreu um  erro no servidor!');  
    }
  }


  async remove(req, res){
    var id = req.params.id;

    var result = await User.delete(id);

    if(result.status){
      res.send("Tudo OK!")
    }else{
      res.status(406);
      res.send(result.err);
    }
  }


  async recoverypassword(req, res){
    var email = req.body.email;
    var result = await PasswordToken.create(email);

    if(result.status){

      res.send("" + result.token);
      //Enviar email com o token

    }else{
      res.status(406);
      res.send(result.err);
    }

  }


  async changepassword(req, res){
    var token = req.body.token;
    var password = req.body.password;

    var isTokenValid = await PasswordToken.validate(token);

    if(isTokenValid.status){

      await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token);
      res.send("Senha alterada!")
    }else{
      res.status(406);
      res.send("Token invalido!")
    }

  }

  async login(req, res){
    var {email, password} = req.body;

    var user = await User.findByEmail(email);

    if(user != undefined){

      var result = await bcrypt.compare(password, user.password);
      
      if(result){

        var token = jwt.sign({ email: user.email, role: user.role}, secret);

        res.json({token: token});
        
      }else{
        res.status(406);
        res.json({err: "Senha incorreta"})
      }

    }else{
      res.status(406);
      res.json({status: false, err: "Usuario nao encontrado!"})

    }
  }

}

module.exports = new UsersController();
