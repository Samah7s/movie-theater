const express = require('express');
const router = require('./routes/index');
const http = require('http');
const config = require('./config/index');
const cookieParser = require('cookie-parser');
const app = express();

//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/api', router);

//Run the server
let httpServer = http.createServer(app);
httpServer.listen(config.port, () => {
	console.log(`Running at port ${config.port}`)
});