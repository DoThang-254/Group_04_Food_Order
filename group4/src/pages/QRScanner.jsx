import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';

const QRScanner = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: 250,
      fps: 10,
    });

    scanner.render(
      (result) => {
        console.log('QR Code detected:', result);
        scanner.clear();
        navigate('/success'); // Chuyển hướng sau khi quét thành công
      },
      (error) => {
        // console.log('Scan error', error); // Có thể tắt log này nếu cần
      }
    );

    // Cleanup
    return () => {
      scanner.clear().catch((error) => {
        console.error('Cleanup failed', error);
      });
    };
  }, [navigate]);

  return (
    <div>
      <h2>Quét mã QR</h2>
      <div id="reader" style={{ width: '100%' }}></div>
    </div>
  );
};

export default QRScanner;
