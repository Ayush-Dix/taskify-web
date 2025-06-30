import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // Set mongoose options for better connection handling
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        const conn = await mongoose.connect(process.env.MONGODB_URI, options);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error.message);

        // Don't exit process in development, just log error
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
};

export default connectDB;
