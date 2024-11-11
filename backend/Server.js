const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const cors=require("cors");
const axios = require('axios');
const nodemailer = require("nodemailer");


const corsOptions ={
   origin:'*', 
   credentials:true,            
   optionSuccessStatus:200,
}
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);



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

const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const msRest = require('@azure/ms-rest-js');

// Replace with your Azure credentials
const key = process.env.ai_api_key;
const endpoint = process.env.Proxy_Endpoint;

const credentials = new msRest.ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } });
const client = new ComputerVisionClient(credentials, endpoint);

// Function to extract tags from an image using Azure Computer Vision API
async function analyzeImage(imageUrl) {
    const features = ['Tags'];  // Extract image tags for comparison
    const analysis = await client.analyzeImage(imageUrl, { visualFeatures: features });
    return analysis.tags.map(tag => tag.name);  // Return a list of tag names
}

// Function to compare two images by tags
function calculateSimilarity(tags1, tags2) {
    const commonTags = tags1.filter(tag => tags2.includes(tag));
    return (commonTags.length / Math.max(tags1.length, tags2.length)) * 100;  // Similarity as a percentage
}

// Function to compare multiple images using Azure Computer Vision
async function compareImages(imageUrls) {
    let results = [];

    // Loop through all pairs of images
    for (let i = 0; i < imageUrls.length - 1; i++) {
        for (let j = i + 1; j < imageUrls.length; j++) {
            try {
                const tags1 = await analyzeImage(imageUrls[i]);  // Analyze first image
                const tags2 = await analyzeImage(imageUrls[j]);  // Analyze second image

                // Calculate similarity between tags
                const similarity = calculateSimilarity(tags1, tags2);

                results.push({
                    image1: imageUrls[i],
                    image2: imageUrls[j],
                    similarity: similarity.toFixed(2) + '%'
                });
            } catch (error) {
                console.error('Error comparing images:', error);
            }
        }
    }

    return results;
}

// Multer setup for file uploads (in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper function to fetch all messages for a user based on the subject
async function getAllMessagesForEmail(email, subject) {
    if (subject === 'owner') {
        const owner = await Owner.findOne({ email });
        return owner ? owner.messages.filter(msg => msg.sender === email || msg.receiver === email) : [];
    } else if (subject === 'petsitter') {
        const petsitter = await Petsitter.findOne({ email });
        return petsitter ? petsitter.messages.filter(msg => msg.sender === email || msg.receiver === email) : [];
    }
    return [];
}

const { EventHubProducerClient } = require("@azure/event-hubs");

// Initialize Event Hub client
const connectionString = process.env.connectionstring;
const eventHubName = "petsitting"; 
const producer = new EventHubProducerClient(connectionString, eventHubName);

// Configuration for Azure OpenAI
const API_KEY = process.env.azureopenai;

const connectionString1 = process.env.connectionstring2;
const eventHubName1 = "messages"; 
const producer1 = new EventHubProducerClient(connectionString1, eventHubName1);

