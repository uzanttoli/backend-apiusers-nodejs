var db = require("../database/connection");
var User = require("./User");


class PasswordToken{

    async create(email){
        var user = await User.findByEmail(email);

        if(user != undefined){

            try {

                var token = Date.now();

                await db.insert({
                    user_id: user.id,
                    used: 0,
                    token:token
                }).table("passwordtokens");
                return {status: true, token: token}
            } catch (error) {

                console.log(error);
                return {status: false, err: error}
            }

        }else{
            return {status: false, err: "O email passado não existi!"}
        }
    }


    async validate(token){
        try {
            var result = await db.select("*").where({token: token}).table("passwordtokens");
            
            if(result.length > 0){

                var tk = result[0];

                if(tk.used){
                    return {status: false};
                }else{
                    return {status: true, token: tk};
                }

            }else{
                return {status: false};
            }

        } catch (error) {
            console.log(error);
            return {status: false};
        }
    }


    async setUserd(token){
        await db.update({used: 1}).where({token: token}).table('passwordtokens');
    }



    
}

module.exports = new PasswordToken();