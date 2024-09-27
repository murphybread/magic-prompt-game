import axios from 'axios';

const API_URL = window._env_ ? window._env_.REACT_APP_API_URL : 'https://8db49593-86bc-4024-9db9-f98d410662af-00-19a9705pix41f.picard.replit.dev:8008/api';

const authAxios = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

export const calculateManaCost = async (spellLevel, modifiers) => {
  const response = await authAxios.post('/game/calculate-mana-cost', { spellLevel, modifiers });
  return response.data;
};

export const castSpell = async (spellName, manaCost) => {
  const response = await authAxios.post('/game/cast-spell', { spellName, manaCost });
  return response.data;
};

export const getUserMana = async () => {
  const response = await authAxios.get('/game/user-mana');
  return response.data;
};
