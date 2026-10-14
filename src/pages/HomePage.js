import { useState, useEffect } from "react";
import { getRandomArticles, searchArticles } from "../services/api";
import './HomePage.css';


function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  // İlk yüklemede rastgele makaleleri al
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const randomArticles = await getRandomArticles();
      setArticles(randomArticles);
      setLoading(false);
    };

    fetchArticles();
  }, []);



  const handleSearch = async () => {
    if (searchQuery.trim() === '') return;

    setIsSearching(true);
    setLoading(true);
    try {
      const data = await searchArticles(searchQuery);
      setSearchResults(data);
    } catch (error) {
      console.error("Arama yapılırken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <h2>Makale Öneri Sistemi</h2>
      <div className="search-box">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Makale ara..."
        />
        <button onClick={handleSearch}>Ara</button>
      </div>
      <div className="articles-list">
        {loading ? (
          <p>Yükleniyor...</p>
        ) : articles.length > 0 ? (
          articles.map((article, index) => (
            <div key={index} className="article">
              <h3>{article.title}</h3>
              <p>{article.abstract}</p>
              <a href={article.url} target="_blank" rel="noreferrer">Makaleyi Görüntüle</a>
            </div>
          ))
        ) :
         (
          <p>Aramanıza uygun makale bulunamadı.</p>
        )}
      </div>
      
    </div>
  );
}

export default HomePage;
