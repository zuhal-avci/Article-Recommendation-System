// utils.js

export const handleArticleClick = (article, userId) => {
  const readData = {
    user_id: userId,
    article_id: article.id,
    read_at: new Date().toISOString(),
  };

  fetch("http://localhost:8000/add_read_article", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(readData),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Okuma kaydı başarıyla gönderildi:", data);
      window.open(article.url, "_blank");
    })
    .catch((error) => {
      console.error("Okuma kaydı gönderilemedi:", error);
      window.open(article.url, "_blank");
    });
};
