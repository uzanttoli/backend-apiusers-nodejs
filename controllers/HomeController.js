class HomeController{

    async index(req, res){
        res.send("TESTE1");
    }


    async validate(req, res){
        res.send('okay');
    }

}

module.exports = new HomeController();