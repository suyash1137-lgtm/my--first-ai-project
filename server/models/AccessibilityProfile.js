const mongoose = require('mongoose');

const accessibilityProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    profileType: {
      type: String,
      enum: ['visual', 'hearing', 'cognitive', 'general'],
      default: 'general'
    },
    fontSize: {
      type: String,
      enum: ['normal', 'large', 'xlarge'],
      default: 'normal'
    },
    contrast: {
      type: String,
      enum: ['standard', 'high-contrast', 'dyslexia-friendly', 'dark'],
      default: 'standard'
    },
    ttsSpeed: {
      type: Number,
      default: 1.0,
      min: 0.5,
      max: 2.0
    },
    ttsVoice: {
      type: String,
      default: 'default'
    },
    ttsAutoPlay: {
      type: Boolean,
      default: false
    },
    captionsEnabled: {
      type: Boolean,
      default: false
    },
    simplifyLanguage: {
      type: Boolean,
      default: false
    },
    focusMode: {
      type: Boolean,
      default: false
    },
    soundEffects: {
      type: Boolean,
      default: true
    },
    screenReaderOptimized: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('AccessibilityProfile', accessibilityProfileSchema);
