import React, { useContext, useEffect, useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { useLocation, useNavigate } from 'react-router-dom';
import { decodeFakeToken } from '../data/token';
import { getOrders } from '../services/orders';
import { loginContext } from '../context/LoginContext';
import { Spinner } from 'react-bootstrap';
import { Html5QrcodeScanner } from 'html5-qrcode';

const MyQRCode = () => {
    const { token } = useContext(loginContext);
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);
    const [qrCode, setQrCode] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const scannerRef = useRef(null);

    useEffect(() => {
        const decode = async () => {
            const info = await decodeFakeToken(token);
            if (info) {
                if (!location.state?.orderId) {
                    navigate("/home");
                    return;
                }
                const res = await getOrders(location.state.orderId);
                const dataToEncode = {
                    orderId: res.id,
                    total: res.total,
                    items: res.items,
                    userName: info.name,
                    userId: info.id
                };
                setQrCode(JSON.stringify(dataToEncode));
                setUser(info);
            }
            setLoading(false);
        };
        decode();
    }, [token, location.state, navigate]);

    // Khởi tạo QR Scanner
    useEffect(() => {
        if (!loading && !scannerRef.current) {
            scannerRef.current = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: 250 },
                false
            );

            scannerRef.current.render(
                (decodedText, decodedResult) => {
                    console.log("✅ QR decoded:", decodedText);
                    try {
                        const data = JSON.parse(decodedText);
                        if (data.orderId) {
                            navigate(`/payment/${data.orderId}`, { state: data });
                        }
                    } catch (err) {
                        alert("❌ Không thể đọc được mã QR");
                    }
                },
                (errorMessage) => {
                    // console.log("QR error:", errorMessage);
                }
            );
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(err => console.error(err));
            }
        };
    }, [loading, navigate]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Mã QR của bạn</h2>
            <QRCode value={qrCode} size={256} />
            <p>Hãy dùng app ngân hàng để quét mã này</p>

            <hr />

            <h4>Quét mã QR tại đây</h4>
            <div id="reader" style={{ width: '300px', margin: '0 auto' }}></div>
        </div>
    );
};

export default MyQRCode;
