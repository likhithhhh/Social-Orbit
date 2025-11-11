const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  textContent: { type: String }, // [cite: 40]
  imageUrl: { type: String }, // [cite: 40]
  // Rule: either text or image is enough [cite: 42]
  likes: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Stores who liked it [cite: 48]
  ],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      username: { type: String, required: true }, // Store username for easy display
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);