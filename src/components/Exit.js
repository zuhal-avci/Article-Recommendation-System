import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const Exit = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <div style={{
            position: 'absolute', // fixed → absolute
            top: '20px',
            right: '80px',
            zIndex: 1000,
            backgroundColor: 'white',
            borderRadius: '50%',
            padding: '8px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer'
        }}>
            <div onClick={handleLogout}>
                <LogOut color="black" size={28} />
            </div>
        </div>
    );
};

export default Exit;