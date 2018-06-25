var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Create the schema
var NoteSchema = new Schema({
  body: {
    type: String
  }
});

// Create the Note model with the NoteSchema
var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;
