import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import api from '../api/api';

export default function ScannerScreen({ navigation }: any) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: any) => {
    setScanned(true);
    api.post('/shipments', { barcode: data, dimensions: { length: 0, width: 0, height: 0 }, status: 'kreiran' })
      .then(() => Alert.alert('Poslano', data))
      .catch(() => Alert.alert('Offline', 'Nije poslao, offline logika nije implementirana'));
  };

  if (hasPermission === null) return <Text>Traženje dozvole...</Text>;
  if (hasPermission === false) return <Text>Nema pristupa kameri</Text>;

  return (
    <View style={{ flex: 1 }}>
      <BarCodeScanner onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} style={{ flex: 1 }} />
      {scanned && <Button title={'Skeniraj ponovno'} onPress={() => setScanned(false)} />}
    </View>
  );
}
