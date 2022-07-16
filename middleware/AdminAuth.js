var jwt = require("jsonwebtoken");

var secret = "eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY1Nzc1MTQyMywiaWF0IjoxNjU3NzUxNDIzfQ";

module.exports = function(req, res, next){

    const authToken = req.headers['authorization'];

    if(authToken != undefined){
        
        const bearer = authToken.split(" ");
        var token = bearer[1];
        
        try {
            var decoded = jwt.verify(token, secret);

            if(decoded.role == 1){

                next();
            }else{

                res.status(403);
                res.send("Você não tem permissão!");
                return;

            }

        } catch (error) {
            
            res.status(403);
            res.send("Você nao esta autenticado!");
            return;

        }


    }else{

        res.status(403);
        res.send("Você nao esta autenticado!");
        return;

    }

}