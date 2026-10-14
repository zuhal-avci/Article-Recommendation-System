import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ReadArticlesPage.css';
import { addRating } from '../services/api'; 

const API_URL_8000 = "http://localhost:8000";

const ReadArticlesPage = ({ userData }) => {
    const [readArticles, setReadArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [articleRatings, setArticleRatings] = useState({}); 

    useEffect(() => {
        if (!userData || !userData.id) {
            setError("Kullanıcı bilgisi bulunamadı. Lütfen giriş yapın.");
            setLoading(false);
            return;
        }

        const fetchReadArticlesAndRatings = async () => {
            setLoading(true);
            setError(null);
            try {
                
                const articlesResponse = await axios.get(`${API_URL_8000}/users/${userData.id}/read-articles`);
                const fetchedArticles = articlesResponse.data;
                console.log("Fetched Read Articles:", fetchedArticles);

                setReadArticles(fetchedArticles);

                
                const ratingsPromises = fetchedArticles.map(async (article) => {
                    if (article.article_id) {
                        try {
                            const ratingResponse = await axios.get(`${API_URL_8000}/rating`, {
                                params: {
                                    user_id: userData.id,
                                    article_id: article.article_id
                                }
                            });
                            

                            return { article_id: article.article_id, rating: ratingResponse.data.rating || null }; 
                        } catch (ratingError) {
                            
                            console.warn(`Makale ${article.article_id} için derecelendirme alınamadı.`, ratingError);
                            return { article_id: article.article_id, rating: null };
                        }
                    }
                    return { article_id: article.article_id, rating: null }; 
                });

                const allRatings = await Promise.all(ratingsPromises);

                
                const initialRatings = {};
                allRatings.forEach(item => {
                    
                    if (item.article_id && typeof item.rating === 'number') {
                        initialRatings[item.article_id] = item.rating;
                    }
                });
                setArticleRatings(initialRatings);

            } catch (err) {
                console.error("Okunan makaleler veya derecelendirmeler alınırken hata:", err);
                setError('Okunan makaleler yüklenirken bir sorun oluştu.');
            } finally {
                setLoading(false);
            }
        };

        fetchReadArticlesAndRatings();
    }, [userData]); 

    
    const handleRatingChange = async (articleId, newRating) => {
        const userId = userData?.id;

        if (!userId) {
            setError("Derecelendirme yapabilmek için lütfen giriş yapın.");
            return;
        }

        
        setArticleRatings(prevRatings => ({
            ...prevRatings,
            [articleId]: newRating
        }));

        try {
            
            await addRating(userId, articleId, newRating);
            console.log(`Makale ${articleId} için ${newRating} yıldız derecelendirildi.`);
        } catch (err) {
            console.error("Derecelendirme kaydedilirken hata:", err);
            setError('Derecelendirme kaydedilirken bir sorun oluştu.');
            
            setArticleRatings(prevRatings => {
                const updatedRatings = { ...prevRatings };
                
                const originalRating = readArticles.find(a => a.article_id === articleId)?.rating || articleRatings[articleId];

                if (typeof originalRating === 'number') {
                    updatedRatings[articleId] = originalRating;
                } else {
                    delete updatedRatings[articleId]; 
                }
                return updatedRatings;
            });
        }
    };

    if (!userData || !userData.id) {
        return <p className="read-articles-message">Lütfen giriş yapınız veya kullanıcı bilgilerinizi kontrol ediniz.</p>;
    }

    return (
        <div className="read-articles-container">
            <h2 className="read-articles-title">📖 Okunan Makaleler</h2>

            {loading && <p className="loading-message">Okunan makaleler yükleniyor...</p>}
            {error && <p className="error-message">{error}</p>}

            {!loading && !error && readArticles.length === 0 && (
                <p className="no-articles-message">Henüz okunmuş makaleniz bulunmamaktadır.</p>
            )}

            {!loading && !error && readArticles.length > 0 && (
                <ul className="read-articles-list">
                    {readArticles.map((item) => (
                        <li key={item.article_id} className="read-article-item">
                            <h4 className="article-item-title">
                                <a href={item.url || '#'} target="_blank" rel="noopener noreferrer">
                                    {item.title || 'Başlık yok'}
                                </a>
                            </h4>
                            <p className="article-item-abstract">
                                {item.abstract?.substring(0, 150)}...
                            </p>
                            {/* Yıldız Derecelendirme Bölümü */}
                            <div className="star-rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={`star ${star <= (articleRatings[item.article_id] || 0) ? 'filled' : ''}`}
                                        onClick={() => handleRatingChange(item.article_id, star)}
                                    >
                                        &#9733; {/* Unicode yıldız karakteri */}
                                    </span>
                                ))}
                                {/* Makalenin mevcut derecelendirmesini göster */}
                                {articleRatings[item.article_id] ? (
                                    <span className="current-rating-text">
                                        ({articleRatings[item.article_id]} yıldız)
                                    </span>
                                ) : (
                                    <span className="current-rating-text">
                                        Derecelendir
                                    </span>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ReadArticlesPage;