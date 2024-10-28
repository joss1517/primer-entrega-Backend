const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  size: String,
  price: Number,
  stock: Number,
  code: String,
  availability: Boolean,
});

productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Product', productSchema);
