const multer = require('multer');
const path = require('path');

const getlogger = require("../services/logger")
const logger=getlogger("courses")


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/courses/')
    },
    filename: function (req, file, cb) {
        let ext = path.extname(file.originalname) 
        cb(null, Date.now() + ext)
    }
})

var upload = multer({ 
    storage: storage,
    fileFilter : (req,file,callback) => {
        if(file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype ==  "image/jpeg")
        {
            callback(null,true);
        }
        else
        {
            logger.error("Not supported file type")
            callback(null,false);
        }
    },
    limits:{ fileSize : 1024 * 1024 * 2},
})

module.exports = upload