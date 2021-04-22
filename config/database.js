const mongoose = require('mongoose');
const Role = require('../app/models/Role');

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