app.post('/api/send-complaint', async (req, res) => {
    const { email, message,subject } = req.body;
    console.log(req.body)
    try {
        // 1. Send the email and message to Azure OpenAI for offensive words check
        const openAIResponse = await axios.post(process.env.azureopenaiurl, {
            model: "gpt-35-turbo",
            messages: [
                { role: "user", content: `Please check the following message for offensive content: "${message}"` }
            ]
        }, {
            headers: {
                "Content-Type": "application/json",
                "api-key": API_KEY,
            }
        });

        const openAIData = openAIResponse.data;
        console.log(openAIData);
        const offensiveContent = "" + openAIData?.choices[0]?.message?.content || "";
        console.log(offensiveContent);

        // 2. Check if offensive content was found
        const isOffensive = offensiveContent.toLowerCase().includes("offensive"); // Adjust based on your needs

        // 3. Prepare the payload for Event Hub
        const streamPayload = {
            email,
            message,
            offensiveContent,
            timestamp: new Date().toISOString()
        };

        //Send the payload to Event Hub
        const batch = await producer.createBatch();
        batch.tryAdd({ body: streamPayload });
        await producer.sendBatch(batch);

         // Check for additional offensive content if initially flagged
         if (isOffensive) {
            // Fetch all related messages for the email based on the subject
            const relatedMessages = await getAllMessagesForEmail(email, subject);

            // Concatenate all related messages into a single message
            const combinedMessageContent = relatedMessages.map(msg => msg.message).join(',');
            console.log(combinedMessageContent)

            // Introduce a delay before sending the second request
            await new Promise(resolve => setTimeout(resolve, 60000)); // 30 seconds delay

            // Send the combined message content to OpenAI for further check
            const finalCheckResponse = await axios.post(
                process.env.azureopenaiurl, 
                {
                    model: "gpt-35-turbo",
                    messages: [
                        { role: "user", content: `Check this consolidated message for offensive content: "${combinedMessageContent}"` }
                    ]
                },
                { headers: { "Content-Type": "application/json", "api-key": API_KEY } }
            );

            const finalOffensiveContent = "" + finalCheckResponse.data?.choices[0]?.message?.content || "";
            console.log(finalOffensiveContent)

            // Send the final offensive result to another Event Hub
            const finalStreamPayload = {
                email,
                combinedMessageContent,
                finalOffensiveContent,
                timestamp: new Date().toISOString()
            };
            
            try {
                const finalBatch = await producer1.createBatch();
                
                const isAdded = finalBatch.tryAdd({ body: finalStreamPayload });
                if (!isAdded) {
                    console.error("Message was not added to the batch. It might be full.");
                    // Handle this case appropriately, possibly create a new batch
                }
                
                await producer1.sendBatch(finalBatch);
            } catch (error) {
                console.error("Error in batch processing:", error);
            }
        }

        // Respond to the client
        res.status(200).json({ success: true, isOffensive });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
});

app.post('/contact', (req, res) => {
    console.log(req.body)
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: process.env.smtpport,
        secure: true,
        auth: {
              user:process.env.smtpuser,
              pass: process.env.gmailpass,
        },
      });
      
        async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: `Contact mailing account: <taylorhelene09@gmail.com>`, // my address 
          to: "taylorhelene09@gmail.com", // list of receivers
          cc: req.body.email2, //we will cc sender here
          subject: req.body.subject2, // Subject line
          text: req.body.message2, // plain text body
          html: `<b>I am contacting you from your petsitting website.My name is ${req.body.name2}.  My email is ${req.body.email2}. ${req.body.message2}. <br></br>This message was delivered from petsitting contact form.</b>`, // html body
        });
      
        console.log("Message sent: %s", info);
       
      }
      
      main().catch(console.error);
    res.send(req.body);
});

// Route to post operation for petsitter
app.post('/petsitter', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'files', maxCount: 10 }
]), async (req, res, next) => {
    console.log(req.body, req.files);

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
        for (let file of req.files.files) {
            const result = await uploadToCloudinary(file.buffer);
            fileUrls.push(result.secure_url);
        }

        console.log('Image URL:', imageUrl);
        console.log('File URLs:', fileUrls);
    } catch (error) {
        console.error(error);
    }

    // Compare images using Azure Computer Vision
    const imagesToCompare = [imageUrl, ...fileUrls];
    const similarityResults = await compareImages(imagesToCompare);

    const similarityString = similarityResults
        .map(result => result.similarity)
        .join(', ');

    console.log(similarityString);

    // Save to the database
    try {
        // Send email and similarity results to Power BI streaming dataset
        await axios.post(process.env.powerbiurl1, [{
            email: req.body.email,
            similarityResults: similarityString,
        }], {
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        console.error('Database error or Power BI error:', err);
    }

    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const obj = {
        avatar: imageUrl,
        files: fileUrls,
        name: req.body.name,
        email: req.body.email,
        city: req.body.city,
        state: req.body.state,
        preference: req.body.location,
        password: hashedPassword,
    };

    Petsitter.create(obj)
        .then(item => {
            res.status(200).json({ message: 'success', item });

            // Schedule delayed analysis
            setTimeout(async () => {
                const detailedResults = [];

                for (const result of similarityResults) {
                    const similarityScore = parseFloat(result.similarity);

                    // Only analyze results with a similarity between 40% and 100%
                    if (similarityScore > 40 && similarityScore < 100) {
                        // Wait for 60 seconds before each analysis
                        await new Promise(resolve => setTimeout(resolve, 60000));

                        const prediction = await openAiPredictiveAnalysis({
                            image1: result.image1,
                            image2: result.image2,
                            similarity: result.similarity
                        });

                        // Add the detailed result to the list
                        detailedResults.push({
                            image1: result.image1,
                            image2: result.image2,
                            similarity: result.similarity,
                            result: prediction || "No prediction available"
                        });
                    }
                }

                // Save analysis results in MongoDB
                await Petsitter.updateOne(
                    { email: req.body.email },
                    { $set: { similarityAnalysis: detailedResults } }
                );

                console.log("Detailed analysis saved to MongoDB:", detailedResults);
            }, 1000);  
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
        });
});

