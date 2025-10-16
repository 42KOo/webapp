import React, { useRef, useEffect } from 'react';
import { BrowserMultiFormatReader, BarcodeFormat } from '@zxing/library';

type Props = { onDetected: (code: string) => void };

const BarcodeScannerWeb: React.FC<Props> = ({ onDetected }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReader.listVideoInputDevices()
      .then((videoInputDevices) => {
        const deviceId = videoInputDevices[0]?.deviceId;
        if (videoRef.current) {
          codeReader.decodeOnceFromVideoDevice(deviceId!, videoRef.current)
            .then((result) => {
              onDetected(result.getText());
              codeReader.reset();
            })
            .catch((err) => console.error(err));
        }
      })
      .catch(console.error);

    return () => codeReader.reset();
  }, [onDetected]);

  return <video ref={videoRef} style={{ width: '100%', maxHeight: 400 }} />;
};

export default BarcodeScannerWeb;
