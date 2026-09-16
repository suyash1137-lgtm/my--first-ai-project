const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User, AccessibilityProfile } = require('../models/repo');
const { requireAuth, JWT_SECRET } = require('../middleware/auth');

// Helper to construct profile defaults based on disability / preference archetype
const getProfilePreset = (profileType) => {
  switch (profileType) {
    case 'visual':
      return {
        profileType: 'visual',
        contrast: 'high-contrast',
        fontSize: 'large',
        ttsSpeed: 1.0,
        ttsAutoPlay: true,
        captionsEnabled: true,
        simplifyLanguage: false,
        focusMode: false,
        screenReaderOptimized: true
      };
    case 'hearing':
      return {
        profileType: 'hearing',
        contrast: 'standard',
        fontSize: 'normal',
        ttsSpeed: 1.0,
        ttsAutoPlay: false,
        captionsEnabled: true,
        soundEffects: false,
        simplifyLanguage: false,
        focusMode: false
      };
    case 'cognitive':
      return {
        profileType: 'cognitive',
        contrast: 'dyslexia-friendly',
        fontSize: 'large',
        ttsSpeed: 0.9,
        ttsAutoPlay: false,
        captionsEnabled: true,
        simplifyLanguage: true,
        focusMode: true,
        soundEffects: true
      };
    default:
      return {
        profileType: 'general',
        contrast: 'standard',
        fontSize: 'normal',
        ttsSpeed: 1.0,
        ttsAutoPlay: false,
        captionsEnabled: false,
        simplifyLanguage: false,
        focusMode: false
      };
  }
};

// @route   POST /api/auth/register
// @desc    Register a new student or teacher
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'student', profileType = 'general' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    // Create user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: ['student', 'teacher'].includes(role) ? role : 'student',
      onboardingCompleted: profileType !== 'general'
    });
    await user.save();

    // Create associated accessibility profile
    const profileDefaults = getProfilePreset(profileType);
    const profile = new AccessibilityProfile({
      userId: user._id,
      ...profileDefaults
    });
    await profile.save();

    // Link profile to user
    user.accessibilityProfile = profile._id;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        onboardingCompleted: user.onboardingCompleted
      },
      profile
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration.',
      error: error.message
    });
  }
});

// @route   POST /api/auth/login
// @desc    Log in an existing user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).populate('accessibilityProfile');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    user.lastLogin = new Date();
    await user.save();

    // Ensure accessibility profile exists
    let profile = user.accessibilityProfile;
    if (!profile) {
      profile = await AccessibilityProfile.create({
        userId: user._id,
        ...getProfilePreset('general')
      });
      user.accessibilityProfile = profile._id;
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        onboardingCompleted: user.onboardingCompleted
      },
      profile
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login.',
      error: error.message
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get currently logged in user info and accessibility profile
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('accessibilityProfile');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        onboardingCompleted: user.onboardingCompleted
      },
      profile: user.accessibilityProfile
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching user.', error: error.message });
  }
});

// @route   POST /api/auth/onboarding
// @desc    Save initial accessibility profile for first login
router.post('/onboarding', requireAuth, async (req, res) => {
  try {
    const { profileType, customSettings } = req.body;

    const basePreset = getProfilePreset(profileType || 'general');
    const updateData = {
      ...basePreset,
      ...(customSettings || {})
    };

    let profile = await AccessibilityProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updateData },
      { new: true, upsert: true }
    );

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          onboardingCompleted: true,
          accessibilityProfile: profile._id
        }
      },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Accessibility profile saved successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        onboardingCompleted: user.onboardingCompleted
      },
      profile
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to save onboarding profile.', error: error.message });
  }
});

module.exports = router;
