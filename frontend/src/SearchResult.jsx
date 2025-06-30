import React from 'react';
import { useNavigate } from 'react-router-dom';
import './searchResult.css';

const SearchResult = ({ searchResult }) => {
  const navigate = useNavigate();

  if (!searchResult || searchResult.length === 0) {
    return (
      <div className="container">
        <h1>検索結果</h1>
        <p>条件を変更してお探しください</p>
      </div>
    );
  }

  const handleClick = (id) => {
    navigate(`/profile/${id}`);
  };

  return (
    <div className="container">
      <h1>検索結果</h1>
      <div className="card-list">
        {searchResult.map((item) => (
          <div
            key={item.id}
            className="result-card"
            onClick={() => handleClick(item.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="card-header">
              <h2>{item.name}</h2>
              <p className="lab">{item.lab}</p>
            </div>
            <div className="card-body">
              <p><strong>サークル:</strong> {item.circle}</p>
              <p><strong>履修科目:</strong> {item.subjects.join(', ')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResult;
