const app = require('../app');
const request = require('supertest');
const bcrypt = require('bcrypt');
const db = require('../db')
const tokenService = require('../service/token.service');
const UserDto = require('../dtos/user-dto');
const jwt = require('jsonwebtoken')

const testUser = {
    name: 'John',
    surname: 'Doe',
    phone: '+1234567890',
    gender_id: 1,
    password: 'password',
    email: 'john.doe@example.com',
  };

describe('Auth Service', () => {
    test('Регистрация', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send(testUser)
          .expect(201)
    
        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('refreshToken');
        expect(response.body.userDto).toEqual(
          expect.objectContaining({
            name: testUser.name,
            surname: testUser.surname,
            email: testUser.email,
          })
        );
    
        const dbResponse = await db.query(
          'SELECT * FROM users WHERE email = $1',
        [testUser.email]
        );
        expect(dbResponse.rows).toHaveLength(1);
        const dbUser = dbResponse.rows[0];
        expect(dbUser.name).toBe(testUser.name);
        expect(dbUser.surname).toBe(testUser.surname);
        expect(dbUser.phone).toBe(testUser.phone);
        expect(dbUser.gender_id).toBe(testUser.gender_id);
    
        const passwordMatch = await bcrypt.compare(
          testUser.password,
          dbUser.password
        );
        expect(passwordMatch).toBe(true);
    
        const refreshToken = response.body.refreshToken;
        const decodedToken = await tokenService.validateRefreshToken(refreshToken);
        expect(decodedToken.email).toBe(testUser.email);
    
        const dbRefreshTokenResponse = await db.query(
          'SELECT * FROM tokens WHERE user_id = $1',
          [dbUser.id]
        );
        expect(dbRefreshTokenResponse.rows).toHaveLength(1);
        const dbRefreshToken = dbRefreshTokenResponse.rows[0];
        expect(dbRefreshToken.token).toBe(refreshToken);

        const cookies = response.headers['set-cookie'][0]
        
        expect(cookies.match(/(?<=refreshToken=)[^;]*/g)[0]).toBe(refreshToken)
      })

      test('Логаут', async ()=>{
        const response = await request(app)
          .post('/api/auth/logout')
          .expect(200)
  
        const cookies = response.headers['set-cookie'][0]

        expect(cookies.match(/(?<=refreshToken=)[^;]*/g)[0]).toBe('')
      })

    test('Авторизация', async ()=>{
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200)
    })

    test('Валидный токен', async () => {
      const response1 = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200)
    
      const cookies = response1.headers['set-cookie'][0]
      const refreshToken = cookies.match(/(?<=refreshToken=)[^;]*/g)[0]

      await db.query("UPDATE users SET name = $1", ["Walter"])
    
      const response2 = await request(app)
        .get('/api/auth/refresh')
        .set('Cookie', `refreshToken=${refreshToken}`)
        .expect(200)

      expect(response2.body).toHaveProperty('accessToken');
      expect(response2.body).toHaveProperty('refreshToken');
      expect(response2.body.userDto).toEqual(
          expect.objectContaining({
              name: "Walter",
              surname: testUser.surname,
              email: testUser.email,
          })
      );
    })

    test('Отсутствие токена', async () => {
      const response = await request(app)
          .get('/api/auth/refresh')
          .expect(500);
      
      expect(response.body).toBe('Не авторизован x1');
  });
  
  test('Некоректный токен', async () => {
      const refreshToken = 'invalid_refresh_token';
      const response = await request(app)
          .get('/api/auth/refresh')
          .set('Cookie', `refreshToken=${refreshToken}`)
          .expect(500);
      
      expect(response.body).toBe('Не авторизован x2');
  });

})



afterAll(async ()=>{
  const user = await (await db.query("SELECT * FROM users WHERE email = $1",[testUser.email])).rows[0]
  await db.query("DELETE FROM tokens WHERE user_id = $1", [user.id])
  await db.query('DELETE FROM users WHERE id = $1',[user.id])

  await db.end()
  app.close()
})

