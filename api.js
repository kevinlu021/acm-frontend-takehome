const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true
  },
  organization: {
    type: String,
    required: true
  },
  committee: {
    type: String,
    required: true
  },
  thumbnail: String,
  cover: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  eventLink: {
    type: String,
    required: true
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  pointValue: {
    type: Number,
    required: true
  },
  requiresStaff: {
    type: Boolean,
    required: true
  },
  staffPointBonus: {
    type: Number,
    required: true
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;

