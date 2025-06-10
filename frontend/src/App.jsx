import { useState } from 'react'
import Nav from './Nav'
import Message from './Message'
import Search from './Search'
import Home from './Home'
import Login from './Login'
import SearchResult from './SearchResult'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  const [searchResult, setSearchResult] = useState(null);

  return (
    <div>
      <BrowserRouter>
        <Nav />
        <Routes>
           <Route path="/" element={<Home/>} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search  searchResult={searchResult} setSearchResult={searchResult}/>} />
          <Route path="/search/result" element={<SearchResult searchResult={searchResult} />} />
          <Route path="/message" element={<Message />} />
          <Route path="/login" element={<Login />} />
          {/* Add more routes as needed */}
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;

