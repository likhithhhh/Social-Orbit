const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  textContent: { type: String },
  imageUrl: { type: String }, 
  likes: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
  ],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      username: { type: String, required: true }, 
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);