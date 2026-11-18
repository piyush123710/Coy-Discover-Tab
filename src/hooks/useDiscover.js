import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import {
  fetchFeed,
  fetchMatches,
  resetDiscovery,
  submitSwipe,
} from '../services/api.js';

export function useDiscover() {
  const [profiles, setProfiles] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [totalProfiles, setTotalProfiles] = useState(0);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [activeMatch, setActiveMatch] = useState(null);
  const [isResetting, setIsResetting] = useState(false);

  const loadDiscoverData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [feedData, matchesData] = await Promise.all([
        fetchFeed(),
        fetchMatches(),
      ]);
      setProfiles(feedData.profiles);
      setCurrentUser(feedData.currentUser);
      setTotalProfiles(feedData.totalProfiles);
      setMatches(matchesData.matches);
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error || 'Could not reach the discovery server.'
        : 'Unexpected error loading discovery profiles.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDiscoverData();
  }, [loadDiscoverData]);

  const performSwipe = useCallback(
    async (profileId, action) => {
      if (isSwiping) return;
      setIsSwiping(true);
      setError(null);

      try {
        const result = await submitSwipe(profileId, action);
        setProfiles((prev) => prev.filter((p) => p.id !== profileId));

        if (result.isMatch && result.match) {
          const newMatch = result.match;
          setMatches((prev) => {
            if (prev.some((m) => m.id === newMatch.id)) {
              return prev;
            }
            return [newMatch, ...prev];
          });
          setActiveMatch(newMatch);
        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 409) {
          setProfiles((prev) => prev.filter((p) => p.id !== profileId));
        } else {
          const message = axios.isAxiosError(err)
            ? err.response?.data?.error || 'Failed to save your swipe. Please try again.'
            : 'Failed to save your swipe.';
          setError(message);
        }
      } finally {
        setIsSwiping(false);
      }
    },
    [isSwiping],
  );

  const dismissMatchModal = useCallback(() => {
    setActiveMatch(null);
  }, []);

  const resetDemo = useCallback(async () => {
    setIsResetting(true);
    setError(null);
    try {
      const data = await resetDiscovery();
      setProfiles(data.profiles);
      setCurrentUser(data.currentUser);
      setTotalProfiles(data.totalProfiles);
      setMatches([]);
      setActiveMatch(null);
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error || 'Could not reset discovery state.'
        : 'Could not reset discovery state.';
      setError(message);
    } finally {
      setIsResetting(false);
    }
  }, []);

  return {
    profiles,
    currentUser,
    totalProfiles,
    matches,
    loading,
    error,
    isSwiping,
    isResetting,
    activeMatch,
    performSwipe,
    dismissMatchModal,
    retry: loadDiscoverData,
    resetDemo,
  };
}
