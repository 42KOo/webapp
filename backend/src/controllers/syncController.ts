import { Request, Response } from 'express';
import { query } from '../db';

export const handleSync = async (req: any, res: Response) => {
  const { changes } = req.body;
  const userId = req.user.id;
  const results: any[] = [];
  for (const change of changes || []) {
    try {
      if (change.action === 'create') {
        const { barcode, dimensions, status } = change.payload;
        const volumetric_weight = (dimensions && dimensions.length) ? (dimensions.length * dimensions.width * dimensions.height * 200) / 1000000 : null;
        const r = await query('INSERT INTO shipments (barcode,user_id,status,dimensions,volumetric_weight) VALUES ($1,$2,$3,$4,$5) RETURNING id', [barcode, userId, status, dimensions, volumetric_weight]);
        results.push({ ok: true, id: r.rows[0].id });
      } else if (change.action === 'update') {
        const { id, barcode, dimensions, status, updated_at } = change.payload;
        const current = await query('SELECT updated_at FROM shipments WHERE id=$1', [id]);
        if (current.rows.length === 0) { results.push({ ok: false, id, error: 'Not found' }); continue; }
        const currentUpdated = new Date(current.rows[0].updated_at).getTime();
        const incomingUpdated = updated_at ? new Date(updated_at).getTime() : Date.now();
        if (incomingUpdated < currentUpdated) { results.push({ ok: false, id, error: 'Conflict' }); continue; }
        const volumetric_weight = (dimensions && dimensions.length) ? (dimensions.length * dimensions.width * dimensions.height * 200) / 1000000 : null;
        await query('UPDATE shipments SET barcode=$1, dimensions=$2, status=$3, volumetric_weight=$4, updated_at=now() WHERE id=$5', [barcode, dimensions, status, volumetric_weight, id]);
        results.push({ ok: true, id });
      } else {
        results.push({ ok: false, error: 'Unknown action' });
      }
    } catch (err: any) {
      results.push({ ok: false, error: err.message });
    }
  }

  await query('INSERT INTO sync_logs (user_id, action, payload) VALUES ($1,$2,$3)', [userId, 'sync', { changes }]);
  res.json({ results });
};
