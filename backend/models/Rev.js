const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const RevSchema = new Schema({
  Text: { type: String, required: true , unique: true},
});

RevSchema.plugin(uniqueValidator);
module.exports =mongoose.model('Rev',RevSchema);