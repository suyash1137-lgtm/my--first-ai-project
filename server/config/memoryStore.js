const bcrypt = require('bcryptjs');

// In-memory document collections
const store = {
  users: [],
  profiles: [],
  courses: [],
  lessons: [],
  progress: []
};

// Unique ID generator
const generateId = () => Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);

class ChainableQuery {
  constructor(promiseExecutor) {
    this.promiseExecutor = promiseExecutor;
    this.sortKey = null;
    this.sortOrder = 1;
    this.populateFields = [];
    this.selectedFields = null;
  }

  sort(criteria) {
    if (criteria && typeof criteria === 'object') {
      const [key, dir] = Object.entries(criteria)[0] || [];
      this.sortKey = key;
      this.sortOrder = dir === -1 || dir === 'desc' ? -1 : 1;
    }
    return this;
  }

  populate(field) {
    if (field) this.populateFields.push(field);
    return this;
  }

  select(fields) {
    this.selectedFields = fields;
    return this;
  }

  lean() {
    return this;
  }

  async exec() {
    let result = await this.promiseExecutor();

    const processItem = (item) => {
      if (!item) return item;
      let obj = { ...item };

      // Method bindings
      obj.toObject = () => ({ ...obj });
      if (obj.password) {
        obj.comparePassword = async function (candidatePassword) {
          if (!this.password) return false;
          if (!this.password.startsWith('$2')) {
            return candidatePassword === this.password;
          }
          return bcrypt.compare(candidatePassword, this.password);
        };
      }

      // Handle populate
      for (const f of this.populateFields) {
        if (f === 'accessibilityProfile') {
          const profile = store.profiles.find(
            (p) =>
              (p._id && obj.accessibilityProfile && p._id.toString() === obj.accessibilityProfile.toString()) ||
              (p.userId && obj._id && p.userId.toString() === obj._id.toString())
          );
          if (profile) obj.accessibilityProfile = { ...profile };
        }
      }

      // Handle select('-password')
      if (this.selectedFields && typeof this.selectedFields === 'string') {
        const parts = this.selectedFields.split(' ');
        for (const p of parts) {
          if (p.startsWith('-')) {
            delete obj[p.substring(1)];
          }
        }
      }

      return obj;
    };

    if (Array.isArray(result)) {
      let items = result.map(processItem);
      if (this.sortKey) {
        items.sort((a, b) => {
          const valA = a[this.sortKey] || '';
          const valB = b[this.sortKey] || '';
          if (valA < valB) return -1 * this.sortOrder;
          if (valA > valB) return 1 * this.sortOrder;
          return 0;
        });
      }
      return items;
    }

    return processItem(result);
  }

  then(resolve, reject) {
    return this.exec().then(resolve, reject);
  }

  catch(reject) {
    return this.exec().catch(reject);
  }
}

class MemoryModel {
  constructor(collectionName) {
    this.name = collectionName;
  }

  get items() {
    return store[this.name];
  }

  find(query = {}) {
    return new ChainableQuery(async () => {
      let results = [...this.items];
      for (const [key, value] of Object.entries(query)) {
        results = results.filter((item) => {
          const val = item[key];
          if (val && typeof val === 'object' && val.toString && value && value.toString) {
            return val.toString() === value.toString();
          }
          return val === value;
        });
      }
      return results;
    });
  }

  findOne(query = {}) {
    return new ChainableQuery(async () => {
      const all = await this.find(query);
      return all.length > 0 ? all[0] : null;
    });
  }

  findById(id) {
    return new ChainableQuery(async () => {
      if (!id) return null;
      const item = this.items.find((i) => i._id.toString() === id.toString());
      return item ? { ...item } : null;
    });
  }

  async countDocuments(query = {}) {
    const list = await this.find(query);
    return list.length;
  }

  async create(data) {
    const newItem = {
      _id: data._id || generateId(),
      createdAt: data.createdAt || new Date(),
      updatedAt: new Date(),
      ...data
    };

    if (this.name === 'users' && newItem.password && !newItem.password.startsWith('$2')) {
      const salt = bcrypt.genSaltSync(10);
      newItem.password = bcrypt.hashSync(newItem.password, salt);
      data.password = newItem.password;
    }

    newItem.toObject = () => ({ ...newItem });
    if (this.name === 'users') {
      newItem.comparePassword = async function (cand) {
        if (!this.password) return false;
        if (!this.password.startsWith('$2')) {
          return cand === this.password;
        }
        return bcrypt.compare(cand, this.password);
      };
    }

    this.items.push(newItem);
    return newItem;
  }

  async findOneAndUpdate(query, update, options = {}) {
    let existing = await this.findOne(query);
    if (!existing && options.upsert) {
      const initData = { ...query, ...(update.$set || update) };
      return this.create(initData);
    }
    if (!existing) return null;

    const idx = this.items.findIndex((i) => i._id.toString() === existing._id.toString());
    if (idx !== -1) {
      const patch = update.$set || update;
      if (this.name === 'users' && patch.password && !patch.password.startsWith('$2')) {
        const salt = bcrypt.genSaltSync(10);
        patch.password = bcrypt.hashSync(patch.password, salt);
      }
      this.items[idx] = { ...this.items[idx], ...patch, updatedAt: new Date() };
      if (update.$inc) {
        for (const [k, v] of Object.entries(update.$inc)) {
          this.items[idx][k] = (this.items[idx][k] || 0) + v;
        }
      }
      return { ...this.items[idx], toObject: () => ({ ...this.items[idx] }) };
    }
    return null;
  }

  async findByIdAndUpdate(id, update, options = {}) {
    return this.findOneAndUpdate({ _id: id }, update, options);
  }

  async deleteMany(query = {}) {
    if (Object.keys(query).length === 0) {
      store[this.name] = [];
      return { deletedCount: 0 };
    }
    const before = this.items.length;
    this.items.filter((item) => {
      for (const [k, v] of Object.entries(query)) {
        if (item[k] === v) return false;
      }
      return true;
    });
    return { deletedCount: before - this.items.length };
  }
}

module.exports = {
  store,
  UserStore: new MemoryModel('users'),
  ProfileStore: new MemoryModel('profiles'),
  CourseStore: new MemoryModel('courses'),
  LessonStore: new MemoryModel('lessons'),
  ProgressStore: new MemoryModel('progress'),
  generateId
};
