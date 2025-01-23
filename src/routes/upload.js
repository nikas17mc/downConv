const router = require('express').Router();
const controller = require('../controller/file.controller');

router.post('/upload', controller.upload);
router.get('/files', controller.getListFiles);
router.get('/file/:name', controller.download);
router.delete('/deleteFile/:name', controller.remove);

module.exports = router;