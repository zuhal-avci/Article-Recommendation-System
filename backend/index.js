const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const getTrendingNews = require('./newsAPI'); // Yeni dosyayı dahil ediyoruz

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'oneriSistemi',
    password: '0000',
    port: 5432,
});

// Makaleleri rastgele getiren endpoint
app.get('/api/articles/random', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT * FROM article
      ORDER BY RANDOM()
      LIMIT 10
    `);
        res.json(result.rows);
    } catch (err) {
        console.error('Hata:', err);
        res.status(500).json({ error: 'Veri alınırken hata oluştu' });
    }
});

// Gündemdeki haberleri getiren endpoint
const { spawn } = require('child_process');

app.post('/api/recommend', async (req, res) => {
    const { news_title } = req.body;
    if (!news_title) {
        return res.status(400).json({ error: 'Haber başlığı gerekli' });
    }

    const python = spawn('python3', ['recommendation.py', news_title]);

    let data = '';
    let errorData = '';

    python.stdout.on('data', (chunk) => {
        data += chunk.toString();
    });

    python.stderr.on('data', (chunk) => {
        errorData += chunk.toString();
    });

    python.on('close', (code) => {
        if (code !== 0 || errorData) {
            console.error('Python hatası:', errorData);
            return res.status(500).json({ error: 'Öneri sistemi çalıştırılamadı' });
        }

        try {
            const articles = JSON.parse(data);
            res.json(articles);
        } catch (e) {
            console.error('Yanıt parse edilemedi:', data);
            res.status(500).json({ error: 'Yanıt işlenemedi' });
        }
    });
});


// Sunucu başlatılıyor
app.listen(5000, () => {
    console.log('Backend 5000 portunda çalışıyor 🚀');
});
