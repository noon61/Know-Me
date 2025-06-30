import { useState } from 'react'
import Nav from './Nav'
import Search from './Search'
import Profile from './Profile'
import Login from './Login'
import SearchResult from './SearchResult'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import SignUp from './SignUp'

// ✅ 追加インポート
import MessageList from './MessageList'
import ChatRoom from './ChatRoom'
import UserProfile from './UserProfile';

function App() {
  const [searchResult, setSearchResult] = useState([]);

  return (
    <div>
      <BrowserRouter>
        <Nav />
        <div className="content">
          <Routes>
            <Route path="/" element={<Profile />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/search" element={
              <Search searchResult={searchResult} setSearchResult={setSearchResult} />
            } />
            <Route path="/search/result" element={
              <SearchResult searchResult={searchResult} />
            } />

            {/* ✅ 修正後のメッセージ一覧とチャットルーム */}
            <Route path="/message" element={<MessageList />} />
            <Route path="/message/:userId" element={<ChatRoom />} />

            <Route path="/login" element={<Login />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/profile/:id" element={<UserProfile />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App;
