import request from 'supertest';
import app from '../src/app';

describe('Shipments Export Excel', () => {
  it('should return excel file for admin', async () => {
    const res = await request(app)
      .get('/api/shipments/export?format=excel')
      .set('Authorization', 'Bearer ADMIN_FAKE_TOKEN');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  });

  it('should return 401 for unauthenticated', async () => {
    const res = await request(app).get('/api/shipments/export?format=excel');
    expect(res.statusCode).toBe(401);
  });

  it('should return 400 for unknown format', async () => {
    const res = await request(app)
      .get('/api/shipments/export?format=txt')
      .set('Authorization', 'Bearer ADMIN_FAKE_TOKEN');
    expect(res.statusCode).toBe(400);
  });
});
