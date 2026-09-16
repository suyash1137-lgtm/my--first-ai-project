const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Course description is required']
    },
    category: {
      type: String,
      default: 'General Education'
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    },
    thumbnail: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'book'
    },
    createdById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    totalLessons: {
      type: Number,
      default: 0
    },
    estimatedHours: {
      type: Number,
      default: 2
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
