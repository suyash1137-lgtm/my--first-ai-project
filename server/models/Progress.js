const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now
    },
    attendancePct: {
      type: Number,
      default: 90,
      min: 0,
      max: 100
    },
    quizScore: {
      type: Number,
      default: 80,
      min: 0,
      max: 100
    },
    timeSpentSeconds: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Unique index to ensure one progress entry per user per lesson
progressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });
progressSchema.index({ userId: 1, courseId: 1 });

module.exports = mongoose.model('Progress', progressSchema);
