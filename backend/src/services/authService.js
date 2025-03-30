import * as crypto from 'node:crypto';
import Joi from 'joi';
import { getKnex } from '../utils/knex.js';

const knex = await getKnex();

export async function addUser(email, password_hash) {
  const created_at = new Date();

  const user = await knex('users')
    .insert({
      email,
      password_hash,
      created_at,
    })
    .returning('*');

  return user;
}

export async function createToken(user_id) {
  const token = crypto.randomBytes(20).toString('hex');
  const created_at = new Date();
  const expires_at = new Date(created_at.getTime() + 24 * 60 * 60 * 1000);

  await knex('tokens').insert({
    user_id,
    token,
    expires_at,
    created_at,
  });

  return token;
}

export async function fetchCurrentUser(token) {
  const {
    rows: [userInfo],
  } = await knex.raw(
    `
        select * from tokens
        inner join users
          on users.id = tokens.user_id
        where tokens.token = ?
      `,
    [token],
  );

  return userInfo;
}

export async function getUserByEmail(email) {
  const knex = await getKnex();
  return knex('users').where({ email }).first();
}
