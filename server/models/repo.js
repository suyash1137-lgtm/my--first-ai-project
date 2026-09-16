const bcrypt = require('bcryptjs');
const { getIsMemoryMode } = require('../config/db');
const { UserStore, ProfileStore, CourseStore, LessonStore, ProgressStore, generateId } = require('../config/memoryStore');
const UserModel = require('./User');
const ProfileModel = require('./AccessibilityProfile');
const CourseModel = require('./Course');
const LessonModel = require('./Lesson');
const ProgressModel = require('./Progress');

// Proxy dispatcher that routes calls to Mongoose or MemoryStore seamlessly
const createModelProxy = (mongooseModel, memoryStore) => {
  return new Proxy(mongooseModel, {
    construct(target, args) {
      if (getIsMemoryMode()) {
        const data = args[0] || {};
        const doc = {
          _id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
          ...data
        };

        doc.save = async function () {
          // If already in store, update it; otherwise insert
          const existing = memoryStore.items.find((i) => i._id.toString() === doc._id.toString());
          if (existing) {
            Object.assign(existing, doc, { updatedAt: new Date() });
            return existing;
          }
          return memoryStore.create(doc);
        };

        if (memoryStore.name === 'users') {
          doc.comparePassword = async function (candidatePassword) {
            return bcrypt.compare(candidatePassword, this.password);
          };
        }

        doc.toObject = function () {
          return { ...this };
        };

        return doc;
      }
      return new target(...args);
    },

    get(target, prop) {
      if (getIsMemoryMode()) {
        if (prop === 'schema') {
          return target.schema;
        }
        if (typeof memoryStore[prop] === 'function') {
          return memoryStore[prop].bind(memoryStore);
        }
        return memoryStore[prop];
      }
      return target[prop];
    }
  });
};

const User = createModelProxy(UserModel, UserStore);
const AccessibilityProfile = createModelProxy(ProfileModel, ProfileStore);
const Course = createModelProxy(CourseModel, CourseStore);
const Lesson = createModelProxy(LessonModel, LessonStore);
const Progress = createModelProxy(ProgressModel, ProgressStore);

module.exports = {
  User,
  AccessibilityProfile,
  Course,
  Lesson,
  Progress
};
