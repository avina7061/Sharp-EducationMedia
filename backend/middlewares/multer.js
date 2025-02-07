import multer from "multer";
const upload = multer({
  storage: multer.memoryStorage(),
});
export default upload;
//multer gives access of file in reqest server side as req.file;
