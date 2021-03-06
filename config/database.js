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
                    name: 'Ph??ng C??ng t??c h???c sinh sinh vi??n'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Ph??ng ?????i h???c'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Ph??ng Sau ?????i h???c'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Ph??ng ??i???n to??n v?? m??y t??nh'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Ph??ng kh???o th?? v?? ki???m ?????nh ch???t l?????ng'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Ph??ng t??i ch??nh'
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
                    name: 'Trung t??m tin h???c'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Trung t??m ????o t???o ph??t tri???n x?? h???i'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Trung t??m ph??t tri???n Khoa h???c qu???n l?? v?? ???ng d???ng c??ng ngh???'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Trung t??m h???p t??c doanh nghi???p v?? c???u sinh vi??n'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Khoa Lu???t'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Trung t??m ngo???i ng??? - tin h???c ??? b???i d?????ng v??n h??a'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Vi???n ch??nh s??ch kinh t??? v?? kinh doanh'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Khoa M??? thu???t c??ng nghi???p'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Khoa ??i???n ??? ??i???n t???'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Khoa C??ng ngh??? th??ng tin'
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
                    name: 'Khoa Qu???n tr??? kinh doanh'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Khoa M??i tr?????ng v?? b???o h??? lao ?????ng'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Khoa Lao ?????ng c??ng ??o??n'
                })
                .then(category => {
                    categories.push(category);
                    console.log("Add category success");
                })
                .catch((err) => console.log("error", err));
                await Category.create({
                    name: 'Khoa T??i ch??nh ng??n h??ng'
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
                    name: ' Khoa Gi??o d???c qu???c t???'
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