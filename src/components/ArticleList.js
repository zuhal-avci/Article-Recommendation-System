import React from 'react';

const ArticleList = ({ articles }) => {
  return (
    <div>
      <h3>Önerilen Makaleler</h3>
      <ul>
        {articles.map((article, index) => (
          <li key={index}>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              {article.title} {/* Başlıkları buraya ekliyoruz */}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArticleList;

