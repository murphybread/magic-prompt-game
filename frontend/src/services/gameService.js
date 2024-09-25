import axios from 'axios';

const API_URL = 'http://localhost:8008/api/game';

const authAxios = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

export const calculateManaCost = async (spellLevel, modifiers) => {
  const response = await authAxios.post('/calculate-mana-cost', { spellLevel, modifiers });
  return response.data;
};

export const castSpell = async (spellName, manaCost) => {
  const response = await authAxios.post('/cast-spell', { spellName, manaCost });
  return response.data;
};
