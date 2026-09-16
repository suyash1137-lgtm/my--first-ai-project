const express = require('express');
const router = express.Router();
const { Course, Lesson, Progress } = require('../models/repo');
const { requireAuth, requireRole } = require('../middleware/auth');

// Optional auth helper middleware for public listings that still personalize if token present
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  requireAuth(req, res, next);
};

// @route   GET /api/courses
// @desc    Get all courses, with personalized progress if user is logged in
router.get('/', optionalAuth, async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 }).lean();

    // If user is authenticated, compute real progress for each course
    let coursesWithProgress = courses;
    if (req.user) {
      const userProgress = await Progress.find({ userId: req.user._id, completed: true }).lean();
      const completedLessonSet = new Set(userProgress.map((p) => p.lessonId.toString()));

      // Fetch all lessons grouped by course
      const allLessons = await Lesson.find().sort({ order: 1 }).select('_id courseId order title').lean();
      const courseLessonsMap = {};
      for (const lesson of allLessons) {
        const cId = lesson.courseId.toString();
        if (!courseLessonsMap[cId]) courseLessonsMap[cId] = [];
        courseLessonsMap[cId].push(lesson);
      }

      coursesWithProgress = courses.map((course) => {
        const cId = course._id.toString();
        const lessons = courseLessonsMap[cId] || [];
        const total = lessons.length;
        const completedCount = lessons.filter((l) => completedLessonSet.has(l._id.toString())).length;
        const progressPercentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

        // Determine next uncompleted lesson
        const nextLesson = lessons.find((l) => !completedLessonSet.has(l._id.toString())) || lessons[0] || null;

        return {
          ...course,
          totalLessons: total,
          completedLessons: completedCount,
          progressPercentage,
          nextLessonId: nextLesson ? nextLesson._id : null,
          nextLessonTitle: nextLesson ? nextLesson.title : null
        };
      });
    }

    res.json({
      success: true,
      count: coursesWithProgress.length,
      courses: coursesWithProgress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses.',
      error: error.message
    });
  }
});

// @route   GET /api/courses/:id
// @desc    Get single course with its ordered lessons
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).lean();
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    const lessons = await Lesson.find({ courseId: course._id }).sort({ order: 1 }).lean();

    let userProgressMap = {};
    if (req.user) {
      const progressList = await Progress.find({ userId: req.user._id, courseId: course._id }).lean();
      for (const p of progressList) {
        userProgressMap[p.lessonId.toString()] = p.completed;
      }
    }

    const lessonsWithStatus = lessons.map((l) => ({
      ...l,
      isCompleted: !!userProgressMap[l._id.toString()]
    }));

    const total = lessons.length;
    const completedCount = lessonsWithStatus.filter((l) => l.isCompleted).length;
    const progressPercentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

    res.json({
      success: true,
      course: {
        ...course,
        totalLessons: total,
        completedLessons: completedCount,
        progressPercentage,
        lessons: lessonsWithStatus
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course details.',
      error: error.message
    });
  }
});

// @route   POST /api/courses
// @desc    Create new course (Teacher/Admin only)
router.post('/', requireAuth, requireRole('teacher'), async (req, res) => {
  try {
    const { title, description, category, level, thumbnail, estimatedHours } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide course title and description.'
      });
    }

    const course = new Course({
      title,
      description,
      category: category || 'General Education',
      level: level || 'Beginner',
      thumbnail: thumbnail || '',
      estimatedHours: estimatedHours || 2,
      createdById: req.user._id
    });

    await course.save();

    res.status(201).json({
      success: true,
      message: 'Course created successfully.',
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create course.',
      error: error.message
    });
  }
});

module.exports = router;
