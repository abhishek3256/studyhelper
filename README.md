# StudyHelper

StudyHelper is a comprehensive educational platform designed to streamline student learning and career preparation. It integrates AI capabilities to provide personalized academic assistance, along with tools for organizing study materials and tracking progress.

## Table of Contents

- Features
- Tech Stack
- Prerequisites
- Installation
- Configuration
- Running the Application
- Project Structure

## Features

- **AI Chatbot**: An intelligent conversational interface powered by Gemini and Groq APIs for instant academic support and doubt resolution.
- **Syllabus Manager**: Tools to organize and track syllabus progress effectively.
- **Notes System**: A dedicated section for creating and managing study notes.
- **Student Dashboard**: A personalized dashboard to visualize progress and access quick links.
- **Authentication**: Secure user authentication system using JWT.
- **Responsive Design**: Modern, responsive user interface with dark mode support.

## Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **AI Integration**: Google Gemini API, Groq API

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (Node Package Manager)
- MongoDB (Local or Atlas coonection string)

## Installation

1. Clone the repository:
   git clone <repository-url>
   cd studyhelper

2. Install dependencies for the root, server, and client:
   npm run install-all

   Alternatively, you can install them manually:
   # Root
   npm install

   # Server
   cd server
   npm install

   # Client
   cd client
   npm install

## Configuration

You need to set up environment variables for both the server and client.

### Server Configuration
Create a .env file in the server directory and add the following variables:
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key

### Client Configuration
Create a .env file in the client directory and add the following variables:
VITE_API_URL=http://localhost:5000

## Running the Application

To run the entire application (both server and client) concurrently:

npm run dev

This command will start:
- The backend server on http://localhost:5000
- The frontend client on http://localhost:5173

To run them separately:

# Server
cd server
npm start

# Client
cd client
npm run dev

## Project Structure

- **client/**: Contains the React frontend application.
  - **src/components/**: Reusable UI components (Chatbot, Dashboard, Notes, etc.).
  - **src/context/**: React context for state management.
  - **src/pages/**: Application pages.
- **server/**: Contains the Node.js backend application.
  - **controllers/**: Request handlers for API endpoints.
  - **models/**: Mongoose schemas for MongoDB.
  - **routes/**: API route definitions.
  - **middleware/**: Custom middleware functions.
