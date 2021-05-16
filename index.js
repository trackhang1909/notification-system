require('dotenv').config();
const express = require('express');
const path = require('path');
const route = require('./routes');
const cookieParser = require('cookie-parser')
const connectDatabase = require('./config/database');
const passportConfig = require('./config/passport');
const fileUpload = require("express-fileupload");
const socketio = require('socket.io');
const Notification = require('./app/models/Notification');

const app = express();

//Passport config
passportConfig(app);

//Connect database
connectDatabase();

//Static file
app.use(express.static('public'));

//Cookie parse
app.use(cookieParser());

//Body parse
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'resources/views'));

//Set root name
global.rootName = __dirname;

//Routes init
route(app);

//Listen port
const port = process.env.PORT;
const httpServer = app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
const io = socketio(httpServer);

io.on('connection', client => {
    client.on('create-notification', notification => {
        client.broadcast.emit('new-notification', notification);
    });
});


