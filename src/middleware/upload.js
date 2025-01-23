const util = require('util');
const multer = require('multer');
const maxSize = 5 * 1024 * 1024;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, baseDir + '/static/uploads');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${file.originalname}-${uniqueSuffix}`);
    }    
});

const uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize}
}).single('file');

const uploadMiddleware = util.promisify(uploadFile)

module.exports = uploadMiddleware;