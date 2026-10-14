import psycopg2

def get_articles_from_db():
    try:
        conn = psycopg2.connect(
            dbname="",
            user="",
            password="",
            host="",
            port=""
        )
        cursor = conn.cursor()

        cursor.execute("SELECT id, title, url FROM articles")  # ID, Title ve URL alıyoruz
        articles = cursor.fetchall()

        article_data = [{"id": article[0], "title": article[1], "url": article[2]} for article in articles]  # ID, Title, URL'yi listele

        cursor.close()
        conn.close()

        return article_data

    except Exception as e:
        print(f"Veritabanı bağlantı hatası: {e}")
        return []
