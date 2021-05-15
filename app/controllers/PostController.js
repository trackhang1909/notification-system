const Comment = require("../models/Comment");
const Post = require("../models/Post");

class PostController {
    // [GET] /post
    index(req, res) {
        let page = parseInt(req.query.page) || 10;
        
        Post.find()
            .populate('user')
            .populate({ path: 'comments', 
                options: { limit: 5, sort: { 'createdAt': -1 } },
                populate: {
                    path: 'user'
            }})
            .sort([['createdAt', -1]])
            .limit(page)
            .lean()
            .then(async posts => {
                for await (const post of posts) {
                    const p2 = await Post.findById(post._id).lean();
                    post.commentsLength = p2.comments.length;
                    
                    let stringArray = post.likes.map(e => String(e))
                    post.stringLikes = stringArray;
                }
        
                return res.render('post', { posts });
            });
    }
    // [GET] /post/my-profile
    myProfile(req, res) {
        let page = parseInt(req.query.page) || 10;
        
        Post.find({ user: res.locals.userId })
            .populate('user')
            .populate({ path: 'comments', 
                options: { limit: 5, sort: { 'createdAt': -1 } },
                populate: {
                    path: 'user'
            }})
            .sort([['createdAt', -1]])
            .limit(page)
            .lean()
            .then(async posts => {
                for await (const post of posts) {
                    const p2 = await Post.findById(post._id).lean();
                    post.commentsLength = p2.comments.length;
                    
                    let stringArray = post.likes.map(e => String(e))
                    post.stringLikes = stringArray;
                }
        
                return res.render('post', { posts });
            });
    }
    // [POST] /post
    store(req, res) {
        const { content: allContent } = req.body;
        let result = [];
        //Split content, image, video
        if (allContent.startsWith('<p>') && allContent.endsWith('</p>') && allContent.includes('figure')) result = Post.splitContentMiddle(allContent)
        else if (allContent.startsWith('<p>')) result = Post.splitContentBefore(allContent)
        else result = Post.splitContentAfter(allContent);
        let content = result[0]; 
        let images = result[1];
        let video = result[2];
        //Check video embed
        if (video && !video.includes('embed')) return res.json({ status: 'fail', message: 'Video không hợp lệ' });
        if (!content) return res.json({ status: 'fail', message: 'Nội dung không được để trống' });
        Post.create({
            content,
            images,
            video,
            user: res.locals.userId
        })
        .then(() => { return res.json({ status: 'success', message: 'Đăng bài thành công' }) })
        .catch((err) => { return res.json({ status: 'fail', err, message: 'Đăng bài thất bại' }) });
    }
    // [PUT] /post
    update(req, res) {
        const { _id, content: allContent } = req.body;
        let result = [];
        //Split content, image, video
        if (allContent.startsWith('<p>') && allContent.endsWith('</p>') && allContent.includes('figure')) result = Post.splitContentMiddle(allContent)
        else if (allContent.startsWith('<p>')) result = Post.splitContentBefore(allContent)
        else result = Post.splitContentAfter(allContent);
        let content = result[0]; 
        let images = result[1];
        let video = result[2];
        //Check video embed
        if (video && !video.includes('embed')) return res.json({ status: 'fail', message: 'Video không hợp lệ' });
        if (!content) return res.json({ status: 'fail', message: 'Nội dung không được để trống' });
        Post.updateOne({ _id }, {
            content,
            images,
            video,
            user: res.locals.userId
        })
        .then(() => { return res.json({ status: 'success', message: 'Chỉnh sửa thành công' }) })
        .catch((err) => { return res.json({ status: 'fail', err, message: 'Chỉnh sửa thất bại' }) });
    }
    // [DELETE] /post
    async destroy(req, res) {
        const { _id } = req.body;
        const post = await Post.findById(_id);
        post.deleteOne().then(() => { return res.json({ status: 'success', message: 'Xóa bài viết thành công' }) })
        .catch(() => { return res.json({ status: 'fail', message: 'Xóa bài viết thất bại' }) });
    }
    // [POST] /post/upload
    upload(req, res) {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        let sampleFile = req.files.upload;
        let uploadPath = global.rootName + '/public/uploads/images/' + sampleFile.name;

        sampleFile.mv(uploadPath, function(err) {
            if (err) return res.status(500).send(err);

            res.status(200).json({
                uploaded: true,
                url: '/uploads/images/' + sampleFile.name,
            });
        });
    }
    // [POST] /post/like
    async like(req, res) {
        const { _id, like } = req.body;
        let tempPost = await Post.findById(_id).lean();
        let likeLength = tempPost.likes.length;
        if (like === true) {
            Post.updateOne({ _id }, { '$push': { 'likes': res.locals.userId } })
            .then(async () => { 
                tempPost = await Post.findById(_id).lean();
                likeLength = tempPost.likes.length;
                return res.json({ status: 'success', likeLength }); 
            })
            .catch(() => { return res.json({ status: 'fail', likeLength }) });
        }
        else {
            Post.updateOne({ _id }, { '$pull': { 'likes': res.locals.userId } })
            .then(async () => { 
                tempPost = await Post.findById(_id).lean();
                likeLength = tempPost.likes.length;
                return res.json({ status: 'success', likeLength }); 
            })
            .catch(() => { return res.json({ status: 'fail', likeLength }) });
        }
    }
    // [POST] /post/get-content-by-id
    getContentById(req, res) {
        const { _id } = req.body;
        Post.findById(_id).lean().then(post => {
            let allContent;
            let images = post.images.length === 0 ? '' : post.images.reduce((acc, cur) => acc + cur);
            let video = !post.video ? '' : `<figure class="media"><oembed url="${post.video}"></oembed></figure>`;
            allContent = post.content + images + video;
            return res.json({ 
                status: 'success', allContent
            }); 
        })
        .catch(() => { return res.json({ status: 'fail' }) });
    }
    // [GET] /post/comment
    indexComment(req, res) {
        const _id = req.query._id;
        const page = req.query.page;
        Post.findById(_id)
            .populate({ path: 'comments', 
                options: { limit: parseInt(page), sort: { 'createdAt': -1 } },
                populate: {
                    path: 'user'
            }})
            .lean()
            .then(post => {
                res.render('comment', { post });
            });
    }
    // [POST] /post/comment
    async storeComment(req, res) {
        const { _id, comment } = req.body;
        let tempPost = await Post.findById(_id).lean();
        let commentLength = tempPost.comments.length;
        Comment.create({
            comment,
            user: res.locals.userId
        })
        .then(comment => { 
            //Update post - comments
            Post.findByIdAndUpdate(_id, { '$push': { 'comments': comment._id } }, { new: true })
            .then(post => { 
                commentLength = post.comments.length;
                return res.json({ status: 'success', commentLength }); 
            })
            .catch(() => { return res.json({ status: 'fail', commentLength }) });
        })
        .catch(() => { res.json({ status: 'fail', commentLength }) });
    }
    // [POST] /post/comment
    async updateComment(req, res) {
        const { _id, postId, comment } = req.body;
        let tempPost = await Post.findById(postId).lean();
        let commentLength = tempPost.comments.length;
        Comment.updateOne({ _id }, { comment })
        .then(() => {
            return res.json({ status: 'success', commentLength }); 
        })
        .catch(() => {
            return res.json({ status: 'fail', commentLength });
        });
    }
    // [DELETE] /post/comment
    async destroyComment(req, res) {
        const { _id, postId } = req.body;
        let tempPost = await Post.findById(postId).lean();
        let commentLength = tempPost.comments.length;
        
        Comment.deleteOne({ _id }).then(() => {
            //Update post - comments
            Post.findByIdAndUpdate({ _id: postId }, { '$pull': { 'comments': _id } }, { new: true })
            .then(post => { 
                commentLength = post.comments.length;
                return res.json({ status: 'success', commentLength }); 
            })
            .catch(() => { return res.json({ status: 'fail', commentLength }) });
        })
        .catch(() => { res.json({ status: 'fail', commentLength }) });
    }
}

module.exports = new PostController();
