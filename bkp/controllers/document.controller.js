const config = require("config");
const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");
const s3 = new AWS.S3({});

const uploadToS3 = (req, res) => {
    return new Promise((resolve, reject) => {
        // const instance = new Cryptify(  //create instance for document encryption
        //     req.file.path,
        //     config.get("cryptify.secret_key")
        // );
        // instance
        //     .encrypt()  //encrypt uploaded document
        //     .then((files) => {
        //         const params = {
        //             Bucket: config.get('aws.bucket_name'), // pass your bucket name
        //             Key: req.file.originalname, // file will be saved as testBucket/contacts.csv
        //             Body: fs.readFileSync(req.file.path),
        //         };
        //         s3.upload(params, (s3Err, data) => {  //Upload document to S#
        //             if (s3Err) {
        //               reject({ success: false, file: "s3 Error" });
        //             } else {
        //                 fs.unlinkSync(req.file.path); //Remove file from over server
        //                 resolve({ success: true, file: data });
        //             }
        //         });
        //     })
        //     .catch((e) => console.error(e));

        const uniqueFilename = Date.now() + '-' + req.file.originalname
        const params = {
            Bucket: config.get('aws.bucket_name'), // pass your bucket name
            Key: uniqueFilename, // file will be saved as testBucket/contacts.csv
            Body: fs.readFileSync(req.file.path),
        };
        s3.upload(params, (s3Err, data) => {  //Upload document to S#
            if (s3Err) {
                console.log(s3Err);
                reject({ success: false, file: "s3 Error" });
            } else {
                fs.unlinkSync(req.file.path); //Remove file from over server
                resolve({ success: true, file: {...data, fileName: req.file.originalname} });
            }
        });
    });
};

const getDocument = async (req, res) => {
    const { params } = req;
    var paramsData = {
        Key: params.document,
        Bucket: config.get('aws.bucket_name'),
    };
    s3.getObject(paramsData, (err, data) => { //Get Document from S3
        if (err) {
            res.send("File not found");
        } else {
            res.json({ ok: true, file: data.Body });
            // fs.writeFileSync("./download/" + params.document, data.Body); //Save document in over server
            //
            // res.sendFile(params.document, options, (err) => { //send Document to user
            //     fs.unlinkSync(
            //       path.resolve("./") + "/download/" + params.document //Remove document from over server
            //     );
            //     if (err) {
            //         next(err);
            //     }
            // });

            // fs.writeFileSync("./download/" + params.document, data.Body); //Save document in over server
            //
            // const instance = new Cryptify(
            //     "./download/" + params.document,
            //     config.get("cryptify.secret_key")
            // );
            // instance
            //     .decrypt() //Decrypt file
            //     .then((files) => {
            //         var options = {
            //             root: path.resolve("./") + "/download",
            //         };
            //
            //         res.sendFile(params.document, options, (err) => { //send Document to user
            //             fs.unlinkSync(
            //                 path.resolve("./") + "/download/" + params.document //Remove document from over server
            //             );
            //             if (err) {
            //                 next(err);
            //             }
            //         });
            //     })
            //     .catch((e) => res.send("File decrypt error"));
        }
    });
};

const uploadDocument = (req, res) => {
    uploadToS3(req, res).then(
        (resObj) => {
            console.log(resObj);
            res.json({ ok: true, key: resObj.file.Key, fileName: resObj.file.fileName });
        },
        (err) => {
            res.json({ error: err, ok: false });
            error(err);
        }
    );
};

module.exports = {
    uploadDocument,
    getDocument,
};
