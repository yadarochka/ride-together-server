const { Pool } = require('pg');

require("dotenv").config();

const db = new Pool({
    user: process.env.TEST_DATABASE_USER,
    password: process.env.TEST_DATABASE_PASSWORD,
    host: process.env.TEST_DATABASE_HOST,
    port: process.env.TEST_DATABASE_PORT,
    database: process.env.TEST_DATABASE_NAME,
  });

const saveRefreshToken = async (userId, refreshToken) => {
    const tokenData = (await db.query("SELECT token FROM tokens WHERE user_id = $1", [userId])).rows[0]
    
    if (tokenData){
        await db.query("UPDATE tokens SET token = $1 WHERE user_id = $2", [refreshToken, userId])
    }
    else{
        await db.query("INSERT INTO tokens (user_id, token) VALUES ($1, $2)", [userId, refreshToken])
    }

}

const testUser = {
    name: 'John',
    surname: 'Doe',
    phone: '+1234567890',
    gender_id: 1,
    password: 'password',
    email: 'john.doe@example.com',
  };

beforeAll(async ()=>{
    const activationLink = ''
    await db.query(
        `INSERT INTO users (name, surname, phone, password, gender_id, email, activation_link, is_activate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [testUser.name, testUser.surname, testUser.phone, testUser.password, testUser.gender_id, testUser.email, activationLink, false]
      );
})

// Clear the tokens table before each test
beforeEach(async () => {
  await db.query('DELETE FROM tokens');
});

describe('saveRefreshToken', () => {
  it('should insert a new token for a user with no existing tokens', async () => {
    const userId = (await db.query('SELECT id FROM users WHERE email = $1', [testUser.email])).rows[0].id;
    const refreshToken = 'abc123';
    await saveRefreshToken(userId, refreshToken);
    const result = await db.query('SELECT * FROM tokens WHERE user_id = $1', [userId]);
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].token).toBe(refreshToken);
  });

  it('should update an existing token for a user with an existing token', async () => {
    const userId = (await db.query('SELECT id FROM users WHERE email = $1', [testUser.email])).rows[0].id;
    const oldToken = 'oldToken';
    const newToken = 'newToken';
    await db.query('INSERT INTO tokens (user_id, token) VALUES ($1, $2)', [userId, oldToken]);
    await saveRefreshToken(userId, newToken);
    const result = await db.query('SELECT * FROM tokens WHERE user_id = $1', [userId]);
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].token).toBe(newToken);
  });
});

afterAll( async ()=>{
    await db.query('DELETE FROM tokens');
    await db.query('DELETE FROM users');
    await db.end()
})