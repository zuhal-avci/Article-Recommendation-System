// src/components/ReadArticlesPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReadArticlesByUserId } from '../services/api'; // Yeni API fonksiyonu import edildi
import './ReadArticlesPage.css'; // Yeni CSS dosyası için import

const ReadArticlesPage = ({ userData }) => {
    const [readArticles, setReadArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReadArticles = async () => {
            if (!userData || !userData.id) {
                setError("Kullanıcı bilgisi bulunamadı. Lütfen giriş yapın.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                // Backend'den okunan makaleleri çekiyoruz
                const data = await getReadArticlesByUserId(userData.id);
                // Backend'den gelen veri zaten last_read_at'e göre sıralı olacak
                setReadArticles(data);
            } catch (err) {
                console.error("Okunan makaleler alınırken hata:", err);
                setError("Okunan makaleler yüklenirken bir sorun oluştu.");
            } finally {
                setLoading(false);
            }
        };

        fetchReadArticles();
    }, [userData]); // userData değiştiğinde (örneğin kullanıcı girişi yapıldığında) yeniden çek

    return (
        <div className="read-articles-container">
            <h2 className="read-articles-title">📖 Okunan Makaleler</h2>
            <button className="back-to-profile-button" onClick={() => navigate('/profile')}>
                Profilime Geri Dön
            </button>

            {loading && <p className="loading-message">Okunan makaleler yükleniyor...</p>}
            {error && <p className="error-message">{error}</p>}

            {!loading && !error && readArticles.length === 0 && (
                <p className="no-articles-message">Henüz okunmuş makaleniz bulunmamaktadır.</p>
            )}

            {!loading && !error && readArticles.length > 0 && (
                <ul className="read-articles-list">
                    {readArticles.map((articleData) => (
                        <li key={articleData.id} className="read-article-item">
                            <h4 className="article-item-title">
                                <a href={articleData.url} target="_blank" rel="noopener noreferrer">
                                    {articleData.title}
                                </a>
                            </h4>
                            <p className="article-item-details">
                                <span className="read-count">Okuma Sayısı: {articleData.read_count}</span>
                                {articleData.last_read_at && ( // last_read_at kontrolü
                                    <span className="last-read">
                                        Son Okuma: {new Date(articleData.last_read_at).toLocaleString()}
                                    </span>
                                )}
                                {articleData.rating !== null && ( // Rating kontrolü
                                    <span className="rating">Puanınız: {articleData.rating}/5</span>
                                )}
                            </p>
                            <p className="article-item-abstract">{articleData.abstract?.substring(0, 150)}...</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ReadArticlesPage;