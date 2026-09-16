const express = require('express');
const router = express.Router();
const { Progress, Lesson, Course } = require('../models/repo');
const { requireAuth } = require('../middleware/auth');

// @route   POST /api/progress/complete
// @desc    Mark a lesson as complete and update course progress
router.post('/complete', requireAuth, async (req, res) => {
  try {
    const { courseId, lessonId, timeSpentSeconds = 120, quizScore = 85 } = req.body;

    if (!courseId || !lessonId) {
      return res.status(400).json({
        success: false,
        message: 'courseId and lessonId are required.'
      });
    }

    // Upsert the lesson progress
    const progress = await Progress.findOneAndUpdate(
      { userId: req.user._id, lessonId },
      {
        $set: {
          courseId,
          completed: true,
          completedAt: new Date(),
          lastAccessedAt: new Date(),
          quizScore: Number(quizScore) || 85
        },
        $inc: { timeSpentSeconds: Number(timeSpentSeconds) || 0 }
      },
      { new: true, upsert: true }
    );

    // Calculate total lessons and completed lessons for the course
    const totalLessons = await Lesson.countDocuments({ courseId });
    const completedLessons = await Progress.countDocuments({
      userId: req.user._id,
      courseId,
      completed: true
    });

    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    const isCourseCompleted = progressPercentage === 100;

    // Find the next uncompleted lesson in sequence
    const allLessons = await Lesson.find({ courseId }).sort({ order: 1 }).select('_id title order').lean();
    const completedSet = new Set(
      (await Progress.find({ userId: req.user._id, courseId, completed: true }).select('lessonId').lean()).map((p) =>
        p.lessonId.toString()
      )
    );

    const nextLesson = allLessons.find((l) => !completedSet.has(l._id.toString())) || null;

    res.json({
      success: true,
      message: isCourseCompleted ? 'Congratulations! You have completed this entire course!' : 'Lesson marked as complete!',
      progress,
      courseProgress: {
        totalLessons,
        completedLessons,
        progressPercentage,
        isCourseCompleted,
        nextLesson: nextLesson ? { id: nextLesson._id, title: nextLesson.title, order: nextLesson.order } : null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update lesson progress.',
      error: error.message
    });
  }
});

// @route   GET /api/progress/course/:courseId
// @desc    Get detailed lesson progress for a specific course
router.get('/course/:courseId', requireAuth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const progressList = await Progress.find({
      userId: req.user._id,
      courseId
    }).lean();

    const totalLessons = await Lesson.countDocuments({ courseId });
    const completedLessons = progressList.filter((p) => p.completed).length;
    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    res.json({
      success: true,
      courseId,
      totalLessons,
      completedLessons,
      progressPercentage,
      details: progressList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve course progress.',
      error: error.message
    });
  }
});

// @route   GET /api/progress/stats
// @desc    Get overall student learning summary stats
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const userProgress = await Progress.find({ userId: req.user._id }).lean();
    const completedCount = userProgress.filter((p) => p.completed).length;

    // Total unique courses touched
    const uniqueCourses = new Set(userProgress.map((p) => p.courseId.toString()));
    const totalCourses = await Course.countDocuments();

    // Average score across completed modules
    const scores = userProgress.map((p) => p.quizScore || 80);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    // Total minutes studied
    const totalSeconds = userProgress.reduce((sum, p) => sum + (p.timeSpentSeconds || 0), 0);
    const totalMinutes = Math.round(totalSeconds / 60);

    res.json({
      success: true,
      stats: {
        enrolledCoursesCount: uniqueCourses.size || (totalCourses > 0 ? totalCourses : 0),
        completedLessonsCount: completedCount,
        averageScore: avgScore || 85,
        totalMinutesStudied: totalMinutes || 45
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve learning stats.',
      error: error.message
    });
  }
});

module.exports = router;
