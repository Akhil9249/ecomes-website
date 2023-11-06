

const multer = require('multer')
const path =require('path')

const storage = multer.diskStorage({
      destination: function (req, file, cb) {

        cb(nul, "adminpublic/image")

        // if (file.fieldname !== 'image') {
        //   cb(null, 'public/admin/assets/uploads')
        // } else {
        //   cb(null, 'public/admin/uploadedimages')
        // }
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
      }
    
    })
      
    exports.upload = multer({ storage })

// const path = require('path')
// const multer  = require('multer')
// const storage = multer.diskStorage({
//     destination : function (req,file,cb){      
//         cb(nul, "uploads/")
//     },
//     filename: function (req,file,cb){
//        let ext = path.extname(file.originalname)
//         cb(null,Date.now()+ext)
//     }
// })
// const upload = multer({
//     storage: storage,
//     fileFilter : function(req,file,callback){
//         if(
//             file.mimetype == "image/png" ||
//             file.mimetype == "image/jpg" 
//         ){
//             callback(null,true)
//         } else{
//             console.log('only png & jpg file supported')
//             callback(null,false)
//         }
//     },
//     limits : {
//         fileSize : 1024 * 1024 * 2
//     }
// })
// module.exports = upload