const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Comment = require('../models/Comment');

const Post = new Schema({
    content: { type: String, required: true },
    images: [{ type: String }],
    video: { type: String },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
}, {
    timestamps: true,
});

Post.pre('deleteOne', { document: true, query: false }, async function(next) {
    for await (let comment of this.comments) {
        Comment.deleteOne({ _id: comment }).exec();
    }
    next();
});

Post.statics.splitContentBefore = (allContent) => {
    let result = [];
    let content, video;
    let images = [];
    let tempContent = allContent.split('<figure');
    tempContent.forEach(element => {
        if (element.includes('figure') && element.includes('image')) {
            images.push('<figure' + element);
        }
        else if (element.includes('figure') && element.includes('media')) {
            let tempVideo1 = element.split('url="');
            let tempVideo2 = tempVideo1[1].split('"></oembed></figure>')[0];
            video = tempVideo2;
        }
        else {
            content = element;
        }
    });
    result.push(content);
    result.push(images);
    result.push(video);
    return result;
}

Post.statics.splitContentMiddle = (allContent) => {
    let result = [];
    let content = ''; 
    let video;
    let images = [];
    let tempContent = allContent.split('<figure');
    // Get content
    content = tempContent.shift();
    let tempContent1 = tempContent.pop().split('</figure>');
    content = content + tempContent1.pop();
    // New array (image, video)
    tempContent1.forEach(element => {
        element = element + '</figure>';
        tempContent.push(element);
    });
    tempContent.forEach(element => {
        if (element.includes('figure') && element.includes('image')) {
            images.push('<figure' + element);
        }
        else if (element.includes('figure') && element.includes('media')) {
            let tempVideo1 = element.split('url="');
            let tempVideo2 = tempVideo1[1].split('"></oembed></figure>')[0];
            video = tempVideo2;
        }
    });
    result.push(content);
    result.push(images);
    result.push(video);
    return result;
};

Post.statics.splitContentAfter = (allContent) => {
    let result = [];
    let content, video;
    let images = [];
    let tempContent = allContent.split('</figure>');
    tempContent.forEach(element => {
        if (element.includes('figure') && element.includes('image')) {
            images.push(element + '</figure>');
        }
        else if (element.includes('figure') && element.includes('media')) {
            let tempVideo1 = element.split('url="');
            let tempVideo2 = tempVideo1[1].split('"></oembed>')[0];
            video = tempVideo2;
        }
        else {
            content = element;
        }
    });
    result.push(content);
    result.push(images);
    result.push(video);
    return result;
};

module.exports = mongoose.model('Post', Post);