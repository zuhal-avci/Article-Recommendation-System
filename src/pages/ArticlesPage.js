import React, { useState, useEffect } from 'react';
import './ArticlesPage.css';
import {
    fetchNewsHeadlines,
    getRandomArticles,
    getPersonalizedRecommendations,
    searchArticles,
    addReadArticle
} from '../services/api';

const ArticlesPage = ({ userData }) => {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [randomArticles, setRandomArticles] = useState([]);
    const [personalizedArticles, setPersonalizedArticles] = useState([]);
    const [loadingArticles, setLoadingArticles] = useState(true);
    const [loadingPersonalized, setLoadingPersonalized] = useState(true);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [headlines, setHeadlines] = useState([]);
    const [isSpinning, setIsSpinning] = useState(false);

    
    const saveReadArticle = async (articleId) => {
        const userId = userData?.id;
        const readAt = new Date().toISOString();

        if (userId && articleId) {
            try {
                await addReadArticle(userId, articleId, readAt);
                console.log(`Makale ${articleId} başarıyla okundu olarak kaydedildi.`);
            } catch (error) {
                console.error("Okunan makale kaydedilemedi:", error);
                
            }
        } else {
            console.warn("Kullanıcı girişi yapılmadığı veya makale ID'si eksik olduğu için okunan makale kaydedilemedi.");
        }
    };

    
    const fetchRandomArticles = async () => {
        setIsSpinning(true);
        setLoadingArticles(true);
        try {
            const data = await getRandomArticles();
            setRandomArticles(data);
        } catch (error) {
            console.error('Rastgele makaleler alınırken hata:', error);
            setRandomArticles([]);
        } finally {
            setLoadingArticles(false);
            setIsSpinning(false);
        }
    };

    // Kişiselleştirilmiş makaleleri getiren fonksiyon
    const fetchPersonalizedArticles = async () => {
        setLoadingPersonalized(true);
        const userId = userData?.id;

        if (userId) {
            try {
                const data = await getPersonalizedRecommendations(userId);
                setPersonalizedArticles(data);
            } catch (error) {
                console.error("Kişisel makaleler alınamadı:", error);
                setPersonalizedArticles([]);
            }
        } else {
            console.log("Kişiye özel makaleler için kullanıcı kimliği bulunamadı veya kullanıcı girişi yapılmadı.");
            setPersonalizedArticles([]);
        }
        setLoadingPersonalized(false);
    };

    // Arama fonksiyonu
    const handleSearch = async () => {
        if (!query.trim()) return;

        setLoadingSearch(true);
        try {
            const data = await searchArticles(query);
            setSearchResults(data);
            setShowSearchResults(true);
        } catch (error) {
            console.error('Arama yapılırken hata:', error);
            setSearchResults([]);
        } finally {
            setLoadingSearch(false);
        }
    };

    const handleBack = () => {
        setShowSearchResults(false);
        setQuery('');
        setSearchResults([]);
    };

    // İlk yüklemede ve kullanıcı kimliği (id) değiştiğinde veri çekmek için useEffect
    useEffect(() => {
        fetchRandomArticles();
        fetchNewsHeadlines().then(setHeadlines);

        if (userData?.id) {
            fetchPersonalizedArticles();
        } else {
            setPersonalizedArticles([]);
            setLoadingPersonalized(false);
        }
    }, [userData?.id]);

    return (
        <div className="articles-page">
            <h1 className="page-title">Makale Öneri Sistemi</h1>
            <div className="welcome-text">Merhaba, {userData?.username || 'Misafir'}</div>

            <div className="search-section">
                <input
                    className="search-input"
                    type="text"
                    placeholder="Makale ara..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button className="search-button" onClick={showSearchResults ? handleBack : handleSearch} disabled={loadingSearch}>
                    {loadingSearch ? 'Aranıyor...' : (showSearchResults ? 'Geri Dön' : 'Ara')}
                </button>
            </div>

            <div className={`content-wrapper ${showSearchResults ? 'post-search' : 'pre-search'}`}>
                {/* Sol kutu - Gündem */}
                <div className="left-box news-box">
                    <h3>📢 Gündem</h3>
                    <ul>
                        {headlines.length > 0 ? (
                            headlines.map((news, i) => (
                                <li key={news.url || i}>
                                    <a href={news.url} target="_blank" rel="noopener noreferrer">
                                        {news.title}
                                    </a>
                                </li>
                            ))
                        ) : (
                            <li>Yükleniyor...</li>
                        )}
                    </ul>
                </div>

                {/* Orta kutu */}
                {showSearchResults ? (
                    <div className="center-content article-list">
                        <h3>🔍 Arama Sonuçları</h3>
                        <ul>
                            {loadingSearch ? (
                                <li>Aranıyor...</li>
                            ) : searchResults.length > 0 ? (
                                searchResults.map((article) => (
                                    <li key={article.id}>
                                        <a
                                            href={article.url || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            // Tıklamada okundu kaydet, sonra URL'ye yönlendir
                                            onClick={() => saveReadArticle(article.id)}
                                        >
                                            {article.title || 'Başlık yok'}
                                        </a>
                                    </li>
                                ))
                            ) : (
                                <li>Sonuç bulunamadı</li>
                            )}
                        </ul>
                    </div>
                ) : (
                    <div className="center-box suggestion-box">
                        <div className="center-box-header">
                            <h3> 🌀 Önerilen Makaleler</h3>
                            <span
                                className={`refresh-icon ${isSpinning ? 'spin' : ''}`}
                                title="Yenile"
                                onClick={fetchRandomArticles}
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => { if (e.key === 'Enter') fetchRandomArticles(); }}
                            >
                                &#x21bb;
                            </span>
                        </div>
                        <ul>
                            {loadingArticles ? (
                                <li>Yükleniyor...</li>
                            ) : randomArticles.length > 0 ? (
                                randomArticles.map((article) => (
                                    <li key={article.id}>
                                        <a
                                            href={article.url || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            // Tıklamada okundu kaydet, sonra URL'ye yönlendir
                                            onClick={() => saveReadArticle(article.id)}
                                        >
                                            {article.title || 'Başlık yok'}
                                        </a>
                                    </li>
                                ))
                            ) : (
                                <li>Makale bulunamadı</li>
                            )}
                        </ul>
                    </div>
                )}

                {/* Sağ kutu - Kişiye Özel Makaleler */}
                <div className="right-box personalized-box">
                    <h3>🎯 Kişiye Özel Makaleler</h3>
                    <ul>
                        {loadingPersonalized ? (
                            <li style={{ color: 'gray' }}>Yükleniyor...</li>
                        ) : personalizedArticles.length > 0 ? (
                            personalizedArticles.map((item) => (
                                <li key={item.article?.id || item.id || Math.random()}>
                                    {item.article && item.article.title ? (
                                        <a
                                            href={item.article.url || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            // Tıklamada okundu kaydet, sonra URL'ye yönlendir
                                            onClick={() => saveReadArticle(item.article.id)}
                                        >
                                            {item.article.title}
                                        </a>
                                    ) : (
                                        <span style={{ color: 'gray' }}>Başlık bilgisi eksik</span>
                                    )}
                                </li>
                            ))
                        ) : (
                            <li style={{ color: 'gray' }}>Kişiye özel öneriler bulunamadı veya kullanıcı girişi yapılmadı.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ArticlesPage;