// Function to analyze similarity using OpenAI API
async function openAiPredictiveAnalysis({ image1, image2, similarity }) {
    const apiUrl = process.env.azureopenaiurl;
    try {
        const response = await axios.post(apiUrl, {
            model: "gpt-35-turbo",
            messages: [
                { role: "user", content: `Given a similarity score of ${similarity} between two images, is it likely these images are of the same person or similar items?` }
            ]
        }, {
            headers: {
                "Content-Type": "application/json",
                "api-key": API_KEY,
            }
        });
        const data = response.data;
        console.log(data);
        return data?.choices[0]?.message?.content;
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        return null;
    }
}


// Route to post owner details
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
      } catch (error) {
        console.log(error)
      }

       // Compare images using Azure Computer Vision
       const imagesToCompare = [imageUrl, ...fileUrls];  // All image URLs
       const similarityResults = await compareImages(imagesToCompare);
       // Map over the results to extract the similarity values and join them into a single string
        const similarityString = similarityResults
        .map(result => result.similarity)
        .join(', ');

        console.log(similarityString);
    // Save to the database
    try {
        // Send email and similarity results to Power BI
        const powerBIResponse = await axios.post(powerbiurl2, [{
            email: req.body.email,
            similarityResults: similarityString,
        }], {
            headers: { "Content-Type": "application/json" }
        });

        console.log('Power BI response:', powerBIResponse);


    } catch (err) {
        console.error('Database error or Power BI error:', err);
    }
     // Hash the password with bcrypt (optional, if you are also doing client-side hashing)
     const hashedPassword = await bcrypt.hash(req.body.password, salt); // 10 is the salt rounds
   
    const obj = {
        avatar: imageUrl,
        files: fileUrls,  // Store array of file URLs
        name: req.body.name,
        email: req.body.email,
        city: req.body.city,
        state: req.body.state,
        preference: req.body.location,
        password: hashedPassword,  // Handle password securely
    };
        Owner.create(obj)
        .then(item => {
            res.status(200).json({ message: 'Success', item });

            // Schedule delayed analysis
            setTimeout(async () => {
                const detailedResults = [];

                for (const result of similarityResults) {
                    const similarityScore = parseFloat(result.similarity);

                    // Only analyze results with a similarity between 40% and 100%
                    if (similarityScore > 40 && similarityScore < 100) {
                        // Wait for 60 seconds before each analysis
                        await new Promise(resolve => setTimeout(resolve, 60000));

                        const prediction = await openAiPredictiveAnalysis({
                            image1: result.image1,
                            image2: result.image2,
                            similarity: result.similarity
                        });

                        // Add the detailed result to the list
                        detailedResults.push({
                            image1: result.image1,
                            image2: result.image2,
                            similarity: result.similarity,
                            result: prediction || "No prediction available"
                        });
                    }
                }

                // Save analysis results in MongoDB
                await Owner.updateOne(
                    { email: req.body.email },
                    { $set: { similarityAnalysis: detailedResults } }
                );

                console.log("Detailed analysis saved to MongoDB:", detailedResults);
            }, 1000);  
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Database error' });
        });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body; // No role in the request body

    try {
        // Search in both Petsitter and Owner collections
        let user = await Petsitter.findOne({ email });
        let role = 'petsitter';

        if (!user) {
            user = await Owner.findOne({ email });
            role = 'owner';
        }

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log(passwordMatch)

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        // Return full user details with role (petsitter or owner)
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: role,
                avatar: user.avatar,
                files: user.files, // Include files in the response
                city: user.city,
                state: user.state,
                preference: user.preference,
                similarityAnalysis: user.similarityAnalysis
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/owners', async (req, res) => {
    try {
        const owners = await Owner.find({});
        
        // URL for Power BI streaming dataset
        const powerBIUrl = process.env.powerbiurl3;
        
        // Format the data for Power BI
        const data = owners.map(owner => ({
            name: owner.name,
            email: owner.email,
            city:owner.city,
            state: owner.state,
            preference: owner.preference,
        }));

        // Send data to Power BI
        await axios.post(powerBIUrl, { rows: data });
        console.log("success")

                
    } catch (error) {
        console.error(error);
    }
    try {
        const owners = await Owner.find({});
        res.status(200).json(owners);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});






