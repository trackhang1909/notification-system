const title = 'Trang chủ';

class HomeController {
    // [GET] /
    index(req, res) {
        res.render('index', { title });
    }
}

module.exports = new HomeController();
