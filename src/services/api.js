import axios from "axios";

const NEWS_API_KEY = '5a640431a02a4e3db05d76c805ad808a';
const API_URL_8000 = "http://localhost:8000"; // 8000 portu için backend URL'si

// 8000 portundaki backend için axios örneği (kimlik doğrulama ve kişiselleştirme için)
const api8000 = axios.create({
    baseURL: API_URL_8000,
});


export const fetchNewsHeadlines = async () => {
    try {
        const response = await axios.get(
            `https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWS_API_KEY}`
        );
        return response.data.articles;
    } catch (error) {
        console.error('Haberler alınırken hata oluştu:', error);
        return [];
    }
};

// Rastgele Makale getirme fonksiyonu
const getRandomArticles = async () => {
    try {
        const response = await api8000.get('/articles/random');
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error('Rastgele makaleler alınırken hata:', error);
        return [];
    }
};

// 🔐 Giriş (login)
const login = async (email, password) => {
    try {
        const response = await api8000.post("/auth/login", { email, password });
        return response.data;
    } catch (error) {
        console.error("Giriş yaparken hata oluştu:", error);
        throw error;
    }
};

// 📝 Kayıt (signup)
const signup = async (username, email, password) => {
    try {
        const response = await api8000.post("/auth/register", { username, email, password });
        return response.data;
    } catch (error) {
        console.error("Kayıt olurken hata oluştu:", error);
        throw error;
    }
};

// Kişiselleştirilmiş öneriler
export const getPersonalizedRecommendations = async (userId) => {
    if (!userId) {
        console.warn("getPersonalizedRecommendations: userId sağlanmadı. Boş liste döndürülecek.");
        return [];
    }
    try {
        const response = await api8000.get(`/recommendations/personalized_recommendations/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Kişiselleştirilmiş öneriler alınamadı (userId: ${userId}):`, error);
        return [];
    }
};

// Makale arama
const searchArticles = async (query) => {
    try {
        const response = await api8000.get(`/search/search`, {
            params: { query },
        });
        return response.data;
    } catch (error) {
        console.error('Makale aranırken hata:', error);
        return [];
    }
};

// 📌 Tek başlığa göre öneri al
const getRecommendedArticles = async (title) => {
    try {
        const response = await api8000.post("/recommend", { title });
        return response.data.recommended;
    } catch (error) {
        console.error("Makale önerisi alınamadı:", error);
        return [];
    }
};

// 📌 Çoklu başlığa göre öneri al
const getRecommendedArticlesBatch = async (titles) => {
    try {
        const response = await api8000.post("/recommend_batch", { titles });
        return response.data.recommendations;
    } catch (error) {
        console.error("Makale önerileri alınamadı:", error);
        return [];
    }
};


const addReadArticle = async (userId, articleId, readAt) => {
    if (!userId || !articleId || !readAt) {
        console.warn("addReadArticle: userId, articleId veya readAt eksik. İstek gönderilmedi.");
        return;
    }
    try {
        const response = await api8000.post("/user_read_article/add_read_article", {
            user_id: userId,
            article_id: articleId,
            read_at: readAt
        });
        console.log("Okunan makale başarıyla kaydedildi:", response.data);
        return response.data;
    } catch (error) {
        console.error("Okunan makale kaydedilirken hata oluştu:", error);
        throw error;
    }
};

// ✨ Yeni: Makale derecelendirme fonksiyonu
const addRating = async (userId, articleId, rating) => {
    if (!userId || !articleId || rating === undefined || rating === null) {
        console.warn("addRating: userId, articleId veya rating eksik. İstek gönderilmedi.");
        return;
    }
    try {
        // Backend'deki endpoint'imiz "/add_rating"
        const response = await api8000.post("/add_rating", {
            user_id: userId,
            article_id: articleId,
            rating: rating
        });
        console.log("Derecelendirme başarıyla kaydedildi:", response.data);
        return response.data;
    } catch (error) {
        console.error("Derecelendirme kaydedilirken hata oluştu:", error);
        throw error;
    }
};

// ✨ Tüm fonksiyonları dışa aktar
export {
    login,
    signup,
    searchArticles,
    getRecommendedArticles,
    getRandomArticles,
    getRecommendedArticlesBatch,
    addReadArticle,
    addRating // Yeni fonksiyonu dışa aktarıyoruz
};