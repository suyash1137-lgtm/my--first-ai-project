// src/data/courses.js
// Mock course data – replace with API calls in a later phase.

const courses = [
  {
    id: "python-basics",
    title: "Python Basics",
    description: "Learn the fundamentals of Python programming from scratch.",
    category: "Programming",
    level: "Beginner",
    progress: 70,           // percentage (0-100)
    totalLessons: 20,
    completedLessons: 14,
    instructor: "Ms. Priya Sharma",
    tags: ["python", "programming", "beginner"],
    thumbnail: null,        // asset path – add in later phase
  },
  {
    id: "web-development",
    title: "Web Development",
    description: "Build modern websites using HTML, CSS, and JavaScript.",
    category: "Web",
    level: "Intermediate",
    progress: 50,
    totalLessons: 30,
    completedLessons: 15,
    instructor: "Mr. Arjun Patel",
    tags: ["html", "css", "javascript", "web"],
    thumbnail: null,
  },
  {
    id: "ai-fundamentals",
    title: "AI Fundamentals",
    description: "Understand the core concepts behind Artificial Intelligence and ML.",
    category: "Technology",
    level: "Intermediate",
    progress: 30,
    totalLessons: 25,
    completedLessons: 8,
    instructor: "Dr. Kavya Reddy",
    tags: ["ai", "machine learning", "data"],
    thumbnail: null,
  },
];

export default courses;
