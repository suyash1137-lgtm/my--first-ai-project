const mongoose = require('mongoose');

let isMemoryMode = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/saral_shiksha';

  try {
    console.log(`Checking MongoDB connection to: ${uri.replace(/:([^:@]{1,})@/, ':****@')}`);
    
    // Attempt connection with short timeout so server boots instantly if offline
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000
    });

    console.log('Successfully connected to live MongoDB.');
    isMemoryMode = false;
    return { isMemory: false };
  } catch (error) {
    console.warn('\n=============================================================');
    console.warn(' NOTICE: No external MongoDB server detected on port 27017.');
    console.warn(' Running in Zero-Config In-Memory Mode with full seed data!');
    console.warn(' (To use persistent MongoDB, set MONGODB_URI in server/.env)');
    console.warn('=============================================================\n');
    isMemoryMode = true;
    return { isMemory: true };
  }
};

const disconnectDB = async () => {
  try {
    if (!isMemoryMode) {
      await mongoose.disconnect();
    }
  } catch (error) {
    console.error('Error disconnecting MongoDB:', error.message);
  }
};

module.exports = { connectDB, disconnectDB, getIsMemoryMode: () => isMemoryMode };
