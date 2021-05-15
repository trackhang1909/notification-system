const Post = require("../models/Post");
const Notification = require("../models/Notification");

const title = 'Trang Chủ';

class HomeController {
    // [GET] /
    index(req, res) {
        Post.find()
            .populate('user')
            .populate({ path: 'comments', 
                options: { limit: 5, sort: { 'createdAt': -1 } },
                populate: {
                    path: 'user'
            }})
            .sort([['createdAt', -1]])
            .limit(10)
            .lean()
            .then(async posts => {
                for await (const post of posts) {
                    const p2 = await Post.findById(post._id).lean();
                    post.commentsLength = p2.comments.length;
                    
                    let stringArray = post.likes.map(e => String(e))
                    post.stringLikes = stringArray;
                }
                const notifications = await Notification.find({})
                    .populate('category').sort([['createdAt', -1]]).limit(10).lean();
                return res.render('index', { title, posts, notifications });
            });
    }
    // [GET] /my-profile
    myProfile(req, res) {
        Post.find({ user: res.locals.userId })
            .populate('user')
            .populate({ path: 'comments', 
                options: { limit: 5, sort: { 'createdAt': -1 } },
                populate: {
                    path: 'user'
            }})
            .sort([['createdAt', -1]])
            .limit(10)
            .lean()
            .then(async posts => {
                for await (const post of posts) {
                    const p2 = await Post.findById(post._id).lean();
                    post.commentsLength = p2.comments.length;
                    
                    let stringArray = post.likes.map(e => String(e))
                    post.stringLikes = stringArray;
                }
                const notifications = await Notification.find({})
                    .populate('category').sort([['createdAt', -1]]).limit(10).lean();
                return res.render('index', { title, posts, notifications });
            });
    }
}

module.exports = new HomeController();
