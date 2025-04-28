//reuqire multer ,uuid v4 , path
const multer = require('multer');
const { v4: uuidv4 } = require('uuid')
const path = require('path') //by defoult with npm package
//Storage Setup

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/uploads')
    },
    //changes file name unique name version 4
    filename: function (req, file, cb) {
        const uniqueFilename = uuidv4();
        cb(null, uniqueFilename + path.extname(file.originalname))//add path for file extension name
    }
})

const upload = multer({ storage: storage })
module.exports = upload


