const axios = require('axios');

const API_KEY = '5a640431a02a4e3db05d76c805ad808a'; // NewsAPI'den aldığın API keyi buraya yaz

const getTrendingNews = async () => {
    try {
        const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
        return response.data.articles; // Toplanan haberlerin bilgilerini döndürüyoruz
    } catch (error) {
        console.error('Haberler alınırken bir hata oluştu:', error);
        return [];
    }
};

module.exports = getTrendingNews;