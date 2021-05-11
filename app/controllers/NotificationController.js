const title = 'Thông Báo';

class NotificationController {
    // [GET] /notification
    index(req, res) {
        res.render('notification/index', { title });
    }
}

module.exports = new NotificationController();