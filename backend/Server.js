const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}
const cloudinary = require('cloudinary').v2;



app.use(cors(corsOptions))
app.set("view engine", "ejs");

const dotenv = require("dotenv") ;
dotenv.config();
const Petsitter = require('./Petsitter');
const Owner = require('./Owner');

const mongoose = require('mongoose');

//cloudinary

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
  });

const uploadToCloudinary = async (buffer) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }).end(buffer);
    });
  };
const uri = process.env.url;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
mongoose.connect(uri);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})


// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Multer setup for file uploads (in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to render image upload page and display images
app.get('/', (req, res) => {
    Petsitter.find({})
        .then(data => {
            res.render('imagepage', { items: data });
        })
        .catch(err => console.log(err));
});

// Route to handle image upload
app.post('/petsitter', upload.fields([
    { name: 'image', maxCount: 1 },   // Single image upload
    { name: 'files', maxCount: 10 }   // Array of files (up to 10 files)
]),   async(req, res, next) => {
    console.log( req.body, req.files)
   
    if (!req.files) {
        return res.status(400).json({ error: 'No files uploaded' });
    }
    let imageUrl = '';
    let fileUrls = [];
    try {
         // Upload the single image to Cloudinary
         const imageResult = await uploadToCloudinary(req.files.image[0].buffer);
         imageUrl = imageResult.secure_url;
 
         // Upload each file in the files array to Cloudinary
         for (let i = 0; i < req.files.files.length; i++) {
             const file = req.files.files[i];
             const result = await uploadToCloudinary(file.buffer);
             fileUrls.push(result.secure_url);  // Store Cloudinary URLs
         }
 
         console.log('Image URL:', imageUrl);
         console.log('File URLs:', fileUrls);
       // res.json({ imageUrl: result.secure_url });
      } catch (error) {
        console.log(error)
        //res.status(500).json({ error: 'Failed to upload image' });
      }
   
    const obj = {
        avatar: imageUrl,
        files: fileUrls,  // Store array of file URLs
        name: req.body.name,
        email: req.body.email,
        city: req.body.city,
        state: req.body.state,
        preference: req.body.location,
        password: req.body.password,  // Handle password securely
    };
    Petsitter.create(obj)
    .then(item => {
        res.status(200).json({ message: 'Image uploaded successfully', item }); // Ensure a JSON response
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Database error' }); // Send a JSON error response
    }); 
});

// Route to handle owner details
app.post('/owner', upload.fields([
    { name: 'image', maxCount: 1 },   // Single image upload
    { name: 'files', maxCount: 10 }   // Array of files (up to 10 files)
]),   async(req, res, next) => {
    console.log( req.body, req.files)
   
    if (!req.files) {
        return res.status(400).json({ error: 'No files uploaded' });
    }
    let imageUrl = '';
    let fileUrls = [];
    try {
         // Upload the single image to Cloudinary
         const imageResult = await uploadToCloudinary(req.files.image[0].buffer);
         imageUrl = imageResult.secure_url;
 
         // Upload each file in the files array to Cloudinary
         for (let i = 0; i < req.files.files.length; i++) {
             const file = req.files.files[i];
             const result = await uploadToCloudinary(file.buffer);
             fileUrls.push(result.secure_url);  // Store Cloudinary URLs
         }
 
         console.log('Image URL:', imageUrl);
         console.log('File URLs:', fileUrls);
       // res.json({ imageUrl: result.secure_url });
      } catch (error) {
        console.log(error)
        //res.status(500).json({ error: 'Failed to upload image' });
      }
   
    const obj = {
        avatar: imageUrl,
        files: fileUrls,  // Store array of file URLs
        name: req.body.name,
        email: req.body.email,
        city: req.body.city,
        state: req.body.state,
        preference: req.body.location,
        password: req.body.password,  // Handle password securely
    };
    Owner.create(obj)
    .then(item => {
        res.status(200).json({ message: 'Image uploaded successfully', item }); // Ensure a JSON response
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Database error' }); // Send a JSON error response
    }); 
});


// Start the server
const port = process.env.PORT || 5000;
app.listen(port, err => {
    if (err) throw err;
    console.log(`Server listening on port ${port}`);
});

