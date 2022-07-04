const { default: mongoose } = require('mongoose');

const imageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  itemId: {
    type: String,
    ref: 'Item',
  }
});

module.exports = mongoose.model('Image', imageSchema);