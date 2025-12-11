const router = require("express").Router();
const multer = require("multer");
const documentController = require("../controllers/document.controller");

const upload = multer({ dest: "uploads/" });

router.post(
    "/upload-document",
    upload.single("document"),
    documentController.uploadDocument
);

router.get("/get-document/:document", documentController.getDocument);

module.exports = router;
