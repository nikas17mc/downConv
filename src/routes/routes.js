const index = require('../components/index');
const upload = require('./upload');
// const scan = require('../middleware/scan');

module.exports = (app) => {
    app.use("/", index);
    app.use("/", upload);
    // app.use("/", scan);
}