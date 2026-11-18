import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function fetchFeed() {
  const response = await apiClient.get('/feed');
  return response.data;
}

export async function submitSwipe(profileId, action) {
  const response = await apiClient.post('/swipe', {
    profileId,
    action,
  });
  return response.data;
}

export async function fetchMatches() {
  const response = await apiClient.get('/matches');
  return response.data;
}

export async function resetDiscovery() {
  const response = await apiClient.post('/reset');
  return response.data;
}
