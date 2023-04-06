import supertest from 'supertest';
import app from '../index';

const myFunc = (x: number) => x * x;

it('expect myFunc(5) to equal 25', () => {
  expect(myFunc(5)).toEqual(25);
});

const request = supertest(app);
describe('Test endpoint responses', () => {
  it('gets the api endpoint', async () => {
    const response = await request.get('/user');
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('john');
  });
});
