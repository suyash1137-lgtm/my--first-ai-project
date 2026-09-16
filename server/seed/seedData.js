const mongoose = require('mongoose');
const { User, AccessibilityProfile, Course, Lesson, Progress } = require('../models/repo');

const seedDatabase = async () => {
  try {
    console.log('Seeding demo database for Saral Shiksha...');

    // Clear existing data to prevent duplicates
    await User.deleteMany({});
    await AccessibilityProfile.deleteMany({});
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await Progress.deleteMany({});

    // 1. Create Teacher / Admin account
    const teacher = new User({
      name: 'Prof. Sunita Sharma',
      email: 'teacher@saral.edu',
      password: 'teacher123',
      role: 'teacher',
      onboardingCompleted: true
    });
    await teacher.save();

    const teacherProfile = new AccessibilityProfile({
      userId: teacher._id,
      profileType: 'general',
      fontSize: 'normal',
      contrast: 'standard',
      ttsSpeed: 1.0,
      captionsEnabled: false,
      simplifyLanguage: false,
      focusMode: false
    });
    await teacherProfile.save();
    teacher.accessibilityProfile = teacherProfile._id;
    await teacher.save();

    // 2. Create Sample Courses
    const course1 = new Course({
      title: 'Web Accessibility Fundamentals (WCAG 2.1)',
      description: 'Master the core principles of building inclusive, universally accessible web applications following international WCAG 2.1 AA standards.',
      category: 'Computer Science & Design',
      level: 'Beginner',
      thumbnail: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&auto=format&fit=crop&q=60',
      icon: 'sparkles',
      createdById: teacher._id,
      totalLessons: 3,
      estimatedHours: 2
    });
    await course1.save();

    const course2 = new Course({
      title: 'Renewable Energy & Climate Science',
      description: 'Explore the science of solar, wind, and sustainable clean energy to combat climate change and build an eco-friendly future.',
      category: 'Environmental Science',
      level: 'Beginner',
      thumbnail: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=60',
      icon: 'sun',
      createdById: teacher._id,
      totalLessons: 3,
      estimatedHours: 3
    });
    await course2.save();

    const course3 = new Course({
      title: 'Computational Thinking & Algorithms',
      description: 'Learn foundational problem-solving strategies, step-by-step logical reasoning, and algorithmic design for modern technology.',
      category: 'Information Technology',
      level: 'Intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
      icon: 'cpu',
      createdById: teacher._id,
      totalLessons: 3,
      estimatedHours: 2
    });
    await course3.save();

    // 3. Create Lessons for Course 1
    const l1_1 = new Lesson({
      courseId: course1._id,
      order: 1,
      title: 'Introduction to Digital Inclusion & Accessibility',
      summary: 'Understand why accessible software design is essential and learn the foundational POUR principles.',
      durationMinutes: 6,
      keyTakeaways: [
        'Accessibility ensures everyone can perceive, operate, and understand technology',
        'POUR stands for Perceivable, Operable, Understandable, and Robust',
        'Universal design benefits all users, including those with temporary injuries'
      ],
      fullText: `Digital accessibility is the practice of building applications that are usable by everyone, including people with visual, auditory, motor, or cognitive disabilities. In an increasingly connected world, access to educational materials and software interfaces is a fundamental civil right.

The World Wide Web Consortium (W3C) established the Web Content Accessibility Guidelines (WCAG) structured around four fundamental pillars known as POUR. First is Perceivable: information and user interface components must be presentable to users in ways they can perceive through text equivalents, sound, or braille. Second is Operable: user interface components and navigation must be fully operable via keyboard, switch controls, and voice.

Third is Understandable: users must be able to comprehend the information and operation of the user interface without confusing or erratic behaviors. Fourth is Robust: content must be robust enough that it can be interpreted reliably by a wide variety of user agents, assistive technologies, and modern web browsers. Universal design empowers everyone by reducing barriers and creating dignified educational opportunities.`,
      simplifiedText: `Digital accessibility means making websites easy for every person to use. This includes people who cannot see well, cannot hear, or learn in different ways.

We follow four simple rules called POUR:
1. Easy to see and hear: Information is presented clearly with spoken text, captions, and bright colors.
2. Easy to use: You can move through the whole page using only a keyboard or simple clicks.
3. Easy to understand: Words are simple and clear, with no confusing surprises.
4. Works on all devices: The lessons work smoothly on phones, tablets, and screen readers.

When we design for accessibility, everyone learns faster and better!`
    });
    await l1_1.save();

    const l1_2 = new Lesson({
      courseId: course1._id,
      order: 2,
      title: 'Semantic HTML & Screen Reader Navigation',
      summary: 'Learn how semantic markup provides vital structural cues to assistive software.',
      durationMinutes: 7,
      keyTakeaways: [
        'Semantic tags convey meaning rather than just visual appearance',
        'ARIA landmarks help screen reader users jump directly to relevant sections',
        'Always provide descriptive alternative text on informative imagery'
      ],
      fullText: `Semantic HTML is the bedrock of accessible digital development. When software engineers use meaningful tags such as header, nav, main, article, section, and aside, web browsers communicate a cohesive accessibility tree to assistive devices like screen readers and refreshable braille displays.

Using a generic div element styled to look like a button lacks native keyboard focusability, enter-key activation, and role announcements. In contrast, native interactive elements like buttons and anchors provide innate keyboard affordances and communicate their operational states to blind learners.

Furthermore, Accessible Rich Internet Applications (ARIA) attributes augment HTML when complex custom widgets are constructed. Attributes like aria-live="polite" inform screen readers to announce dynamically streaming captions or real-time status notifications without abruptly interrupting the user's ongoing reading experience.`,
      simplifiedText: `Computers and screen readers need to understand what each part of a page is doing. We use special labels to help them.

Instead of plain boxes, we tell the computer:
- Here is the top navigation bar.
- Here is the main story.
- Here is a clickable button.

When blind students use screen reader programs, the software reads these labels out loud. This helps the student jump straight to the lesson without getting lost in menus. We also put short descriptions on photos so everyone knows what is shown.`
    });
    await l1_2.save();

    const l1_3 = new Lesson({
      courseId: course1._id,
      order: 3,
      title: 'Color Contrast & Visual Clarity',
      summary: 'Design high-visibility color palettes that meet strict WCAG contrast standards.',
      durationMinutes: 5,
      keyTakeaways: [
        'Normal text requires at least 4.5:1 contrast against its background',
        'High contrast modes assist users with low vision, cataracts, and bright sunlight glare',
        'Never rely on color alone to convey crucial information or states'
      ],
      fullText: `Color contrast ratio measures the difference in relative luminance between foreground text and its background canvas. The WCAG 2.1 Level AA standard mandates a contrast ratio of at least 4.5 to 1 for body text and 3 to 1 for large headings and interface controls.

Insufficient contrast causes acute visual fatigue and renders text completely illegible for individuals with low vision, color perception deficiencies, or aging eyesight. Incorporating a dedicated High Contrast mode featuring deep slate backgrounds paired with high-luminance amber and cyan highlights guarantees maximum clarity.

Equally important is the rule of dual-channel indicators: never rely solely on color shifts to communicate state changes or errors. Always combine color cues with explicit icons, clear text labels, and visible focus outlines.`,
      simplifiedText: `Color contrast is how well letters stand out from the page behind them.

When letters are dark and the page is bright (or when letters are bright yellow and the page is black), words are very easy to read. If colors are too light, letters blend into the background and hurt your eyes.

In our High Contrast mode, we use bold colors and thick borders so you never have to strain your eyes. We also put clear checkmarks and words next to colors so everyone understands instantly.`
    });
    await l1_3.save();

    // 4. Create Lessons for Course 2 (Renewable Energy)
    const l2_1 = new Lesson({
      courseId: course2._id,
      order: 1,
      title: 'Solar Energy & Photovoltaic Power',
      summary: 'Discover how sunlight is converted into clean, carbon-free electric power.',
      durationMinutes: 6,
      keyTakeaways: [
        'Solar panels convert sunlight photons directly into electrical current',
        'Solar energy produces zero carbon emissions during generation',
        'Photovoltaic systems can power homes, schools, and entire cities'
      ],
      fullText: `Solar energy harnesses radiant light and heat from the Sun using photovoltaic panels and solar thermal collectors. Within photovoltaic cells, semiconductor materials like silicon absorb sunlight photons, releasing valence electrons that generate a direct electric current (DC).

An inverter converts this direct current into alternating current (AC), making it compatible with national electric grids and everyday household appliances. Because solar generation emits zero greenhouse gases, it serves as a central pillar of global decarbonization initiatives and energy independence.`,
      simplifiedText: `Solar energy comes straight from the bright sunshine.

Solar panels are dark glass sheets that catch sunlight. When sunbeams hit the panels, tiny particles inside start moving and create clean electricity!

This clean power runs our fans, lights, and computers without burning dirty coal or polluting the air.`
    });
    await l2_1.save();

    const l2_2 = new Lesson({
      courseId: course2._id,
      order: 2,
      title: 'Wind Turbines & Kinetic Energy',
      summary: 'Learn how blowing wind rotates giant aerodynamic blades to spin clean energy generators.',
      durationMinutes: 5,
      keyTakeaways: [
        'Wind is caused by uneven atmospheric heating by the sun',
        'Aerodynamic blades capture kinetic energy and spin internal electromagnets',
        'Wind farms operate on land and offshore in windy coastal waters'
      ],
      fullText: `Wind energy captures kinetic energy generated by moving atmospheric air masses. Solar radiation warms the Earth unevenly, creating temperature and atmospheric pressure differentials that generate persistent winds.

Modern three-bladed wind turbines utilize aerodynamic lift, similar to aircraft wings, to turn a low-speed shaft connected to a gearbox and electromagnetic generator. This mechanical rotation induces electric voltage. Modern offshore wind installations take advantage of powerful ocean breezes to produce enormous quantities of clean electricity.`,
      simplifiedText: `Wind is moving air created when the sun warms different parts of the earth.

Wind turbines look like giant white windmills. When the wind blows, it pushes the giant blades in a circle. The spinning blades turn a machine inside that makes clean electrical power!

Wind energy is completely renewable because the wind never runs out.`
    });
    await l2_2.save();

    const l2_3 = new Lesson({
      courseId: course2._id,
      order: 3,
      title: 'Practical Energy Conservation in Daily Life',
      summary: 'Simple, effective actions students and families can take to save energy and protect the planet.',
      durationMinutes: 4,
      keyTakeaways: [
        'Turning off standby electronics reduces phantom energy drain',
        'Switching to LED lighting cuts lighting electricity use by up to 80%',
        'Walking, cycling, or public transport reduces individual carbon footprint'
      ],
      fullText: `Energy efficiency and conservation are the most immediate and cost-effective methods for reducing atmospheric carbon emissions. Even modest behavioral modifications at the residential scale yield significant collective energy savings.

Switching from incandescent to solid-state LED fixtures reduces lighting electricity consumption by up to eighty percent. Addressing vampire or phantom loads by unplugging electronics or utilizing smart power strips eliminates wasteful standby draw. Additionally, adopting active transit like cycling and walking diminishes reliance on fossil fuel combustion.`,
      simplifiedText: `Saving energy is easy and helps protect our planet every day.

Here are three simple things you can do:
1. Turn off fans, lights, and TVs when you leave a room.
2. Unplug phone chargers when you are not using them.
3. Walk or ride a bicycle for short trips instead of taking a car.

Small positive habits make our world cleaner and greener!`
    });
    await l2_3.save();

    // 5. Create Lessons for Course 3 (Computational Thinking)
    const l3_1 = new Lesson({
      courseId: course3._id,
      order: 1,
      title: 'What is an Algorithm?',
      summary: 'Learn the foundational concept of step-by-step instructions in computer science.',
      durationMinutes: 5,
      keyTakeaways: [
        'An algorithm is a finite sequence of well-defined steps to solve a problem',
        'Algorithms must be precise, unambiguous, and have a clear starting and ending point',
        'Every day activities like cooking follow algorithmic patterns'
      ],
      fullText: `An algorithm is a finite, unambiguous sequence of computational instructions designed to solve a specific class of problems or perform a mathematical calculation. Algorithms take specified input data, execute a deterministic series of states, and terminate by yielding an expected output.

Developing an effective algorithm requires decomposition: breaking down complex challenges into manageable, modular components. In everyday life, a culinary recipe or navigation directions function precisely like an algorithm. In software engineering, algorithms optimize searching, sorting, cryptography, and artificial intelligence.`,
      simplifiedText: `An algorithm is just a step-by-step recipe for a computer.

Think about baking a cake:
1. Gather your ingredients.
2. Mix flour, sugar, and milk in a bowl.
3. Bake in the oven for 30 minutes.
4. Let it cool and enjoy!

If you follow the steps in the right order, you get a delicious cake every time. In the exact same way, computers follow step-by-step rules to play games, calculate math, and run apps!`
    });
    await l3_1.save();

    const l3_2 = new Lesson({
      courseId: course3._id,
      order: 2,
      title: 'Conditionals: IF and ELSE Logic',
      summary: 'How computers make decisions using truth tests and branching logic.',
      durationMinutes: 5,
      keyTakeaways: [
        'Conditionals check if a statement is True or False',
        'IF statements run specific code only when conditions are met',
        'ELSE branches provide the default action when conditions are False'
      ],
      fullText: `Conditional statements govern algorithmic control flow by evaluating boolean expressions that resolve to either True or False. If the evaluated predicate yields True, the processor branches into the designated code block; otherwise, execution cascades to alternate ELSE or ELSE-IF blocks.

Conditionals allow computational systems to respond dynamically to varied user input and sensory data. For instance, in automated thermostat programming, IF temperature drops below eighteen degrees Celsius, activate heating; ELSE, maintain passive standby.`,
      simplifiedText: `Conditionals let computers make smart decisions based on what is happening.

It works just like our everyday choices:
- IF it is raining outside, THEN take an umbrella.
- ELSE, wear your favorite sunglasses.

The computer checks: "Is it raining?" If yes, it does step 1. If not, it does step 2. This lets games, apps, and websites adapt to what you do!`
    });
    await l3_2.save();

    const l3_3 = new Lesson({
      courseId: course3._id,
      order: 3,
      title: 'Loops: Repeating Actions Efficiently',
      summary: 'Save time and simplify code by repeating tasks until goals are accomplished.',
      durationMinutes: 5,
      keyTakeaways: [
        'Loops repeat code without having to copy and paste the same instructions',
        'FOR loops run a fixed number of times',
        'WHILE loops continue until a specific condition changes to false'
      ],
      fullText: `Iteration and looping constructs enable programmers to execute instructions repeatedly without redundant code duplication. A count-controlled FOR loop iterates through a predetermined sequence of elements, executing its body a specified number of cycles.

In contrast, a condition-controlled WHILE loop continues execution indefinitely until a monitored condition evaluates to False. Proper loop invariants and clear termination thresholds prevent catastrophic infinite loops and optimize memory utilization during massive data processing.`,
      simplifiedText: `A loop tells the computer: "Repeat this action until I say stop!"

Imagine brushing your teeth: you brush back and forth several times until your teeth are clean. You don't have to think "brush, brush, brush" ten separate times—you just do a loop!

Loops save programmers from typing the same lines over and over, making apps lightning fast and bug-free.`
    });
    await l3_3.save();

    // 6. Create Demo Students with Diverse Accessibility Profiles & Progress
    const studentsData = [
      {
        name: 'Aarav Patel',
        email: 'aarav@student.edu',
        password: 'student123',
        profileType: 'visual',
        contrast: 'high-contrast',
        fontSize: 'large',
        ttsSpeed: 1.0,
        ttsAutoPlay: true,
        captionsEnabled: true,
        simplifyLanguage: false,
        focusMode: false,
        completedLessonsCount: 3, // 100% of course 1
        attendancePct: 96,
        quizScore: 92,
        daysInactive: 1
      },
      {
        name: 'Priya Verma',
        email: 'priya@student.edu',
        password: 'student123',
        profileType: 'hearing',
        contrast: 'standard',
        fontSize: 'normal',
        ttsSpeed: 1.0,
        ttsAutoPlay: false,
        captionsEnabled: true,
        simplifyLanguage: false,
        focusMode: false,
        completedLessonsCount: 2, // 66% of course 1
        attendancePct: 90,
        quizScore: 88,
        daysInactive: 2
      },
      {
        name: 'Rohan Deshmukh',
        email: 'rohan@student.edu',
        password: 'student123',
        profileType: 'cognitive',
        contrast: 'dyslexia-friendly',
        fontSize: 'large',
        ttsSpeed: 0.85,
        ttsAutoPlay: false,
        captionsEnabled: true,
        simplifyLanguage: true,
        focusMode: true,
        completedLessonsCount: 1, // 33% of course 1
        attendancePct: 78,
        quizScore: 74,
        daysInactive: 4
      },
      {
        name: 'Vikram Singh (High Dropout Risk)',
        email: 'vikram@student.edu',
        password: 'student123',
        profileType: 'general',
        contrast: 'standard',
        fontSize: 'normal',
        ttsSpeed: 1.0,
        ttsAutoPlay: false,
        captionsEnabled: false,
        simplifyLanguage: false,
        focusMode: false,
        completedLessonsCount: 0, // 0%
        attendancePct: 45,
        quizScore: 50,
        daysInactive: 16 // Very high inactivity
      },
      {
        name: 'Ananya Iyer (Moderate Risk)',
        email: 'ananya@student.edu',
        password: 'student123',
        profileType: 'cognitive',
        contrast: 'dyslexia-friendly',
        fontSize: 'normal',
        ttsSpeed: 1.0,
        ttsAutoPlay: false,
        captionsEnabled: false,
        simplifyLanguage: true,
        focusMode: false,
        completedLessonsCount: 1, // 11% overall
        attendancePct: 62,
        quizScore: 60,
        daysInactive: 8
      },
      {
        name: 'Neha Gupta',
        email: 'neha@student.edu',
        password: 'student123',
        profileType: 'general',
        contrast: 'standard',
        fontSize: 'normal',
        ttsSpeed: 1.0,
        ttsAutoPlay: false,
        captionsEnabled: false,
        simplifyLanguage: false,
        focusMode: false,
        completedLessonsCount: 2,
        attendancePct: 86,
        quizScore: 82,
        daysInactive: 1
      }
    ];

    const course1Lessons = [l1_1, l1_2, l1_3];

    for (const sData of studentsData) {
      // Calculate last login based on daysInactive
      const lastLoginDate = new Date(Date.now() - sData.daysInactive * 24 * 60 * 60 * 1000);

      const studentUser = new User({
        name: sData.name,
        email: sData.email,
        password: sData.password,
        role: 'student',
        onboardingCompleted: true,
        lastLogin: lastLoginDate
      });
      await studentUser.save();

      const studentProfile = new AccessibilityProfile({
        userId: studentUser._id,
        profileType: sData.profileType,
        contrast: sData.contrast,
        fontSize: sData.fontSize,
        ttsSpeed: sData.ttsSpeed,
        ttsAutoPlay: sData.ttsAutoPlay,
        captionsEnabled: sData.captionsEnabled,
        simplifyLanguage: sData.simplifyLanguage,
        focusMode: sData.focusMode
      });
      await studentProfile.save();

      studentUser.accessibilityProfile = studentProfile._id;
      await studentUser.save();

      // Seed progress records
      for (let i = 0; i < course1Lessons.length; i++) {
        const isCompleted = i < sData.completedLessonsCount;
        await Progress.create({
          userId: studentUser._id,
          courseId: course1._id,
          lessonId: course1Lessons[i]._id,
          completed: isCompleted,
          completedAt: isCompleted ? new Date(Date.now() - (sData.daysInactive + (3 - i)) * 24 * 60 * 60 * 1000) : null,
          lastAccessedAt: lastLoginDate,
          attendancePct: sData.attendancePct,
          quizScore: sData.quizScore,
          timeSpentSeconds: isCompleted ? 360 : 60
        });
      }
    }

    console.log('Database seeded successfully:');
    console.log('- 1 Teacher Account (teacher@saral.edu)');
    console.log('- 6 Student Accounts (with Visual, Hearing, Cognitive, and At-Risk profiles)');
    console.log('- 3 Accessible Courses with 9 dual-language Lessons');
    return true;
  } catch (error) {
    console.error('Database seeding failed:', error);
    throw error;
  }
};

module.exports = seedDatabase;

// Run directly if called from command line
if (require.main === module) {
  require('dotenv').config();
  const { connectDB, disconnectDB } = require('../config/db');

  connectDB()
    .then(async () => {
      await seedDatabase();
      await disconnectDB();
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
