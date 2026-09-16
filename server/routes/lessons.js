const express = require('express');
const router = express.Router();
const { Lesson, Course, Progress } = require('../models/repo');
const { requireAuth, requireRole } = require('../middleware/auth');

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  requireAuth(req, res, next);
};

// @route   GET /api/lessons/:id
// @desc    Get single lesson with both full and simplified texts, next/prev pointers, and progress status
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).lean();
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found.' });
    }

    const course = await Course.findById(lesson.courseId).select('title level category').lean();

    // Fetch sibling lessons in the same course for navigation
    const allCourseLessons = await Lesson.find({ courseId: lesson.courseId })
      .sort({ order: 1 })
      .select('_id title order durationMinutes')
      .lean();

    const currentIndex = allCourseLessons.findIndex((l) => l._id.toString() === lesson._id.toString());
    const prevLesson = currentIndex > 0 ? allCourseLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < allCourseLessons.length - 1 ? allCourseLessons[currentIndex + 1] : null;

    // Check user progress
    let isCompleted = false;
    let quizScore = 80;
    if (req.user) {
      const progress = await Progress.findOne({ userId: req.user._id, lessonId: lesson._id }).lean();
      if (progress) {
        isCompleted = progress.completed;
        quizScore = progress.quizScore;
        // Update lastAccessedAt
        await Progress.findByIdAndUpdate(progress._id, { $set: { lastAccessedAt: new Date() } });
      } else {
        // Create initial progress marker
        await Progress.create({
          userId: req.user._id,
          courseId: lesson.courseId,
          lessonId: lesson._id,
          completed: false,
          lastAccessedAt: new Date()
        });
      }
    }

    res.json({
      success: true,
      lesson: {
        ...lesson,
        course,
        isCompleted,
        quizScore,
        prevLesson: prevLesson ? { id: prevLesson._id, title: prevLesson.title, order: prevLesson.order } : null,
        nextLesson: nextLesson ? { id: nextLesson._id, title: nextLesson.title, order: nextLesson.order } : null,
        courseOutline: allCourseLessons
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lesson.',
      error: error.message
    });
  }
});

// @route   POST /api/lessons
// @desc    Create a new lesson with both standard and simplified content (Teacher/Admin only)
router.post('/', requireAuth, requireRole('teacher'), async (req, res) => {
  try {
    const {
      courseId,
      title,
      fullText,
      simplifiedText,
      summary,
      durationMinutes = 5,
      keyTakeaways = []
    } = req.body;

    if (!courseId || !title || !fullText || !simplifiedText) {
      return res.status(400).json({
        success: false,
        message: 'courseId, title, fullText, and simplifiedText are required.'
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Target course not found.' });
    }

    // Determine the next order index
    const count = await Lesson.countDocuments({ courseId });
    const order = req.body.order || count + 1;

    const lesson = new Lesson({
      courseId,
      title,
      order,
      summary: summary || title,
      fullText,
      simplifiedText,
      durationMinutes,
      keyTakeaways: Array.isArray(keyTakeaways) ? keyTakeaways : [keyTakeaways].filter(Boolean)
    });

    await lesson.save();

    // Increment course lesson counter
    await Course.findByIdAndUpdate(courseId, { $inc: { totalLessons: 1 } });

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully with dual language support.',
      lesson
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create lesson.',
      error: error.message
    });
  }
});

// @route   PUT /api/lessons/:id
// @desc    Update lesson content (both full & simplified)
router.put('/:id', requireAuth, requireRole('teacher'), async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found.' });
    }

    res.json({
      success: true,
      message: 'Lesson updated successfully.',
      lesson
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update lesson.',
      error: error.message
    });
  }
});

module.exports = router;
