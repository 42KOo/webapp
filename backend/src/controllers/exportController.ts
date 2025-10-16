import { Request, Response } from 'express';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { query } from '../db';

// helper to fetch shipments depending on role
const fetchShipmentsForUser = async (user: any) => {
  if (user.role === 'ADMIN') {
    const r = await query('SELECT * FROM shipments ORDER BY created_at DESC');
    return r.rows;
  } else {
    const r = await query('SELECT * FROM shipments WHERE user_id=$1 ORDER BY created_at DESC', [user.id]);
    return r.rows;
  }
};

export const exportShipments = async (req: any, res: Response) => {
  const format = (req.query.format || 'excel').toString().toLowerCase();
  const user = req.user;
  const data = await fetchShipmentsForUser(user);

  if (format === 'excel' || format === 'xlsx') {
    const wb = new ExcelJS.Workbook();
    const sheet = wb.addWorksheet('Shipments');
    sheet.columns = [
      { header: 'ID', key: 'id', width: 36 },
      { header: 'Barcode', key: 'barcode', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Volumetric Weight', key: 'volumetric_weight', width: 18 },
      { header: 'Dimensions', key: 'dimensions', width: 30 },
      { header: 'Created At', key: 'created_at', width: 22 },
    ];
    data.forEach((row:any) => {
      sheet.addRow({
        id: row.id,
        barcode: row.barcode,
        status: row.status,
        volumetric_weight: row.volumetric_weight,
        dimensions: row.dimensions ? JSON.stringify(row.dimensions) : '',
        created_at: row.created_at
      });
    });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="shipments.xlsx"');
    await wb.xlsx.write(res);
    res.end();
    return;
  }

  if (format === 'pdf') {
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="shipments.pdf"');
    doc.pipe(res);
    doc.fontSize(18).text('Kubiciranje Paleta - Shipments', { align: 'center' });
    doc.moveDown();
    data.forEach((row:any) => {
      doc.fontSize(12).text(`ID: ${row.id}`);
      doc.text(`Barcode: ${row.barcode}    Status: ${row.status}    Volumetric: ${row.volumetric_weight}`);
      doc.text(`Dimensions: ${row.dimensions ? JSON.stringify(row.dimensions) : '-'}`);
      doc.text(`Created: ${row.created_at}`);
      doc.moveDown();
    });
    doc.end();
    return;
  }

  res.status(400).json({ error: 'Unknown format' });
};
