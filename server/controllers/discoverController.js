import {
  DuplicateSwipeError,
  getFeedData,
  getMutualMatches,
  ProfileNotFoundError,
  recordSwipeAction,
  resetDiscoveryState,
} from '../services/dbService.js';

export async function handleGetFeed(_req, res) {
  try {
    const feed = await getFeedData();
    res.json(feed);
  } catch (error) {
    console.error('Error reading discovery feed:', error);
    res.status(500).json({ error: 'Unable to load discovery feed.' });
  }
}

export async function handlePostSwipe(req, res) {
  try {
    const { profileId, action } = req.body || {};

    if (typeof profileId !== 'string' || !profileId.trim()) {
      res.status(400).json({ error: 'A valid profileId is required.' });
      return;
    }

    if (action !== 'like' && action !== 'pass') {
      res.status(400).json({ error: 'Action must be either "like" or "pass".' });
      return;
    }

    const result = await recordSwipeAction(profileId.trim(), action);
    res.status(200).json({
      success: true,
      profileId: profileId.trim(),
      action,
      isMatch: result.isMatch,
      match: result.match,
      remainingCount: result.remainingCount,
    });
  } catch (error) {
    if (error instanceof ProfileNotFoundError) {
      res.status(404).json({ error: error.message });
      return;
    }
    if (error instanceof DuplicateSwipeError) {
      res.status(409).json({ error: error.message, alreadySwiped: true });
      return;
    }
    console.error('Error recording swipe:', error);
    res.status(500).json({ error: 'Unable to record swipe action.' });
  }
}

export async function handleGetMatches(_req, res) {
  try {
    const matches = await getMutualMatches();
    res.json({ matches });
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'Unable to load mutual matches.' });
  }
}

export async function handlePostReset(_req, res) {
  try {
    await resetDiscoveryState();
    const feed = await getFeedData();
    res.json({ success: true, ...feed });
  } catch (error) {
    console.error('Error resetting discovery demo:', error);
    res.status(500).json({ error: 'Unable to reset discovery data.' });
  }
}
