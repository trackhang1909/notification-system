const mongoose = require('mongoose');
const Role = require('../app/models/Role');
const Category = require('../app/models/Category');

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

    function initial() {
        Role.estimatedDocumentCount((err, count) => {
            if (!err && count === 0) {
                new Role({
                    name: "admin"
                }).save(err => {
                    if (err) {
                        console.log("error", err);
                    }
                    console.log("Added 'admin' to roles collection");
                });
                new Role({
                    name: "faculty"
                }).save(err => {
                    if (err) {
                        console.log("error", err);
                    }
                    console.log("Added 'faculty' to roles collection");
                });
                new Role({
                    name: "student"
                }).save(err => {
                    if (err) {
                        console.log("error", err);
                    }
                    console.log("Added 'student' to roles collection");
                });
            }
        });
        Category.estimatedDocumentCount((err, count) => {
            if (!err && count === 0) {
                Category.create({
                    name: 'Phòng Công tác học sinh sinh viên'
                })
                .then(() => console.log("Add category success"))
                .catch((err) => console.log("error", err));
                Category.create({
                    name: 'Phòng Đại học'
                })
                .then(() => console.log("Add category success"))
                .catch((err) => console.log("error", err));
                Category.create({
                    name: 'Phòng Sau đại học'
                })
                .then(() => console.log("Add category success"))
                .catch((err) => console.log("error", err));
                Category.create({
                    name: 'Phòng điện toán và máy tính'
                })
                .then(() => console.log("Add category success"))
                .catch((err) => console.log("error", err));
                Category.create({
                    name: 'Phòng khảo thí và kiểm định chất lượng'
                })
                .then(() => console.log("Add category success"))
                .catch((err) => console.log("error", err));
                Category.create({
                    name: 'Phòng tài chính'
                })
                .then(() => console.log("Add category success"))
                .catch((err) => console.log("error", err));
                Category.create({
                    name: 'TDT Creative Language Center'
                })
                .then(() => console.log("Add category success"))
                .catch((err) => console.log("error", err));
                Category.create({
                    name: 'Trung tâm tin học'
                })
                .then(() => console.log("Add category success"))
                .catch((err) => console.log("error", err));
                Category.create({
                    name: 'Trung tâm đào tạo phát triển xã hội'
                })
                .then(() => console.log("Add category success"))
                .catch((err) => console.log("error", err));
                Category.create({
                    name: 'Trung tâm phát triển Khoa học quản lý và Ứng dụng công nghệ'
                })
                .then(() => console.log("Add category success"))
                .catch((err) => console.log("error", err));
                Category.create({
                    name: 'Trung tâm hợp tác doanh nghiệp và cựu sinh viên'
                })
                .then(() => console.log("Add category success"))
                .catch((err) => console.log("error", err));
                Category.create({
                    name: 'Khoa Luật'
                })
                .then(() => console.log("Add category success"))
                .catch((err) => console.log("error", err));
                Category.create({
                    name: 'Trung tâm ngoại ngữ - tin học – bồi dưỡng văn hóa'
                })
                .then(() => console.log("Add category success"))
                .catch((err) => console.log("error", err));
                Category.create({
                    name: 'Viện chính sách kinh tế và kinh doanh'
                })
                .then(() => console.log("Add category success"))
                .catch((err) => console.log("error", err));
                Category.create({
                    name: 'Khoa Mỹ thuật công nghiệp'
                })
                .then(() => console.log("Add category success"))
                .catch((err) => console.log("error", err));
                Category.create({
                    name: 'Khoa Điện – Điện tử'
                })
                .then(() => console.log("Add category success"))
                .catch((err) => console.log("error", err));
                Category.create({
                    name: 'Khoa Công nghệ thông tin'
                })
                .then(() => console.log("Add category success"))
                .catch((err) => console.log("error", err));
                Category.create({
                    name: 'Khoa Quản trị kinh doanh'
                })
                .then(() => console.log("Add category success"))
                .catch((err) => console.log("error", err));
                Category.create({
                    name: 'Khoa Môi trường và bảo hộ lao động'
                })
                .then(() => console.log("Add category success"))
                .catch((err) => console.log("error", err));
                Category.create({
                    name: 'Khoa Lao động công đoàn'
                })
                .then(() => console.log("Add category success"))
                .catch((err) => console.log("error", err));
                Category.create({
                    name: 'Khoa Tài chính ngân hàng'
                })
                .then(() => console.log("Add category success"))
                .catch((err) => console.log("error", err));
                Category.create({
                    name: ' Khoa Giáo dục quốc tế'
                })
                .then(() => console.log("Add category success"))
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