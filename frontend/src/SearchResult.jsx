import React from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import './searchResult.css';

const SearchResult = ({ searchResult }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchWord = [] } = location.state || {}; // 配列として扱う

  const resultCount = searchResult?.length || 0;

  const handleShowProfile = (id) => () => {
    console.log(`Show profile for user with ID: ${id}`);

    navigate('/userProfile', {
      state: { userId: id }
    });
  }
  return (
    <div className="container">
      <div className="search-header">
        <p className="search-label">検索条件:</p>
        <div className="condition-tags">
          {Array.isArray(searchWord) && searchWord.length > 0 ? (
            searchWord.map((cond, index) => (
              <span key={index} className="tag">
                {cond}
              </span>
            ))
          ) : (
            <span className="tag">なし</span>
          )}
        </div>

        {resultCount === 0 ? (
          <p className="no-result">条件を変更してお探しください</p>
        ) : (
          <p className="result-count">検索結果（{resultCount}件）</p>
        )}
      </div>

      {/* 🔽 検索結果（名刺風カード） */}
      <div className="result-list">
        {resultCount > 0 &&
          searchResult.map((item) => (
            <div key={item.id} className="result-card" onClick={handleShowProfile(item.id)}>
              <p><strong>学年:</strong> {item.grade}</p>
              <p><strong>Name:</strong> {item.name}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SearchResult;
