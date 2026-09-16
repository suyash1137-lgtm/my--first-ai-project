// src/data/students.js
// Mock student data – replace with API calls in a later phase.

const students = [
  {
    id: "student-a",
    name: "Student A",
    email: "student.a@saralshiksha.edu",
    avatar: null,           // asset path – add in later phase
    overallScore: 82,       // percentage (0-100)
    enrolledCourses: ["python-basics", "web-development"],
    accessibility: {
      requiresCaptions: false,
      requiresReadAloud: false,
      simpleLanguage: false,
    },
    joinedAt: "2025-06-01",
  },
  {
    id: "student-b",
    name: "Student B",
    email: "student.b@saralshiksha.edu",
    avatar: null,
    overallScore: 35,
    enrolledCourses: ["ai-fundamentals"],
    accessibility: {
      requiresCaptions: true,
      requiresReadAloud: false,
      simpleLanguage: true,
    },
    joinedAt: "2025-07-15",
  },
  {
    id: "student-c",
    name: "Student C",
    email: "student.c@saralshiksha.edu",
    avatar: null,
    overallScore: 91,
    enrolledCourses: ["python-basics", "web-development", "ai-fundamentals"],
    accessibility: {
      requiresCaptions: false,
      requiresReadAloud: true,
      simpleLanguage: false,
    },
    joinedAt: "2025-05-20",
  },
];

export default students;
