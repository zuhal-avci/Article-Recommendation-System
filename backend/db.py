import psycopg2

DB_HOST = ""
DB_PORT = ""
DB_NAME = ""
DB_USER = ""
DB_PASSWORD = ""

def get_db_connection():
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        print("Veritabanına başarılı bir şekilde bağlanıldı.")
        return conn
    except Exception as e:
        print(f"Bağlantı hatası: {e}")
        return None

# Bağlantıyı test etmek için basit bir SELECT sorgusu çalıştırılabilir
if __name__ == "__main__":
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute("SELECT version();")  # PostgreSQL versiyonunu sorgula
        db_version = cursor.fetchone()
        print(f"PostgreSQL versiyonu: {db_version[0]}")
        cursor.close()
        conn.close()
