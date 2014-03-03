var forms = require('../forms/CommonForms.js');
var common = require('../models/CommonFunctions.js');
var sendMail = common.sendMail;
var locale = require("locale");



exports.add_routes = function (app) {
    app.post("/api/common/supportemail", forms.SupportForm, function (req, res) {
        console.log(req.form.UserName + " " + req.form.email + " " + req.form.text);
        sendMail('support@idiesh.ru', conf.site_email, "Проблема", req.form.UserName + " " + req.form.email + " " + req.form.text, function (error, message) { console.log(error + " " + message); res.json("ok", 200) });
    });
	
	app.get("/api/common/getLang", function(req, res) {
		res.header("Content-Type", "text/plain")
		res.send(req.locale);
	})

}
