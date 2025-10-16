import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../db';

export const register = async (req: Request, res: Response) => {
  const { email, password, role = 'OPERATOR', name } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const result = await query(
      'INSERT INTO users (email, password_hash, role, name) VALUES ($1,$2,$3,$4) RETURNING id,email,role,name',
      [email, hash, role, name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: 'Could not register', details: err });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userRes = await query('SELECT * FROM users WHERE email=$1', [email]);
  const user = userRes.rows[0];
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const secret = process.env.JWT_SECRET || 'dev-secret';
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, secret, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
};
