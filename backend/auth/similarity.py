from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def calculate_similarity(news_titles, article_data):
    vectorizer = TfidfVectorizer(stop_words='english')  # Stopwords kullanıyoruz
    all_titles = news_titles + [article['title'] for article in article_data]  # Haber başlıkları ve makale başlıklarını birleştiriyoruz

    tfidf_matrix = vectorizer.fit_transform(all_titles)  # TF-IDF matrisini oluşturuyoruz
    similarities = cosine_similarity(tfidf_matrix[:len(news_titles)], tfidf_matrix[len(news_titles):])  # Benzerlik hesaplama

    best_matches = []
    for i in range(len(news_titles)):
        best_match_index = similarities[i].argmax()  # En yüksek benzerlik değeri
        best_article = article_data[best_match_index]  # En yüksek benzerlik değeri ile ilişkilendirilmiş makale
        best_matches.append({
            "news_title": news_titles[i],
            "article_title": best_article["title"],
            "article_url": best_article["url"],  # URL'yi ekliyoruz
            "article_id": best_article["id"]  # ID'yi de tutuyoruz
        })

    return best_matches
