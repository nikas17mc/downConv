const uploadFile = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

const upload =  async (req, res, next) => {
    try {
        await uploadFile(req, res);

        if (req.file == undefined) {
            return res.status(422).render('index', {
                errorMessage: 'Please upload a file!!!'
            });
        };

        return res.status(200).render('index', {
            file: req.file
        });

    } catch (error) {
        next(error);
    };
};

const getListFiles = (req, res, next) => {
    const directoryPath = baseDir + '/static/uploads';

    fs.readdir(directoryPath, (error, files) => {
        if(error) {
            res.status(500).render('showF',{
                errorMessage: 'Unable to scan files!'
            });
            next(error);
        };

        let fileInfos = [];

        files.forEach((file) => {
            const filePath = path.join(directoryPath, file);
            const stats = fs.statSync(filePath);
            fileInfos.push({
                name: file,
                byte: stats.size,
            });
        });
        return res.status(200).render('showF', {
            fileInfos: fileInfos.length ? fileInfos : []
        });
    });
};

const download = (req, res, next) => {
    const fileName = req.params.name;
    const directoryPath =  baseDir + '/static/uploads/';

    res.download(directoryPath + fileName, fileName, (error) => {
        if (error) {
            res.status(500).render('', {
                errorMessage: `Could not download the file, because: ${error}`
            });
            next(error);
        };
    });
};

const remove = (req, res, next) => {
    const fileName = req.params.name;
    const directoryPath = baseDir + '/static/uploads/';
    fs.unlink(directoryPath + fileName, (error) => {
        if(error) {
            res.status(500).render('showF', {
                errorMessage: `Could not delete the file, becasuse: ${error}`
            })
            next(error);
        };
        return res.status(200).send({
            message: 'File is deleted.'
        });
    })
}

module.exports = {
    upload,
    getListFiles,
    download,
    remove
}