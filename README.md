# Petsitting website

## Mission

We provide a medium for pet owners and sitters to communicate and provide pet sitting services.
Our in website messaging will help pet owners and sitters communicate. All users should provide images of available pet foods and proof of pets being taken care of before an arrangement in order to ensure trust. 

Website is designed to enhance the safety and reliability of a pet-sitting service platform by incorporating offensive content detection, image similarity analysis, and data reporting. The backend integrates Azure OpenAI, Azure Event Hubs, and Microsoft Fabric to automate the analysis of user messages and images and generate visual reports based on detected issues. The reports are accessible via Microsoft Fabric, which provides a dashboard view of potentially harmful content and similarity analysis results.

## Key Features

- OpenAI Offensive Content Check: Uses OpenAI's GPT model to identify offensive language in user messages.
Image Similarity Analysis: Detects the similarity between uploaded images to check for potential duplicates or related images.
- Event Hub Integration: Sends offensive content analysis and image similarity results to Azure Event Hubs.
- Microsoft Fabric Reporting: Streams data to Microsoft Fabric for visualization and reporting, allowing administrators to monitor flagged content and similarity results.

## Installation
- Clone the repository.
-Install dependencies using:

npm install

## Project Structure

/api/send-complaint
This endpoint:
Sends Messages to OpenAI: Detects offensive content within user-submitted messages.
Event Hub Streaming: Sends flagged messages to an Event Hub stream, which forwards the data to Microsoft Fabric.
Additional Content Checks: If offensive content is detected, it retrieves other messages associated with the user for further analysis.
Stream to Fabric: Sends final offensive results to Microsoft Fabric for reporting and analytics.

/contact
Handles user inquiries, sending an email through a configured SMTP service. It does not involve analysis or Event Hub streaming.

/petsitter and /owner
These endpoints:
Image Upload & Processing: Uploads single or multiple images to Cloudinary for storage.
Image Similarity Analysis: Compares uploaded images, using Azure AI, to calculate similarity scores. Results above 50% similarity but below 100% are flagged for further analysis.
Event Hub & Microsoft Fabric Integration: Streams the similarity results to Microsoft Fabric, where administrators can monitor image similarity reports for compliance.
openAiPredictiveAnalysis
A helper function that:

Uses OpenAI to perform additional predictive analysis on image similarity scores, providing insights on whether similar images are of the same individual or related items.
The results are saved in MongoDB for each user, associating the analysis results with the user’s data.
Microsoft Fabric & Event Hubs Integration
The code uses Azure Event Hubs as a data streaming intermediary to send analyzed data to Microsoft Fabric. Event Hub captures the streaming data (offensive message flags, similarity analysis results) and sends it to a Microsoft Fabric dataset. The setup allows for real-time data integration, making it possible to view up-to-date information and flagged results within Fabric's reporting dashboard.

Data Flow & Reporting
User Submits Complaint or Images: A user complaint triggers an offensive content check, while image uploads trigger a similarity analysis.
Data Sent to Event Hubs: Offensive message content or similarity results are packaged as JSON and sent to Azure Event Hubs.
Streaming to Fabric: Event Hubs routes the JSON data to Fabric, where it is visualized for real-time monitoring.
Fabric Dashboard: Provides insights based on offensive content and image similarity checks, enabling administrators to proactively manage content.
Example Event Hub Data Structure:

{
  "email": "user@example.com",
  "message": "Flagged message content",
  "offensiveContent": "Detected offensive terms",
  "timestamp": "2023-12-10T10:00:00Z"
}

The information sent to Microsoft Fabric will display flagged terms, similarity scores, and images, creating a comprehensive dashboard for monitoring platform compliance and user interactions.

Setup & Requirements
Azure OpenAI API Key: Ensure you have access to Azure OpenAI for offensive content and similarity analysis.
Event Hubs Connection Strings: Configure connection strings for Event Hub integration.
Microsoft Fabric Account: For dashboard access, set up a Fabric account and datasets.

## Environmental Variables

Configure sensitive information such as:


API_KEY="Your_OpenAI_API_Key"
EVENT_HUB_CONNECTION_STRING="Your_Event_Hub_Connection_String"
FABRIC_DATASET_KEY="Your_Microsoft_Fabric_Dataset_Key"

## Running the Server

node Server.js


## License
This project is licensed under the MIT License. See the LICENSE file for details.