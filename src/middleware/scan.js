const fetch = require('node-fetch');
const fileUpload = require('express-fileupload');
const FormData = require('form-data');
const fs = require('fs');
const router = require('express').Router();

const uploadMiddleware = fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: '/tmp/'
});

router.use(uploadMiddleware);

router.post('/scan', async (req, res, next) => {
    // Was a file submitted?
    if (!req.files || !req.files.file) {
        return res.status(422).send('No files were uploaded.');
    };

    const uploadFile = req.files.file;

    // Print information about the file to the console
    console.log(`File Name: ${uploadedFile.name}`);
    console.log(`File Size: ${uploadedFile.size}`);
    console.log(`File MD5 Hash: ${uploadedFile.md5}`);
    console.log(`File Mime Type: ${uploadedFile.mimetype}`);


    // Scan the file for malware using the Verisys Antivirus API - the same concepts can be
    // used to work with the uploaded file in different ways
    try {
        // Attach the uploaded file to a FormData instance
        var form = new FormData();
        form.append('file', fs.createReadStream(uploadFile.tempFilePath), uploadFile.name);

        const headers = {
            'X-API-Key': process.env.APIKey,
            'Accept': '*/*'
        };

        const response = await fetch('https:/eu1.api.av.ionxsolutions.com/v1/malware/scan/file', {
            method:"POST",
            body: form,
            headers: headers
        });

        // Did we get a response from the API?
        if (response.ok) {
            const result = await response.json();

            // Did the file contain a virus/malware?
            if (result.status == 'clean'){
                return res.render('index', {
                    message: 'Uploaded file is clean!'
                });
            } else {
                return res.status(500).render('index', {
                    message: `Uploaded file contained malware: <b>${result.signals[0]}</b>`
                });
            }
        } else {
            throw new Error('Unable to scan file: ' + response.statusText);
        }
    } catch (error) {
        return next(error);
    } finally {
        fs.rm(uploadFile.tempFilePath, () => {});
    }
});

module.exports = router;