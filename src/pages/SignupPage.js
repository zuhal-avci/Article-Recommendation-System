import React, { useState, useEffect, useRef } from 'react';
import './SignupPage.css'; // SignupPage'e özgü CSS dosyasını dahil edin
import { signup } from '../services/api'; // API servisinizden signup fonksiyonunu import edin
import { useNavigate } from 'react-router-dom'; // Sayfa yönlendirmesi için useNavigate kullanın

const SignupPage = ({ setUserData, setIsLoggedIn }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Kod akışı animasyonunun ekleneceği DOM elemanını referans almak için useRef kullanın
    const codeRainRef = useRef(null);

    // Kayıt işlemini yöneten asenkron fonksiyon
    const handleSignup = async () => {
        try {
            const user = await signup(username, email, password); // API üzerinden kayıt olmayı deneyin
            setUserData(user); // Kullanıcı verilerini ayarlayın
            setIsLoggedIn(true); // Giriş durumunu true yapın
            navigate("/"); // Başarılı kayıttan sonra ana sayfaya yönlendirin
        } catch (error) {
            setError("Kayıt başarısız. Lütfen bilgilerinizi kontrol edin."); // Hata durumunda mesaj gösterin
        }
    };

    // Kod akışı animasyonunu başlatan ve yöneten useEffect hook'u (LoginPage ile aynı mantık)
    useEffect(() => {
        // Makale Öneri Sistemi temalı terimler
        // Bu terimlerin harfleri animasyonda kullanılacak
        const terms = [
            "ARTICLE", "RECOMMEND", "ALGORITHM", "DATA", "MACHINE", "LEARNING",
            "KNOWLEDGE", "RESEARCH", "ANALYSIS", "INSIGHTS", "CONTENT", "FILTER",
            "USER", "PROFILE", "QUERY", "INDEX", "SYNTHESIS", "DIGITAL", "LIBRARY",
            "TOPIC", "CATEGORIES", "TAGS", "ABSTRACT", "CITATIONS", "NETWORKS",
            "OPTIMIZE", "PREDICT", "RELEVANCE", "DISCOVERY", "EXPLORE", "FEEDBACK",
            "INTEREST", "SESSION", "TRENDS", "VECTORS", "MODEL", "INTELLIGENCE"
        ];

        // Tüm terimleri birleştirip büyük harf yapın ve tek tek harflere ayırın
        const chars = terms.join('').toUpperCase().split('');

        const container = codeRainRef.current; // Animasyon konteynerine erişin
        const totalStreams = 70; // Ekranda aynı anda olacak düşen kod sütunu sayısı
        const minStreamLength = 15; // Minimum sütun uzunluğu (karakter sayısı)
        const maxStreamLength = 35; // Maksimum sütun uzunluğu (karakter sayısı)
        const streamSpeedFactor = 0.8; // Genel akış hızı katsayısı (küçük değerler daha hızlı akış sağlar)

        // Konteynerin DOM'da olup olmadığını kontrol edin
        if (!container) {
            console.warn("Code rain container not found. Animation skipped.");
            return;
        }

        // Tek bir kod akışı sütunu oluşturan fonksiyon
        const createStream = (columnIndex) => {
            const streamLength = Math.floor(Math.random() * (maxStreamLength - minStreamLength + 1)) + minStreamLength;
            // Sütunun yataydaki başlangıç konumunu yüzde olarak belirleyin
            const startX = (columnIndex / totalStreams) * 100;
            // Her akışın animasyon süresini rastgele ve hız faktörüne göre hesaplayın
            const animationDuration = (streamLength * 0.1 + Math.random() * 2) * streamSpeedFactor;

            // Akışı oluşturan ana div elemanını yaratın
            const streamDiv = document.createElement('div');
            streamDiv.style.position = 'absolute'; // Mutlak konumlandırma
            streamDiv.style.left = `${startX}%`; // Yatay konum
            streamDiv.style.top = `-100%`; // Başlangıçta ekranın tamamen dışında (yukarıda)
            streamDiv.style.display = 'flex'; // İçindeki karakterleri flexbox ile hizala
            streamDiv.style.flexDirection = 'column'; // Karakterleri dikeyde alt alta sırala
            // CSS animasyonunu streamDiv'e uygulayın (sonsuz döngüde)
            streamDiv.style.animation = `codeRainFlow ${animationDuration}s linear infinite`;

            // Her akışa rastgele bir başlangıç gecikmesi verin
            streamDiv.style.animationDelay = `${Math.random() * 5}s`;

            // Akış içindeki karakterleri oluşturun
            for (let i = 0; i < streamLength; i++) {
                const charElement = document.createElement('span');
                charElement.classList.add('code-rain-char'); // CSS sınıfını ekle
                // chars dizisinden rastgele bir karakter seçin
                charElement.textContent = chars[Math.floor(Math.random() * chars.length)];
                // Karakterin opaklığını rastgele ayarlayın
                charElement.style.opacity = Math.random() * 0.7 + 0.3;
                streamDiv.appendChild(charElement); // Karakteri akış div'ine ekle
            }

            container.appendChild(streamDiv); // Akış div'ini ana konteynere ekle

            // Animasyon her döngü tamamlandığında (iteration) tetiklenir
            streamDiv.addEventListener('animationiteration', () => {
                streamDiv.innerHTML = ''; // Mevcut karakterleri temizle
                // Yeni karakterlerle akışı yeniden oluştur
                for (let i = 0; i < streamLength; i++) {
                    const charElement = document.createElement('span');
                    charElement.classList.add('code-rain-char');
                    charElement.textContent = chars[Math.floor(Math.random() * chars.length)];
                    charElement.style.opacity = Math.random() * 0.7 + 0.3;
                    streamDiv.appendChild(charElement);
                }
                // Akışın başlangıç gecikmesini her döngüde rastgele sıfırla
                streamDiv.style.animationDelay = `${Math.random() * 5}s`;
            });
        };

        // Belirtilen toplam akış sayısını oluşturmak için döngü
        for (let i = 0; i < totalStreams; i++) {
            createStream(i);
        }

        // Komponent kaldırıldığında (unmount) animasyonu temizleme fonksiyonu
        return () => {
            if (container) {
                container.innerHTML = ''; // Tüm animasyon elemanlarını DOM'dan kaldırın
            }
        };
    }, []); // Boş bağımlılık dizisi, bu hook'un sadece bir kere (mount olduğunda) çalışmasını sağlar


    return (
        <div className="signup-page">
            {/* Kod akışı animasyonunun ekleneceği div */}
            <div className="code-rain-container" ref={codeRainRef}></div>
            <h1 className="title">Kayıt Ol</h1>
            <div className="form-container">
                <input
                    type="text"
                    placeholder="Kullanıcı Adı"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="E-Posta"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <div className="error-message">{error}</div>}
                <div className="button-group">
                    <button className="signup-btn" onClick={handleSignup}>Kayıt Ol</button>
                    <button className="login-btn" onClick={() => navigate("/")}>Zaten hesabın var mı? Giriş Yap</button>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;