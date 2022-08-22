const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const HttpExeception = require('./utils/HttpExeception.utils');
const errorMiddleware = require('./middleware/error.middleware');
const userRouter = require('./routes/user.route');


// Init express
const app = express();
//Init environment 
dotenv.config();
//parse request of content-type: app/json
//parses incoming requests with json payloads
app.use(express.json());

//enabling cors for all requests by using cors middleware
app.use(cors());
//enable pre-flight
app.options("*", cors());

const port = Number(process.env.PORT || 3031);

app.use(`/api/users`, userRouter);

//404 
app.all('*', (req, res, next) => {
    const err = new HttpExeception(404, 'Opps Endpoint Not Found.');
    next(err);
});

//Error middleware
app.use(errorMiddleware);

// starting the server
app.listen(port, () => 
    console.log(`server running on port ${port}!`));

module.exports = app;
