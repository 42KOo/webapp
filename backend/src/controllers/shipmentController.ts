import { Request, Response } from 'express';
import { query } from '../db';
import { v4 as uuidv4 } from 'uuid';

const calcVolumetric = (d: any) => {
  if (!d) return null;
  const L = Number(d.length || 0);
  const W = Number(d.width || 0);
  const H = Number(d.height || 0);
  return (L * W * H * 200) / 1000000;
};

export const createShipment = async (req: any, res: Response) => {
  const { barcode, dimensions, status = 'kreiran' } = req.body;
  const userId = req.user.id;
  const volumetric_weight = calcVolumetric(dimensions);
  try {
    const id = uuidv4();
    await query(
      'INSERT INTO shipments (id, barcode, user_id, status, dimensions, volumetric_weight) VALUES ($1,$2,$3,$4,$5,$6)',
      [id, barcode, userId, status, dimensions, volumetric_weight]
    );
    res.json({ id, barcode, dimensions, volumetric_weight, status });
  } catch (err) {
    res.status(500).json({ error: 'Could not create shipment', details: err });
  }
};

export const listShipments = async (req: any, res: Response) => {
  const user = req.user;
  try {
    if (user.role === 'ADMIN') {
      const r = await query('SELECT * FROM shipments ORDER BY created_at DESC');
      return res.json(r.rows);
    } else {
      const r = await query('SELECT * FROM shipments WHERE user_id=$1 ORDER BY created_at DESC', [user.id]);
      return res.json(r.rows);
    }
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch shipments', details: err });
  }
};

export const updateShipment = async (req: any, res: Response) => {
  const { id } = req.params;
  const { barcode, dimensions, status, updated_at } = req.body;
  try {
    const current = await query('SELECT updated_at FROM shipments WHERE id=$1', [id]);
    if (current.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    const currentUpdated = new Date(current.rows[0].updated_at).getTime();
    const incomingUpdated = updated_at ? new Date(updated_at).getTime() : Date.now();
    if (incomingUpdated < currentUpdated) {
      return res.status(409).json({ error: 'Conflict: current record is newer' });
    }
    const volumetric_weight = calcVolumetric(dimensions);
    await query('UPDATE shipments SET barcode=$1, dimensions=$2, status=$3, volumetric_weight=$4, updated_at=now() WHERE id=$5',
      [barcode, dimensions, status, volumetric_weight, id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Could not update', details: err });
  }
};
