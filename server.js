var express = require('express')
  , app = express()
  , pages = require(__dirname + '/controllers/pages')
  , ejsLocals = require('ejs-locals');
  
// configuration settings 
app.set('views', __dirname + '/views')
app.engine('ejs',ejsLocals)
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))

// mount routes
app.use(function (req, res, next) {
  app.locals.route = req.url
  next()
})

app.get('/', function (req, res) { res.redirect('home') })
app.get('/home', pages.home)
app.get('/about', pages.about)

app.listen(process.env.PORT);