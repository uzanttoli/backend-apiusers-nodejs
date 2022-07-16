var express = require("express");
var app = express();
var router = express.Router();
var HomeController = require("../controllers/HomeController");
var UsersController = require("../controllers/UsersController");
var AdminAuth = require("../middleware/AdminAuth");

router.get("/", HomeController.index);
router.post("/user", UsersController.create);
router.get("/user", AdminAuth, UsersController.index);
router.get("/user/:id", AdminAuth, UsersController.findUser);
router.put("/user",AdminAuth, UsersController.edit);
router.delete("/user/:id", UsersController.remove);
router.post("/recoverypassword", UsersController.recoverypassword);
router.post("/changepassword", UsersController.changepassword);
router.post("/login", UsersController.login);
router.post("/validate", AdminAuth, HomeController.validate);


module.exports = router;