app.get('/petsitters', async (req, res) => {
    try {
        const petsitters = await Petsitter.find({});
        
        // URL for Power BI streaming dataset
        const powerBIUrl =process.env.powerbiurl4;
        
        // Format the data for Power BI
        const data = petsitters.map(petsitter => ({
            name: petsitter.name,
            email: petsitter.email,
            city: petsitter.city,
            state: petsitter.state,
            preference: petsitter.preference,
        }));

        // Send data to Power BI
        await axios.post(powerBIUrl, { rows: data });
        console.log("success")

        
    } catch (error) {
        console.error(error);
    }

    try {
        const Petsitters = await Petsitter.find({});
        res.status(200).json(Petsitters);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.get('/updatePetsitters', async (req, res) => {
    try {
        const petsitters = await Petsitter.find({});
        
        // URL for Power BI streaming dataset
        const powerBIUrl = process.env.powerbi;
        
        // Format the data for Power BI
        const data = petsitters.map(petsitter => ({
            name: petsitter.name,
            email: petsitter.email,
            city: petsitter.city,
            state: petsitter.state,
            preference: petsitter.preference,
        }));

        // Send data to Power BI
        await axios.post(powerBIUrl, { rows: data });
        
        res.status(200).json({ message: 'Data sent to Power BI successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// adding messages code

// Add a new message as owner
app.post('/owner/add-message', async (req, res) => {
    const { sender, receiver, message } = req.body;

    try {
        const owner = await Owner.findOne({ email: sender });

        if (!owner) {
            return res.status(404).json({ success: false, message: 'Receiver not found' });
        }

        owner.messages.push({ sender, receiver, message });
        await owner.save();

        res.status(200).json({ success: true, message: 'Message added', owner });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Add a new message from petsitter to owner
app.post('/owner/add-messagefromsitter', async (req, res) => {
    const { sender, receiver, message } = req.body;

    try {
        const owner = await Owner.findOne({ email: receiver });

        if (!owner) {
            return res.status(404).json({ success: false, message: 'Receiver not found' });
        }

        owner.messages.push({ sender, receiver, message });
        await owner.save();

        res.status(200).json({ success: true, message: 'Message added', owner });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get all messages for an owner with receiver's avatar and name, grouped by receiver
app.get('/owner/get-messages/:email', async (req, res) => {
    const { email } = req.params;

    try {
        // Find the owner by email
        const owner = await Owner.findOne({ email });

        if (!owner) {
            return res.status(404).json({ success: false, message: 'Owner not found' });
        }

        // Object to group messages by the other participant (receiver/sender)
        const groupedMessages = {};

        // Find all messages where the owner is the sender or the receiver
        const allMessages = owner.messages.filter(msg => msg.sender === email || msg.receiver === email);

        // Loop through each message and organize them by the other participant
        for (const msg of allMessages) {
            // Determine who the other participant is (the receiver if owner is sender, or the sender if owner is receiver)
            const otherParticipantEmail = msg.sender === email ? msg.receiver : msg.sender;

            // Fetch the other participant's details (name and avatar) from the `Petsitter` collection
            const otherParticipantDetails = await Petsitter.findOne({ email: otherParticipantEmail }, 'name avatar');

            const otherParticipantName = otherParticipantDetails ? otherParticipantDetails.name : 'Unknown';
            const otherParticipantAvatar = otherParticipantDetails ? otherParticipantDetails.avatar : null;

            // Check if the participant already has messages grouped, if not, create a new group
            if (!groupedMessages[otherParticipantEmail]) {
                groupedMessages[otherParticipantEmail] = {
                    participantEmail: otherParticipantEmail,
                    participantName: otherParticipantName,
                    participantAvatar: otherParticipantAvatar,
                    messages: []  // Create an array to hold all messages from this participant
                };
            }

            // Add the message to the appropriate participant's group
            groupedMessages[otherParticipantEmail].messages.push({
                sender: msg.sender,
                receiver: msg.receiver,
                message: msg.message,
                timestamp: msg.timestamp
            });
        }

        // Convert the groupedMessages object to an array
        const groupedMessagesArray = Object.values(groupedMessages);

        // Return the grouped messages with participant details
        res.status(200).json({ success: true, groupedMessages: groupedMessagesArray });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});


// Add a new message to petsitter
app.post('/petsitter/add-message', async (req, res) => {
    const { sender, receiver, message } = req.body;

    try {
        const petsitter = await Petsitter.findOne({ email: sender });

        if (!petsitter) {
            return res.status(404).json({ success: false, message: 'Receiver not found' });
        }

        petsitter.messages.push({ sender, receiver, message });
        await petsitter.save();

        res.status(200).json({ success: true, message: 'Message added', petsitter });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Add a new message from owner to petsitter
app.post('/petsitter/add-messagefromowner', async (req, res) => {
    const { sender, receiver, message } = req.body;
    try {
        const petsitter = await Petsitter.findOne({ email: receiver });

        if (!petsitter) {
            return res.status(404).json({ success: false, message: 'PETSITTER not found' });
        }

        petsitter.messages.push({ sender, receiver, message });
        await petsitter.save();

        res.status(200).json({ success: true, message: 'Message added', petsitter });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get all messages for a petsitter
app.get('/petsitter/get-messages/:email', async (req, res) => {
    const { email } = req.params;
     try {
        // Find the petsitter by email
        const petsitter = await Petsitter.findOne({ email });

        if (!petsitter) {
            return res.status(404).json({ success: false, message: 'Petsitter not found' });
        }

        // Object to group messages by the other participant (receiver/sender)
        const groupedMessages = {};

        // Find all messages where the petsitter is the sender or the receiver
        const allMessages = petsitter.messages.filter(msg => msg.sender === email || msg.receiver === email);

        // Loop through each message and organize them by the other participant
        for (const msg of allMessages) {
            // Determine who the other participant is (the receiver if petsitter is sender, or the sender if petsitter is receiver)
            const otherParticipantEmail = msg.sender === email ? msg.receiver : msg.sender;

            // Fetch the other participant's details (name and avatar) from the `Petsitter` collection
            const otherParticipantDetails = await Owner.findOne({ email: otherParticipantEmail }, 'name avatar');

            const otherParticipantName = otherParticipantDetails ? otherParticipantDetails.name : 'Unknown';
            const otherParticipantAvatar = otherParticipantDetails ? otherParticipantDetails.avatar : null;

            // Check if the participant already has messages grouped, if not, create a new group
            if (!groupedMessages[otherParticipantEmail]) {
                groupedMessages[otherParticipantEmail] = {
                    participantEmail: otherParticipantEmail,
                    participantName: otherParticipantName,
                    participantAvatar: otherParticipantAvatar,
                    messages: []  // Create an array to hold all messages from this participant
                };
            }

            // Add the message to the appropriate participant's group
            groupedMessages[otherParticipantEmail].messages.push({
                sender: msg.sender,
                receiver: msg.receiver,
                message: msg.message,
                timestamp: msg.timestamp
            });
        }

        // Convert the groupedMessages object to an array
        const groupedMessagesArray = Object.values(groupedMessages);

        // Return the grouped messages with participant details
        res.status(200).json({ success: true, groupedMessages: groupedMessagesArray });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});


// Start the server
const port = process.env.PORT || 5000;
app.listen(port, err => {
    if (err) throw err;
    console.log(`Server listening on port ${port}`);
});

