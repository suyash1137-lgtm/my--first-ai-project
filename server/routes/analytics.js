const express = require('express');
const router = express.Router();
const axios = require('axios');
const { User, Course, Lesson, Progress } = require('../models/repo');
const { requireAuth, requireRole } = require('../middleware/auth');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:5001';

// Fallback rule-based risk calculation if ML microservice is offline
const calculateFallbackRisk = (features) => {
  const { attendance_pct, avg_quiz_score, days_since_last_login, lessons_completed, lessons_assigned } = features;
  const completionRate = lessons_assigned > 0 ? lessons_completed / lessons_assigned : 0;

  let riskPoints = 0;
  const explanations = [];

  if (days_since_last_login >= 10) {
    riskPoints += 40;
    explanations.push({ factor: 'Prolonged Inactivity', impact: '+40%', detail: `Inactive for ${days_since_last_login} days` });
  } else if (days_since_last_login >= 5) {
    riskPoints += 20;
    explanations.push({ factor: 'Recent Inactivity', impact: '+20%', detail: `Inactive for ${days_since_last_login} days` });
  }

  if (completionRate < 0.3) {
    riskPoints += 35;
    explanations.push({ factor: 'Very Low Lesson Completion', impact: '+35%', detail: `${lessons_completed}/${lessons_assigned} completed (${Math.round(completionRate * 100)}%)` });
  } else if (completionRate < 0.6) {
    riskPoints += 15;
    explanations.push({ factor: 'Moderate Lesson Completion', impact: '+15%', detail: `${Math.round(completionRate * 100)}% completion` });
  }

  if (attendance_pct < 65) {
    riskPoints += 25;
    explanations.push({ factor: 'Poor Class Attendance', impact: '+25%', detail: `${attendance_pct}% attendance` });
  }

  if (avg_quiz_score < 55) {
    riskPoints += 20;
    explanations.push({ factor: 'Low Quiz Performance', impact: '+20%', detail: `${avg_quiz_score}% average score` });
  }

  const score = Math.min(Math.max(riskPoints / 100, 0.05), 0.95);
  const level = score >= 0.65 ? 'HIGH' : score >= 0.35 ? 'MEDIUM' : 'LOW';

  return {
    risk_score: parseFloat(score.toFixed(2)),
    risk_level: level,
    shap_explanations: explanations.length > 0 ? explanations : [
      { factor: 'Consistent Engagement', impact: '-30%', detail: 'Regular attendance and active lesson participation' }
    ],
    source: 'heuristic-engine'
  };
};

// @route   GET /api/analytics/struggling-students
// @desc    Get detailed student engagement, progress, and ML dropout risk scores
router.get('/struggling-students', requireAuth, requireRole('teacher'), async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).populate('accessibilityProfile').lean();
    const totalLessonsCount = await Lesson.countDocuments();

    const studentAnalytics = await Promise.all(
      students.map(async (student) => {
        // Fetch all progress records for this student
        const progressList = await Progress.find({ userId: student._id }).lean();
        const completedCount = progressList.filter((p) => p.completed).length;

        // Compute averages
        const attendanceScores = progressList.map((p) => p.attendancePct || 80);
        const quizScores = progressList.map((p) => p.quizScore || 75);

        const avgAttendance = attendanceScores.length > 0
          ? Math.round(attendanceScores.reduce((a, b) => a + b, 0) / attendanceScores.length)
          : 75;

        const avgQuiz = quizScores.length > 0
          ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
          : 70;

        // Days since last login
        const lastLoginDate = student.lastLogin ? new Date(student.lastLogin) : new Date(student.updatedAt || Date.now());
        const daysSinceLastLogin = Math.max(0, Math.floor((Date.now() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24)));

        const completionRate = totalLessonsCount > 0 ? completedCount / totalLessonsCount : 0;
        const progressPercentage = Math.round(completionRate * 100);

        // Feature payload for ML microservice
        const studentFeatures = {
          student_id: student._id.toString(),
          attendance_pct: avgAttendance,
          avg_quiz_score: avgQuiz,
          days_since_last_login: daysSinceLastLogin,
          lessons_completed: completedCount,
          lessons_assigned: totalLessonsCount || 10
        };

        // Try calling Python ML microservice
        let riskAssessment;
        try {
          const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict-risk`, studentFeatures, { timeout: 2000 });
          riskAssessment = mlResponse.data;
        } catch (mlErr) {
          // Fallback to internal heuristic
          riskAssessment = calculateFallbackRisk(studentFeatures);
        }

        return {
          id: student._id,
          name: student.name,
          email: student.email,
          profileType: student.accessibilityProfile ? student.accessibilityProfile.profileType : 'general',
          lastActive: lastLoginDate,
          daysInactive: daysSinceLastLogin,
          totalAssignedLessons: totalLessonsCount,
          completedLessons: completedCount,
          progressPercentage,
          attendancePct: avgAttendance,
          quizScore: avgQuiz,
          isStruggling: progressPercentage < 40 || daysSinceLastLogin >= 7 || avgQuiz < 60,
          risk: riskAssessment
        };
      })
    );

    // Sort by risk score descending (highest risk students first)
    studentAnalytics.sort((a, b) => (b.risk.risk_score || 0) - (a.risk.risk_score || 0));

    res.json({
      success: true,
      count: studentAnalytics.length,
      strugglingCount: studentAnalytics.filter((s) => s.isStruggling).length,
      students: studentAnalytics
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate struggling students analytics.',
      error: error.message
    });
  }
});

// @route   GET /api/analytics/overview
// @desc    High-level dashboard KPIs for teachers
router.get('/overview', requireAuth, requireRole('teacher'), async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCourses = await Course.countDocuments();
    const totalLessons = await Lesson.countDocuments();
    const totalCompletedLessons = await Progress.countDocuments({ completed: true });

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalCourses,
        totalLessons,
        totalCompletedLessons,
        avgCompletionRate: totalLessons > 0 && totalStudents > 0
          ? Math.round((totalCompletedLessons / (totalLessons * totalStudents)) * 100)
          : 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve analytics overview.',
      error: error.message
    });
  }
});

module.exports = router;
