import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import userRoute from "./route/userRoute.js";
import courseRoute from "./route/courseRoute.js";
import eventRoute from "./route/eventRoute.js";
import meetingRoute from "./route/meetingRoute.js";
import { notFoundError } from './middleware/error-handler.js';
import { initMeeting } from './meeting-server.js';
import http from 'http';


const app = express();
const port = process.env.PORT || 3003;
const databaseName = "Student-Journey";
const dbURIOffline = `mongodb://0.0.0.0:27017/${databaseName}`;

mongoose.set("debug", true);
mongoose.Promise = global.Promise;

mongoose.connect(dbURIOffline, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(`Connected to ${databaseName}`);
}).catch((err) => {
    console.log(err.message);
});

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use('/img', express.static('public/images'));

//routes
app.get('/', (req, res) => {
    res.send({message: 'Default route'});
});

//user
app.use('/user', userRoute);

//course
app.use('/course',courseRoute);
//events
app.use('/event',eventRoute);
//meeting
app.use('/meeting',meetingRoute);
// Initialize meeting server
const server = http.createServer(app);
initMeeting(server);

const router = express.Router();
//no route found
app.use(notFoundError);

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});