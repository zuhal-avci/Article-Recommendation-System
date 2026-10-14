import React from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

const ProfileIcon = () => {
  return (
    <div style={{
      position: 'absolute', // fixed → absolute
      top: '20px',
      right: '20px',
      zIndex: 1000,
      backgroundColor: 'white',
      borderRadius: '50%',
      padding: '8px',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer'
    }}>
      <Link to="/profile">
        <User color="green" size={28} />
      </Link>
    </div>
  );
};

export default ProfileIcon;