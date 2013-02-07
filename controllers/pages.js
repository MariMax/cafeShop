
exports.add_routes = function (app) {
    app.get("/home", function (req, res) {
        res.render('pages/home', {
            title: 'Home page'
    , message: 'This is the "home" action of "pages" controller'
        })
    })

    app.get("/about", function (req, res) {
        res.render('pages/about', {
            title: 'about'
    , message: 'This is the "about" action of "pages" controller'
        })
    } )
}