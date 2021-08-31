const mongoose = require('mongoose');
const Msg = require('./models/messages');
// adding a CORS options for prevent socket.io error 'Access-Control-Allow-Origin'
// more info: https://socket.io/docs/v4/migrating-from-2-x-to-3-0/#CORS-handling
const io = require('socket.io')(3000, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});
// register at https://cloud.mongodb.com, create a new cluster and new database, go to "Connect", "Connect your application" and put the string from this window
const mongoDB = 'mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTE_NAME.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('connected to database')
}).catch(err => console.log(err));
io.on('connection', (socket) => {
    Msg.find().then(result => {
        socket.emit('output-messages', result)
    })
    console.log('a user connected');
    socket.emit('message', 'Hello world');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('chatmessage', msg => {
        const message = new Msg({ msg });
        message.save().then(() => {
            io.emit('message', msg)
        })


    })
});