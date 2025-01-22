const mongoose = require('mongoose');
// Creating a new schema for storing movie booking details.
const TicketSchema = new mongoose.Schema({
  movie: { type: String },
  slot: { type: String },
  seats: {
    A1: { type: Number },
    A2: { type: Number },
    A3: { type: Number },
    A4: { type: Number },
    D1: { type: Number },
    D2: { type: Number },
  },
});


const  signupSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  mobile: { type: Number },
  address: { type: String },
  city: { type: String },
  state: { type: String },
});

// Registering the schema with the Mongoose model.
const Ticket = mongoose.model('bookmovietickets', TicketSchema);
const Signup = mongoose.model('signup', signupSchema);

module.exports = {
    Ticket,
    Signup

}
