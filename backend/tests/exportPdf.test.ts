import request from 'supertest';
import app from '../src/app';

describe('Shipments Export PDF', () => {
  it('should return pdf file for admin', async () => {
    const res = await request(app)
      .get('/api/shipments/export?format=pdf')
      .set('Authorization', 'Bearer ADMIN_FAKE_TOKEN');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toBe('application/pdf');
  });
});
