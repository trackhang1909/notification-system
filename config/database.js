const mongoose = require('mongoose');
const Role = require('../app/models/Role');
const Category = require('../app/models/Category');
const User = require('../app/models/User');
const bcrypt = require('bcrypt');

let DatabaseSingleton = (function () {

    let instance;

    async function connect() {
        try {
            let result = await mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true
            });
            initial();
            console.log('MongoDB connected.');
            return result;
        }
        catch (error) {
            console.log('MongoDB not connected. Error: ' + error);
            return error;
        }
    }

    async function initial() {
        let roleId;
        let roleIdFaculty;
        let categories = [];

        Role.estimatedDocumentCount(async (err, count) => {
            if (!err && count === 0) {
                await Role.create({
                    name: 'admin'
                })
                .then(role => {
                    roleId = role._id;
                    console.log("Added 'admin' to roles collection");
                })
                .catch((err) => console.log("error", err));
                await Role.create({
                    name: 'faculty'
                })
                .then(role => {
                    roleIdFaculty = role._id
                    console.log("Added 'faculty' to roles collection");
                })
                .catch((err) => console.log("error", err));
                await Role.create({
                    name: 'student'
                })
                .then(() => {
                    console.log("Added 'student' to roles collection");
                })
                .catch((err) => console.log("error", err));
            }
        });
        Category.estimatedDocumentCount(async (err, count) => {
            if (!err && count === 0) {
                await Category.create({
                    name: 'Phòng Công tác học sinh sinh viên'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Phòng Đại học'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Phòng Sau đại học'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Phòng điện toán và máy tính'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Phòng khảo thí và kiểm định chất lượng'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Phòng tài chính'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'TDT Creative Language Center'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Trung tâm tin học'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Trung tâm đào tạo phát triển xã hội'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Trung tâm phát triển Khoa học quản lý và Ứng dụng công nghệ'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Trung tâm hợp tác doanh nghiệp và cựu sinh viên'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Khoa Luật'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Trung tâm ngoại ngữ - tin học – bồi dưỡng văn hóa'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Viện chính sách kinh tế và kinh doanh'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Khoa Mỹ thuật công nghiệp'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Khoa Điện – Điện tử'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Khoa Công nghệ thông tin'
                })
                .then(category => {
                    categories.push(category);
                    User.create({
                        fullname: 'Khoa CNTT',
                        username: 'it',
                        email: 'it@gmail.com',
                        password: bcrypt.hashSync('12345678', 10),
                        role: roleIdFaculty,
                        categories: category
                    })
                    .then(() => {
                        console.log("Added 'it' to users collection");
                    })
                    .catch((err) => console.log("error", err));
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Khoa Quản trị kinh doanh'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Khoa Môi trường và bảo hộ lao động'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Khoa Lao động công đoàn'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Khoa Tài chính ngân hàng'
                })
                .then(category => {
                    categories.push(category);
                    User.create({
                        fullname: 'Khoa TCNH',
                        username: 'tcnh',
                        email: 'tcnh@gmail.com',
                        password: bcrypt.hashSync('12345678', 10),
                        role: roleIdFaculty,
                        categories: category
                    })
                    .then(() => {
                        console.log("Added 'tcnh' to users collection");
                    })
                    .catch((err) => console.log("error", err));
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: ' Khoa Giáo dục quốc tế'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await User.create({
                    fullname: 'Admin',
                    username: 'admin',
                    email: 'admin@gmail.com',
                    password: bcrypt.hashSync('12345678', 10),
                    role: roleId,
                    categories
                })
                .then(() => {
                    console.log("Added 'admin' to users collection");
                })
                .catch((err) => console.log("error", err));
            }
        });
    }

    function createInstance() {
        return connect();
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

module.exports = function () {
    return DatabaseSingleton.getInstance();
};