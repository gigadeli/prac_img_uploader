const express = require("express")
const cors = require("cors")
const multer = require("multer")
const fs = require('fs');
const path = require('path');

const port = 3001

const app = express()
app.use(cors())
app.use(express.json())
// app.use('/public', express.static('public'))
app.use('/img', express.static(__dirname + '/public/Files'))

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		return cb(null, "./public/Files")
	},
	filename: function(req, file, cb) {
		return cb(null, `${Date.now()}_${file.originalname}`)
	}
})

const upload = multer({storage, fileFilter: (req, file, cb) => {
	if(file.mimetype.includes("image")) {
		cb(null, true);
		return;
	}
	cb(new TypeError("Invalid File Type"));
}})

app.post("/upload", upload.single("file"), (req, res) => {
	console.log(req.body)
	console.log(req.file)
	res.status(200).send("uploaded")
})

app.get("/images", (req, res) => {
	fs.readdir("./public/Files", (err, files) => {
		if (err) {
			console.error('Error reading directory:', err);
			return res.status(500).json({ error: 'Failed to read directory' });
		}
	
		// ファイルを画像ファイルにフィルタリング
		const imageFiles = files.filter(file => {
			const ext = path.extname(file).toLowerCase();
			return ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif';
		});
	
		res.status(200).json({ images: imageFiles });
	});
})

app.listen(port, () => {
	console.log("Server is running")
})
