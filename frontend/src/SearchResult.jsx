import { s } from 'framer-motion/client'
import React from 'react'
import './searchResult.css'
import backIcon from './assets/back.svg';

const SearchResult = ({ searchResult }) => {
  if (!searchResult || searchResult.length === 0) {
    return (
      <div className='container'>
        <h1>検索結果</h1>
        <p>条件を変更してお探しください</p>
      </div>
    )
  }

  return (
    <div className='container'>
      <h1>検索結果</h1>
      {searchResult.map(item => (
        <div key={item.id}>
          <p>ID: {item.id}</p>
          <p>Name: {item.name}</p>
          <p>Lab: {item.lab}</p>
          <p>Circle: {item.circle}</p>
          <p>Subjects: {item.subjects.join(', ')}</p>
        </div>
      ))}
    </div>
  )
}

export default SearchResult
