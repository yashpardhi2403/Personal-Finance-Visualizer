import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env.local');
  console.error('Please create a .env.local file with your MongoDB connection string:');
  console.error('MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority');
  throw new Error('MongoDB URI not configured');
}

// Only connect if not already connected
if (mongoose.connection.readyState === 0) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err.message);
      console.error('Please check your MongoDB URI and network connection');
      throw err;
    });
}

export default mongoose;
