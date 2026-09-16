const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true
    },
    order: {
      type: Number,
      required: true,
      default: 1
    },
    summary: {
      type: String,
      default: ''
    },
    fullText: {
      type: String,
      required: [true, 'Full lesson text is required']
    },
    simplifiedText: {
      type: String,
      required: [true, 'Simplified lesson text is required']
    },
    durationMinutes: {
      type: Number,
      default: 5
    },
    keyTakeaways: [
      {
        type: String
      }
    ]
  },
  { timestamps: true }
);

// Compound index for course and order
lessonSchema.index({ courseId: 1, order: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);
