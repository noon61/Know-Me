import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Search.css';
import rightIcon from './assets/right.svg';
import leftIcon from './assets/left.svg';
import { motion,AnimatePresence } from 'framer-motion';

const Search = ({ searchResult, setSearchResult }) => {
  const [labs, setLabs] = useState([]);
  const [circles, setCircles] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // 選択はID配列で管理
  const [selectedLabs, setSelectedLabs] = useState([]);
  const [selectedCircles, setSelectedCircles] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  // 新規：学年選択ステート
  const [selectedGrade, setSelectedGrade] = useState(''); // ''は「すべて」

  useEffect(() => {
    fetch('http://localhost:3001/api/labs')
      .then(res => res.json())
      .then(data => setLabs(data))
      .catch(console.error);

    fetch('http://localhost:3001/api/circles')
      .then(res => res.json())
      .then(data => setCircles(data))
      .catch(console.error);

    fetch('http://localhost:3001/api/subjects')
      .then(res => res.json())
      .then(data => {setSubjects(data)
        console.log('Fetched subjects:', data);
      })
      
      .catch(console.error);
  }, []);

  const [labIndex, setLabIndex] = useState(0);
  const [circleIndex, setCircleIndex] = useState(0);
  const [subjectIndex, setSubjectIndex] = useState(0);

  const [searchWord, setSearchWord] = useState([]);

  // アニメーションの方向
  const [scrollDirection, setScrollDirection] = useState('right');
  const navigate = useNavigate();

  const handleScroll = (type, direction) => {
    setScrollDirection(direction);
    if (type === 'lab') {
      if (direction === 'left') setLabIndex(prev => Math.max(prev - 5, 0));
      else setLabIndex(prev => Math.min(prev + 5, labs.length - 5));
    }
    if (type === 'circle') {
      if (direction === 'left') setCircleIndex(prev => Math.max(prev - 5, 0));
      else setCircleIndex(prev => Math.min(prev + 5, circles.length - 5));
    }
    if (type === 'subject') {
      if (direction === 'left') setSubjectIndex(prev => Math.max(prev - 5, 0));
      else setSubjectIndex(prev => Math.min(prev + 5, filteredSubjects.length - 5));
    }
  };

  const toggleSelection = (type, id, name) => {
    setSearchWord(prev => {
      if (prev.includes(name)) {
        return prev.filter(word => word !== name);
      } else {
        return [...prev, name];
      }
    });

    if (type === 'lab') {
      setSelectedLabs(prev => (prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]));
    }
    if (type === 'circle') {
      setSelectedCircles(prev => (prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]));
    }
    if (type === 'subject') {
      setSelectedSubjects(prev => (prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]));
    }
  };

  const clearSelections = () => {
    setSelectedLabs([]);
    setSelectedCircles([]);
    setSelectedSubjects([]);
    setSearchWord([]);
    setSelectedGrade('');
  };

  const handleSearch = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          labs: selectedLabs,
          circles: selectedCircles,
          subjects: selectedSubjects,
        }),
      });
      const results = await response.json();
      console.log('Search Results:', results);
      setSearchResult(results);
      console.log('Search Word:', searchWord);
      navigate('./result', { state: { searchWord: searchWord } });
    } catch (error) {
      console.error('検索エラー:', error);
    }
  };

  // 学年で科目をフィルター
  
  const filteredSubjects = selectedGrade
    ? subjects.filter(subject => subject.grade === selectedGrade)
    : subjects;

  // 学年選択変更時にsubjectIndexをリセット＆アニメーション方向セット
  const handleGradeChange = e => {
    const grade = e.target.value;
    setSelectedGrade(grade);
    setSubjectIndex(0);
    setScrollDirection('right'); // アニメーションの方向を強制リセット
    console.log(filteredSubjects);
    console.log(subjects.grade);
  };

  const getItemVariants = () => ({
    hidden: { x: scrollDirection === 'left' ? -220 : 220, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: scrollDirection === 'left' ? 220 : -220, opacity: 0 },
  });

  return (
    <div>
      <div className="search-container">
        {/* 研究室 */}
        <div className="search-section">
          <h2 className="search-section-title">研究室</h2>
          <div className="search-list-wrapper">
            <img
              src={leftIcon}
              alt="left"
              className="list-arrow left-arrow"
              onClick={() => handleScroll('lab', 'left')}
            />
            <ul className="search-list" key={labIndex}>
                {labs.slice(labIndex, labIndex + 5).map(lab => (
                <motion.li
                  key={lab.id}
                  className={`search-list-item ${selectedLabs.includes(lab.id) ? 'selected' : ''}`}
                  onClick={() => toggleSelection('lab', lab.id, lab.name)}
                  variants={getItemVariants()}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  {lab.name}
                </motion.li>
              ))}
              
            </ul>
            <img
              src={rightIcon}
              alt="right"
              className="list-arrow right-arrow"
              onClick={() => handleScroll('lab', 'right')}
            />
          </div>
        </div>

        {/* サークル */}
        <div className="search-section">
          <h2 className="search-section-title">サークル</h2>
          <div className="search-list-wrapper">
            <img
              src={leftIcon}
              alt="left"
              className="list-arrow left-arrow"
              onClick={() => handleScroll('circle', 'left')}
            />
            <ul className="search-list" key={circleIndex}>
              {circles.slice(circleIndex, circleIndex + 5).map(circle => (
                <motion.li
                  key={circle.id}
                  className={`search-list-item ${selectedCircles.includes(circle.id) ? 'selected' : ''}`}
                  onClick={() => toggleSelection('circle', circle.id, circle.name)}
                  variants={getItemVariants()}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  {circle.name}
                </motion.li>
              ))}
            </ul>
            <img
              src={rightIcon}
              alt="right"
              className="list-arrow right-arrow"
              onClick={() => handleScroll('circle', 'right')}
            />
          </div>
        </div>

        {/* 科目 */}
        <div className="search-section">
          <h2 className="search-section-title">科目</h2>

          {/* 学年選択ドロップダウン追加 */}
          <select
            value={selectedGrade}
            onChange={handleGradeChange}
            className="grade-select"
          >
            <option value="">すべての学年</option>
            <option value="学部1年">学部1年</option>
            <option value="学部2年">学部2年</option>
            <option value="学部3年">学部3年</option>
            <option value="学部4年">学部4年</option>
            <option value="修士1年">修士1年</option>
            <option value="修士2年">修士2年</option>
          </select>

          <div className="search-list-wrapper">
            <img
              src={leftIcon}
              alt="left"
              className="list-arrow left-arrow"
              onClick={() => handleScroll('subject', 'left')}
            />
            <ul className="search-list" key={subjectIndex}>
              {filteredSubjects.slice(subjectIndex, subjectIndex + 5).map(subject => (
                <motion.li
                  key={subject.id}
                  className={`search-list-item ${
                    selectedSubjects.includes(subject.id) ? 'selected' : ''
                  }`}
                  onClick={() => toggleSelection('subject', subject.id, subject.name)}
                  variants={getItemVariants()}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  {subject.name}
                </motion.li>
              ))}
            </ul>
            <img
              src={rightIcon}
              alt="right"
              className="list-arrow right-arrow"
              onClick={() => handleScroll('subject', 'right')}
            />
          </div>
        </div>
      </div>

      <div className="search-buttons">
        <button onClick={clearSelections} className="custom-button">
          clear
        </button>
        <button onClick={handleSearch} className="custom-button">
          search
        </button>
      </div>
    </div>
  );
};

export default Search;
