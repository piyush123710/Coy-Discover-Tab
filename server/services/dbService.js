import fs from 'fs/promises';
import path from 'path';
import { createInitialDatabase } from '../data/seed.js';

const DB_DIR = path.resolve(process.cwd(), 'server', 'data');
const DB_PATH = path.join(DB_DIR, 'db.json');

let writeQueue = Promise.resolve();

function enqueueWrite(task) {
  const result = writeQueue.then(task);
  writeQueue = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}

async function atomicWriteDb(data) {
  await fs.mkdir(DB_DIR, { recursive: true });
  const tempPath = `${DB_PATH}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  await fs.rename(tempPath, DB_PATH);
}

export async function ensureDatabaseInitialized() {
  await fs.mkdir(DB_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(DB_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      !Array.isArray(parsed.profiles) ||
      !Array.isArray(parsed.incomingLikes) ||
      !Array.isArray(parsed.swipes) ||
      !Array.isArray(parsed.matches) ||
      !parsed.currentUser
    ) {
      throw new Error('Invalid db.json shape');
    }
    return parsed;
  } catch {
    const initial = createInitialDatabase();
    await atomicWriteDb(initial);
    return initial;
  }
}

export async function readDb() {
  return ensureDatabaseInitialized();
}

export class DuplicateSwipeError extends Error {
  constructor(profileId) {
    super(`Profile "${profileId}" has already been swiped.`);
    this.name = 'DuplicateSwipeError';
  }
}

export class ProfileNotFoundError extends Error {
  constructor(profileId) {
    super(`Profile "${profileId}" was not found.`);
    this.name = 'ProfileNotFoundError';
  }
}

export async function getFeedData() {
  const db = await readDb();
  const swipedIds = new Set(db.swipes.map((s) => s.profileId));

  // Return ONLY unswiped profiles. Never attach incomingLikes or any private flags.
  const unswipedProfiles = db.profiles
    .filter((profile) => !swipedIds.has(profile.id))
    .map((profile) => ({
      id: profile.id,
      name: profile.name,
      age: profile.age,
      photo: profile.photo,
      bio: profile.bio,
      location: profile.location,
      interests: [...profile.interests],
    }));

  return {
    profiles: unswipedProfiles,
    currentUser: db.currentUser,
    totalProfiles: db.profiles.length,
    remainingCount: unswipedProfiles.length,
  };
}

export async function recordSwipeAction(profileId, action) {
  return enqueueWrite(async () => {
    const db = await readDb();

    const targetProfile = db.profiles.find((p) => p.id === profileId);
    if (!targetProfile) {
      throw new ProfileNotFoundError(profileId);
    }

    const alreadySwiped = db.swipes.some((s) => s.profileId === profileId);
    if (alreadySwiped) {
      throw new DuplicateSwipeError(profileId);
    }

    const now = new Date().toISOString();
    db.swipes.push({
      profileId,
      action,
      createdAt: now,
    });

    let createdMatch = null;
    const isMutualLike = action === 'like' && db.incomingLikes.includes(profileId);

    if (isMutualLike) {
      const existingMatch = db.matches.find((m) => m.profile.id === profileId);
      if (!existingMatch) {
        createdMatch = {
          id: `match_${profileId}`,
          profile: {
            id: targetProfile.id,
            name: targetProfile.name,
            age: targetProfile.age,
            photo: targetProfile.photo,
            bio: targetProfile.bio,
            location: targetProfile.location,
            interests: [...targetProfile.interests],
          },
          matchedAt: now,
        };
        db.matches.unshift(createdMatch);
      }
    }

    await atomicWriteDb(db);

    const swipedIds = new Set(db.swipes.map((s) => s.profileId));
    const remainingCount = db.profiles.filter((p) => !swipedIds.has(p.id)).length;

    return {
      isMatch: Boolean(createdMatch),
      match: createdMatch,
      remainingCount,
    };
  });
}

export async function getMutualMatches() {
  const db = await readDb();
  return [...db.matches].sort(
    (a, b) => new Date(b.matchedAt).getTime() - new Date(a.matchedAt).getTime(),
  );
}

export async function resetDiscoveryState() {
  return enqueueWrite(async () => {
    const db = await readDb();
    db.swipes = [];
    db.matches = [];
    await atomicWriteDb(db);
  });
}
