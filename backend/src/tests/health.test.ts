import request from 'supertest';
import app from '../app';

describe('Health Check', () => {
  it('should return status UP', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ status: 'UP' });
  });
});
