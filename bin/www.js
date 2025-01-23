// Define the required packages
require('dotenv').config();
const http = require('http');
const app = require("../app");

// Define the requiered variables
// var options = {
//   key: fs.readFileSync('./ssl/server-key.pem'),
//   cert: fs.readFileSync('./ssl/server-cert.pem')
// }


// Create the server
const server = http.createServer(app);

// Define extra modules for development mode
// const pm2 = require('pm2');
// const { exec } = require('child_process');


// Functions to handle the server
const normalizePort = (val) => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}

const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'Pipe: ' + addr : 'Port: ' + addr.port;
    console.log('\x1b[34m%s\x1b[33m%s\x1b[0m', 'Listening on ', bind);
}

const onError = (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof envPORT === 'string' ? 'pipe' + envPORT : 'port' + envPORT;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
        default:
            throw error;
    }
};

// Define the variables
const envPORT = process.env.PORT || '3000';
const port = normalizePort(envPORT);


// Set the port
app.set('port', port);

// Listen on the port
const start = async () => {
    try {
        server.listen(port);
        server.on('listening', onListening);
    }
    catch (error) {
        server.on('error', onError(error));
        console.error(error);
    }
}
start();
