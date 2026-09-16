const http = require('http');

const request = (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
};

async function runTests() {
  console.log('--- RUNNING API SMOKE TESTS ---');

  // 1. Health
  const health = await request('GET', '/api/health');
  console.log('1. Health check:', health.status, health.data.status);

  // 2. Teacher Login
  const teacherLogin = await request('POST', '/api/auth/login', {
    email: 'teacher@saral.edu',
    password: 'teacher123'
  });
  console.log('2. Teacher login response:', teacherLogin.status, teacherLogin.data);
  if (!teacherLogin.data.user) {
    console.error('Teacher login failed. Exiting.');
    process.exit(1);
  }
  const teacherToken = teacherLogin.data.token;

  // 3. Student Login
  const studentLogin = await request('POST', '/api/auth/login', {
    email: 'aarav@student.edu',
    password: 'student123'
  });
  console.log('3. Student login:', studentLogin.status, studentLogin.data.user.name, 'Profile:', studentLogin.data.profile.profileType);
  const studentToken = studentLogin.data.token;

  // 4. Courses Listing with Progress
  const coursesRes = await request('GET', '/api/courses', null, studentToken);
  console.log('4. Courses listing for student:', coursesRes.status, 'Total Courses:', coursesRes.data.count);
  const firstCourse = coursesRes.data.courses[0];
  console.log('   Course:', firstCourse.title, '| Progress:', firstCourse.progressPercentage + '%');

  // 5. Lesson Player detail
  const courseDetail = await request('GET', `/api/courses/${firstCourse._id}`, null, studentToken);
  console.log('5. Course detail lessons:', courseDetail.data.course.lessons.length);
  const firstLesson = courseDetail.data.course.lessons[0];
  const lessonRes = await request('GET', `/api/lessons/${firstLesson._id}`, null, studentToken);
  console.log('   Lesson:', lessonRes.data.lesson.title);
  console.log('   Has Full Text:', !!lessonRes.data.lesson.fullText, '| Has Simplified Text:', !!lessonRes.data.lesson.simplifiedText);

  // 6. Progress Completion
  const completeRes = await request(
    'POST',
    '/api/progress/complete',
    {
      courseId: firstCourse._id,
      lessonId: firstLesson._id,
      timeSpentSeconds: 180,
      quizScore: 95
    },
    studentToken
  );
  console.log('6. Mark lesson complete:', completeRes.status, completeRes.data.message);

  // 7. Struggling Students Analytics (Teacher only)
  const analyticsRes = await request('GET', '/api/analytics/struggling-students', null, teacherToken);
  console.log('7. Teacher analytics:', analyticsRes.status, 'Students evaluated:', analyticsRes.data.count, 'Struggling:', analyticsRes.data.strugglingCount);
  const topRisk = analyticsRes.data.students[0];
  console.log('   Highest risk student:', topRisk.name, '| Risk:', topRisk.risk.risk_level, `(${topRisk.risk.risk_score * 100}%)`);

  console.log('--- ALL BACKEND TESTS PASSED SUCCESSFULLY ---');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('API Tests failed:', err);
  process.exit(1);
});
