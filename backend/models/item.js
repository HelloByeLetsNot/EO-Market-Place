const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    trade: { type: Boolean, default: false }
});

module.exports = mongoose.model('Item', ItemSchema);