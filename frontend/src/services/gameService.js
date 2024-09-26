import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

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
