import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = ({ userData }) => {
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const openModal = () => {
    setModalOpen(true);
    setMessage(null);
    setError(null);
    setOldPassword("");
    setNewPassword("");
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handlePasswordReset = async () => {
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setOldPassword("");
        setNewPassword("");
      } else {
        setError(data.detail || "Bir hata oluştu");
      }
    } catch (err) {
      setError("Sunucuya bağlanırken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">👤 Profil Bilgileri</h2>
      <div className="profile-card">
        <p><strong>Kullanıcı Adı:</strong> {userData?.username}</p>
        <p><strong>E-posta:</strong> {userData?.email}</p>
        <button className="reset-button" onClick={openModal}>
          Şifreyi Sıfırla
        </button>
      </div>

      {/* Sadece Okunan Makaleler Butonu */}
      <div className="profile-buttons single-button-container">
        <button className="profile-button modern-button" onClick={() => navigate('/read')}>
          Okunan Makaleler
        </button>
      </div>

      {modalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Şifre Sıfırlama</h3>

            <input
              type="password"
              placeholder="Eski Şifre"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Yeni Şifre"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button onClick={handlePasswordReset} disabled={loading}>
              {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
            </button>

            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <button className="modal-close" onClick={closeModal}>
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
