const mongoose = require('mongoose');

/**
 * Connect to MongoDB
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/forma_ai', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        
        return conn;
    } catch (error) {
        console.error(`❌ MongoDB Error: ${error.message}`);
        process.exit(1);
    }
};

/**
 * Disconnect from MongoDB
 */
const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('✅ MongoDB Disconnected');
    } catch (error) {
        console.error('❌ Error disconnecting:', error);
    }
};

module.exports = { connectDB, disconnectDB };
