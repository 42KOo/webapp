import React, { useEffect, useState } from 'react';
import api from '../api/api';
import BarcodeScannerWeb from '../components/BarcodeScannerWeb';
import { initIdb } from '../idb/idb';

const Shipments: React.FC = () => {
  const [shipments, setShipments] = useState<any[]>([]);
  const [scanned, setScanned] = useState<string | null>(null);

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      const r = await api.get('/shipments');
      setShipments(r.data);
    } catch (err) {
      // ignore - maybe offline
      const db = await initIdb();
      const all = await db.getAll('shipments');
      setShipments(all || []);
    }
  };

  const onDetected = (code: string) => {
    setScanned(code);
  };

  const createLocal = async () => {
    const db = await initIdb();
    const id = `local-${Date.now()}`;
    const obj = { id, barcode: scanned, dimensions: { length:0, width:0, height:0}, status: 'kreiran', created_at: new Date().toISOString() };
    await db.put('shipments', obj);
    await db.add('outbox', { action: 'create', payload: obj });
    setShipments(prev => [obj, ...prev]);
    setScanned(null);
  };

  return (
  <>
    <div className="flex gap-2 mt-4">
      <button onClick={() => handleExport('excel')} className="px-4 py-2 bg-green-600 text-white rounded">📊 Export Excel</button>
      <button onClick={() => handleExport('pdf')} className="px-4 py-2 bg-red-600 text-white rounded">📄 Export PDF</button>
    </div>

    <div>
      <h2>Shipments</h2>
      <BarcodeScannerWeb onDetected={onDetected} />
      {scanned && (
        <div>
          <p>Skenirano: {scanned}</p>
          <button onClick={createLocal}>Sačuvaj i push na outbox</button>
        </div>
      )}

      <table>
        <thead><tr><th>Barcode</th><th>Status</th><th>Volumetrijska</th></tr></thead>
        <tbody>
          {shipments.map((s:any) => <tr key={s.id}><td>{s.barcode}</td><td>{s.status}</td><td>{s.volumetric_weight}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
};

const resolveConflict = async (local:any, server:any) => {
  // simple resolution: choose server (last_edit_wins) or ask user
  // For now, ask user via confirm (can be replaced with a nicer modal)
  const choose = window.confirm(`Conflict detected for ${local.id}. Choose LOCAL changes? OK = LOCAL, Cancel = SERVER`);
  return choose ? local : server;
};

const handleExport = async (format: 'excel' | 'pdf') => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${import.meta.env.VITE_API_URL}/shipments/export?format=${format}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error('Export failed');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shipments.${format === 'excel' ? 'xlsx' : 'pdf'}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (e) {
    alert('❌ Export failed. Check connection or permissions.');
  }
};

export default function ShipmentsWithExportWrapper(){ return <Shipments />;}

