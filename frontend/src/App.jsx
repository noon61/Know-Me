import { useState } from 'react'
import Nav from './Nav'
import Message from './Message'
import Search from './Search'
import Profile from './Profile'
import Login from './Login'
import SearchResult from './SearchResult'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import SignUp from './SignUp'

function App() {
  const [searchResult, setSearchResult] = useState([]);

  return (
    <div>
      <BrowserRouter>
        <Nav />
        <div className="content">
        <Routes >
           <Route path="/" element={<Profile/>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search  searchResult={searchResult} setSearchResult={setSearchResult}/>} />
          <Route path="/search/result" element={<SearchResult searchResult={searchResult} />} />
          <Route path="/message" element={<Message />} />
          <Route path="/login" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
          {/* Add more routes as needed */}
        </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App;

