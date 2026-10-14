import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';

const HomeIcon = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = () => {
        if (location.pathname === '/') return;
        navigate('/');
    };

    return (
        <div
            onClick={handleClick}
            title="Ana Sayfaya Dön"
            style={{
                position: 'absolute',
                top: '20px',
                right: '140px',
                zIndex: 1000,
                backgroundColor: 'white',
                borderRadius: '50%',
                padding: '8px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                width: '32px',  // kutu genişliği
                height: '32px', // kutu yüksekliği
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Home color="black" size={28} />
        </div>
    );
};

export default HomeIcon;
