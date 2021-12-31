const multer  = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'musics/');
  },
  filename: (req, file, cb) => {
  	console.log('\n\n\n');
    const uniquePreffix = Date.now();
    cb(null, uniquePreffix + file.originalname);
  }
});

const upload = multer({
	storage: storage,
  limits: {
  	files: 1,
    fileSize: 1024 * 1024 * 10
  }
});

module.exports = upload