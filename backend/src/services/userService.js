import { getKnex } from '../utils/knex.js';

const knex = await getKnex();

export async function fetchUsers() {
  const users = await knex('users');
  return users;
}

export async function fetchTokens() {
  const tokens = await knex('tokens');
  return tokens;
}
