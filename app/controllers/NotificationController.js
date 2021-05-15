const title = 'Thông Báo';
const User = require('../models/User');
const Notification = require('../models/Notification');
const Category = require('../models/Category');
const fs = require('fs');

class NotificationController {
    // [GET] /notification
    async index(req, res) {
        const user = await User.findById(res.locals.userId).populate('categories').lean();
        const categories = user.categories;
        const allCategories = await Category.find({}).lean();
        let perPage = 10;
        let page = 1;
        let notifications;
        let categoryId = req.query.categoryId || 'error';
        let count;

        try {
            notifications = await Notification.find({ category: categoryId }).sort([['createdAt', -1]])
                .populate('category').skip((perPage * page) - perPage) 
                .limit(perPage).lean();
            count = await Notification.countDocuments({ category: categoryId });
        }
        catch (error) {
            notifications = await Notification.find({}).sort([['createdAt', -1]])
                .populate('category').skip((perPage * page) - perPage) 
                .limit(perPage).lean();
            count = await Notification.countDocuments();
        }

        notifications.forEach(notification => {
            let tempContent = notification.content.split('</p>');
            let newContent = '';
            if (tempContent[0].includes('<p>')) newContent = tempContent[0] + '</p>';
            notification.content = newContent ? newContent : notification.title;
        });
        res.render('notification/index', { 
            title, categories, notifications, allCategories, categoryId,
            current: page, 
            pages: Math.ceil(count / perPage),
            url: '/notification' 
        });
    }
    // [GET] /notification/table
    async getNotification(req, res) {
        let perPage = 10;
        let page = parseInt(req.query.page) || 1;
        let notifications;
        let categoryId = req.query.categoryId || 'error';
        let count;

        try {
            notifications = await Notification.find({ category: categoryId }).sort([['createdAt', -1]])
                .populate('category').skip((perPage * page) - perPage) 
                .limit(perPage).lean();
            count = await Notification.countDocuments({ category: categoryId });
        }
        catch (error) {
            notifications = await Notification.find({}).sort([['createdAt', -1]])
                .populate('category').skip((perPage * page) - perPage) 
                .limit(perPage).lean();
            count = await Notification.countDocuments();
        }

        notifications.forEach(notification => {
            let tempContent = notification.content.split('</p>');
            let newContent = '';
            if (tempContent[0].includes('<p>')) newContent = tempContent[0] + '</p>';
            notification.content = newContent ? newContent : notification.title;
        });
        res.render('notification/table', { 
            notifications, categoryId,
            current: page, 
            pages: Math.ceil(count / perPage) 
        });
    }
    // [POST] /notification
    store(req, res) {
        const { title, content, category, files } = req.body;
        Notification.create({
            title,
            content,
            category,
            user: res.locals.userId,
            files
        })
        .then(notification => { 
            return res.json({ status: 'success', message: 'Đăng thông báo thành công', notification }) 
        })
        .catch(() => { return res.json({ status: 'fail', message: 'Đăng thông báo thất bại' }) });
    }
    // [PUT] /notification
    update(req, res) {
        const { _id, title, content, category, files } = req.body;
        let options = { title, content, category, user: res.locals.userId, files };
        if (files.length === 0) {
            options = { title, content, category, user: res.locals.userId };
        }
        Notification.updateOne({ _id }, options)
        .then(() => { 
            return res.json({ status: 'success', message: 'Cập nhật thông báo thành công' }) 
        })
        .catch(() => { return res.json({ status: 'fail', message: 'Cập nhật thông báo thất bại' }) });
    }
    // [DELETE] /notification
    destroy(req, res) {
        const { _id } = req.body;
        Notification.deleteOne({ _id })
        .then(() => { 
            return res.json({ status: 'success', message: 'Xóa thông báo thành công' }) 
        })
        .catch(() => { return res.json({ status: 'fail', message: 'Xóa thông báo thất bại' }) });
    }
    // [GET] /notification/detail
    async detail(req, res) {
        const title = 'Chi Tiết Thông Báo';
        const user = await User.findById(res.locals.userId).populate('categories').lean();
        const categories = user.categories;
        const allCategories = await Category.find({}).lean();
        const _id = req.query.id;
        Notification.findById(_id).populate('category').lean()
            .then(notification => {
                return res.render('notification/detail', { title, categories, notification, allCategories, url: '/notification' });
            })
            .catch(() => { return res.redirect('/error') });
    }
    // [GET] /notification/detail-content
    async detailContent(req, res) {
        const _id = req.query.id;
        Notification.findById(_id).populate('category').lean()
            .then(notification => {
                return res.render('notification/detail_content', {  notification });
            })
            .catch(() => { return res.redirect('/error') });
    }
    // [POST] /notification/upload-files
    async uploadFiles(req, res) {
        const tempFiles = req.files['files[]'];
        const files = tempFiles.length === undefined ? [tempFiles] : tempFiles;
        let urls = [];

        files.forEach(file => {
            let sampleFile = file;
            let uploadPath = global.rootName + '/public/uploads/files/' + sampleFile.name;
            urls.push('/uploads/files/' + sampleFile.name);
    
            sampleFile.mv(uploadPath, function(err) {
                if (err) {
                    urls.pop();
                    return res.status(500).json(err);
                } 
            });
        });

        return res.status(200).json({
            uploaded: true,
            urls
        });
    }
    // [GET] /notification/pagination
    pagination(req, res) {
        let perPage = 5;
        let page = req.query.page || 1;

        Notification
            .find({})
            .sort([['createdAt', -1]])
            .skip((perPage * page) - perPage) 
            .limit(perPage)
            .exec((err, notifications) => {
                Notification.countDocuments((err, count) => {
                    if (err) return next(err);
                    res.json({
                        notifications,
                        current: page, 
                        pages: Math.ceil(count / perPage) 
                    });
            });
        });
    }
    // [POST] /notification/get-content-by-id
    getContentById(req, res) {  
        const { _id } = req.body;
        Notification.findById(_id).lean()
            .then(notification => {
                return res.json({ status: 'success', notification });
            })
            .catch(() => { return res.json({ status: 'fail' }) });
    }
    // [POST] /notification/delete-file
    deleteFile(req, res) {
        const { _id, path } = req.body;
        fs.unlinkSync(global.rootName + '/public' + path);
        Notification.updateOne({ _id }, { '$pull': { 'files': path } })
            .then(async () => { 
                return res.json({ status: 'success', message: 'Xóa tệp tin thành công' }); 
            })
            .catch(() => { return res.json({ status: 'fail', message: 'Xóa tệp tin thất bại' }) });
    }
}

module.exports = new NotificationController();