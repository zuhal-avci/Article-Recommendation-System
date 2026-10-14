import requests

# NewsAPI anahtarınız
API_KEY = ' API anahtarın'  

# API URL'si
NEWS_URL = f'URL'

# Haber başlıklarını çekme fonksiyonu
def get_trending_news():
    try:
        # API'den veri çekiyoruz
        response = requests.get(NEWS_URL)
        response.raise_for_status()  # Eğer API'den hata alırsak bir istisna fırlatacak
        articles = response.json().get('articles', [])  # articles listesini alıyoruz
        news_titles = [article['title'] for article in articles]  # Her makalenin başlığını alıyoruz
        return news_titles
    except requests.exceptions.RequestException as e:
        print(f"Hata oluştu: {e}")
        return []

# Haber başlıklarını yazdırma
if __name__ == "__main__":
    news_titles = get_trending_news()
    if news_titles:
        print("Güncel Haber Başlıkları:")
        for title in news_titles:
            print(f"- {title}")
    else:
        print("Haber başlıkları alınamadı.")
