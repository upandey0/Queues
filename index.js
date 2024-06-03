import express from 'express';
import mongoose from 'mongoose';
import handleRegister from './controllers/user.controller.js';
import bodyParser from 'body-parser';
import multer from 'multer';
import pushInQueue from './asynchandlers/producer.js';
import worker from './asynchandlers/consumer.js'
import path from 'path'


const app = express();

const storage = multer.diskStorage({
    destination : 'uploads/',
    filename : (req,file,cb)=>{
        const fileExt = path.extname(file.originalname); 
        const fileName = `${Date.now()}${fileExt}`; 
        cb(null, fileName);
    }
})

const upload = multer({storage})

const dbConnection = async () => {
    const dbC = await mongoose.connect("mongodb://localhost:27017/bkr");
    console.log(`Connected to Database Successfully`);
};

dbConnection();

worker.on('active', () => {
    console.log('Worker is active and processing jobs');
});
  

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.post('/register-user',handleRegister);
app.post('/trans-upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
  
    const fileData = {
      filename: req.file.filename,
      originalname: req.file.originalname,
      // Add any other relevant file metadata here
    };
    console.log(req.file);
  
    // Enqueue the job with the file data
    await pushInQueue(fileData);
  
    res.status(200).json({ message: 'File uploaded and job enqueued successfully' });
  });


app.listen(8080, () => {
    console.log(`server started at port 8080`);
});