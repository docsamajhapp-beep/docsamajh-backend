import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Define the User interface
export interface IUser {
  googleId: string;
  email: string;
  name: string;
  picture: string;
  plan: 'free' | 'pro' | 'max';
  docsUsed: number;
  bonusDocs: number;
  createdAt: Date;
}

// Local JSON file path fallback
const LOCAL_DB_PATH = path.join(process.cwd(), 'local_db.json');

// Mongoose connection state
let isConnected = false;

// Initialize Mongoose schema
const UserSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  picture: { type: String, default: '' },
  plan: { type: String, enum: ['free', 'pro', 'max'], default: 'free' },
  docsUsed: { type: Number, default: 0 },
  bonusDocs: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const MongooseUser = mongoose.models.User || mongoose.model('User', UserSchema);

export async function connectToDatabase(): Promise<'mongodb' | 'local'> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    ensureLocalDbExists();
    return 'local';
  }

  if (isConnected) return 'mongodb';

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    isConnected = true;
    return 'mongodb';
  } catch (error) {
    console.error('Failed to connect to MongoDB, using local fallback:', error);
    ensureLocalDbExists();
    return 'local';
  }
}

function ensureLocalDbExists() {
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify({ users: [] }, null, 2));
  }
}

function readLocalDb(): IUser[] {
  ensureLocalDbExists();
  try {
    const data = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    return parsed.users || [];
  } catch (err) {
    console.error('Error reading local DB file:', err);
    return [];
  }
}

function writeLocalDb(users: IUser[]) {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify({ users }, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local DB file:', err);
  }
}

// ── Database Operations ──

export async function findUserByGoogleId(googleId: string): Promise<IUser | null> {
  const dbType = await connectToDatabase();
  if (dbType === 'mongodb') {
    const user = await MongooseUser.findOne({ googleId });
    return user ? (user.toObject() as IUser) : null;
  } else {
    const users = readLocalDb();
    const user = users.find((u) => u.googleId === googleId);
    return user || null;
  }
}

export async function findUserByEmail(email: string): Promise<IUser | null> {
  const dbType = await connectToDatabase();
  if (dbType === 'mongodb') {
    const user = await MongooseUser.findOne({ email: email.toLowerCase() });
    return user ? (user.toObject() as IUser) : null;
  } else {
    const users = readLocalDb();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  }
}

export async function createUser(userData: {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
  plan?: 'free' | 'pro' | 'max';
  docsUsed?: number;
  bonusDocs?: number;
}): Promise<IUser> {
  const dbType = await connectToDatabase();
  const newUser: IUser = {
    googleId: userData.googleId,
    email: userData.email.toLowerCase(),
    name: userData.name,
    picture: userData.picture || '',
    plan: userData.plan || 'free',
    docsUsed: userData.docsUsed || 0,
    bonusDocs: userData.bonusDocs || 0,
    createdAt: new Date(),
  };

  if (dbType === 'mongodb') {
    const userObj = new MongooseUser(newUser);
    await userObj.save();
    return userObj.toObject() as IUser;
  } else {
    const users = readLocalDb();
    // Prevent duplicates in local storage
    const filteredUsers = users.filter((u) => u.email.toLowerCase() !== newUser.email);
    filteredUsers.push(newUser);
    writeLocalDb(filteredUsers);
    return newUser;
  }
}

export async function updateUser(email: string, updates: Partial<Omit<IUser, 'email' | 'googleId'>>): Promise<IUser | null> {
  const dbType = await connectToDatabase();
  if (dbType === 'mongodb') {
    const user = await MongooseUser.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: updates },
      { new: true }
    );
    return user ? (user.toObject() as IUser) : null;
  } else {
    const users = readLocalDb();
    const userIdx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
    if (userIdx === -1) return null;

    users[userIdx] = {
      ...users[userIdx],
      ...updates,
    };
    writeLocalDb(users);
    return users[userIdx];
  }
}

export async function incrementDocsUsed(email: string): Promise<IUser | null> {
  const dbType = await connectToDatabase();
  if (dbType === 'mongodb') {
    const user = await MongooseUser.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $inc: { docsUsed: 1 } },
      { new: true }
    );
    return user ? (user.toObject() as IUser) : null;
  } else {
    const users = readLocalDb();
    const userIdx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
    if (userIdx === -1) return null;

    users[userIdx].docsUsed += 1;
    writeLocalDb(users);
    return users[userIdx];
  }
}

export async function addBonusDocs(email: string, amount: number): Promise<IUser | null> {
  const dbType = await connectToDatabase();
  if (dbType === 'mongodb') {
    const user = await MongooseUser.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $inc: { bonusDocs: amount } },
      { new: true }
    );
    return user ? (user.toObject() as IUser) : null;
  } else {
    const users = readLocalDb();
    const userIdx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
    if (userIdx === -1) return null;

    users[userIdx].bonusDocs += amount;
    writeLocalDb(users);
    return users[userIdx];
  }
}
