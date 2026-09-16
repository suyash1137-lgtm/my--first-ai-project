const express = require('express');
const router = express.Router();
const { AccessibilityProfile } = require('../models/repo');
const { requireAuth } = require('../middleware/auth');

// @route   GET /api/profile
// @desc    Get current user accessibility profile
router.get('/', requireAuth, async (req, res) => {
  try {
    let profile = await AccessibilityProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = await AccessibilityProfile.create({
        userId: req.user._id
      });
    }

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve accessibility profile.',
      error: error.message
    });
  }
});

// @route   PUT /api/profile
// @desc    Update accessibility profile settings
router.put('/', requireAuth, async (req, res) => {
  try {
    const allowedFields = [
      'profileType',
      'fontSize',
      'contrast',
      'ttsSpeed',
      'ttsVoice',
      'ttsAutoPlay',
      'captionsEnabled',
      'simplifyLanguage',
      'focusMode',
      'soundEffects',
      'screenReaderOptimized'
    ];

    const updates = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const profile = await AccessibilityProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Accessibility settings saved.',
      profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update accessibility profile.',
      error: error.message
    });
  }
});

module.exports = router;
