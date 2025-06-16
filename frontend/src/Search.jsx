import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Search.css';
import rightIcon from './assets/right.svg';
import leftIcon from './assets/left.svg';
import { motion } from 'framer-motion';
import users from './assets/users.json'; // ユーザーデータのインポート（必要に応じて）

const Search = ({searchResult,setSearchResult}) => {
  // 各リスト10個ずつ用意
  const labs = [
    "研究室1", "研究室2", "研究室3", "研究室4", "研究室5",
    "研究室6", "研究室7", "研究室8", "研究室9", "研究室10"
  ];
  const circles = [
    "サークル1", "サークル2", "サークル3", "サークル4", "サークル5",
    "サークル6", "サークル7", "サークル8", "サークル9", "サークル10"
  ];
  const subjects = [
    "科目1", "科目2", "科目3", "科目4", "科目5",
    "科目6", "科目7", "科目8", "科目9", "科目10"
  ];

  

  // 選択状態
  const [selectedLabs, setSelectedLabs] = React.useState([]);
  const [selectedCircles, setSelectedCircles] = React.useState([]);
  const [selectedSubjects, setSelectedSubjects] = React.useState([]);

  // スクロール位置インデックス（表示5件ずつスクロール）
  const [labIndex, setLabIndex] = React.useState(0);
  const [circleIndex, setCircleIndex] = React.useState(0);
  const [subjectIndex, setSubjectIndex] = React.useState(0);

  const [scrollDirection, setScrollDirection] = React.useState("right");
  const navigate = useNavigate();

  // スクロールハンドラ（共通化）
  const handleScroll = (type, direction) => {
    setScrollDirection(direction);
    if (type === "lab") {
      if (direction === "left") setLabIndex((prev) => Math.max(prev - 5, 0));
      else setLabIndex((prev) => Math.min(prev + 5, labs.length - 5));
    }
    if (type === "circle") {
      if (direction === "left") setCircleIndex((prev) => Math.max(prev - 5, 0));
      else setCircleIndex((prev) => Math.min(prev + 5, circles.length - 5));
    }
    if (type === "subject") {
      if (direction === "left") setSubjectIndex((prev) => Math.max(prev - 5, 0));
      else setSubjectIndex((prev) => Math.min(prev + 5, subjects.length - 5));
    }
  };

  // 選択トグル関数
  const toggleSelection = (type, value) => {
    if (type === "lab") {
      setSelectedLabs((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      );
    }
    if (type === "circle") {
      setSelectedCircles((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      );
    }
    if (type === "subject") {
      setSelectedSubjects((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      );
    }
  };

  // クリアボタン
  const clearSelections = () => {
    setSelectedLabs([]);
    setSelectedCircles([]);
    setSelectedSubjects([]);
  };

  // 検索ボタン
  const handleSearch = () => {
    console.log("Selected Labs:", selectedLabs);
    console.log("Selected Circles:", selectedCircles);
    console.log("Selected Subjects:", selectedSubjects);
    console.log("Users Data:", users); // ユーザーデータの確認

    const results = users.filter(user => {
      const hasLab=selectedLabs.includes(user.lab);      
      const hasCircle=selectedCircles.includes(user.circle);
      const hasSubject=user.subjects.some((subject)=> selectedSubjects.includes(subject)); 
      return hasLab || hasCircle || hasSubject;

    });
    
    
    setSearchResult(results);
    console.log("Search Results:", results);
    navigate('./result'); // 検索結果ページへ遷移});


    
  };

  // アニメーション設定（共通）
 const getItemVariants = () => ({
    hidden: {x:scrollDirection === "left" ? -220 : 220, opacity: 0},
    visible: {x: 0, opacity: 1},
    exit: {x: scrollDirection === "left" ? 220 : -220, opacity: 0}
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
              onClick={() => handleScroll("lab", "left")}
            />
            <ul className="search-list">
              {labs.slice(labIndex, labIndex + 5).map((lab) => (
                <motion.li
                  key={lab}
                  className={`search-list-item ${selectedLabs.includes(lab) ? "selected" : ""}`}
                  onClick={() => toggleSelection("lab", lab)}
                  variants={getItemVariants()}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  {lab}
                </motion.li>
              ))}
            </ul>
            <img
              src={rightIcon}
              alt="right"
              className="list-arrow right-arrow"
              onClick={() => handleScroll("lab", "right")}
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
              onClick={() => handleScroll("circle", "left")}
            />
            <ul className="search-list">
              {circles.slice(circleIndex, circleIndex + 5).map((circle) => (
                <motion.li
                  key={circle}
                  className={`search-list-item ${selectedCircles.includes(circle) ? "selected" : ""}`}
                  onClick={() => toggleSelection("circle", circle)}
                  variants={getItemVariants()}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  {circle}
                </motion.li>
              ))}
            </ul>
            <img
              src={rightIcon}
              alt="right"
              className="list-arrow right-arrow"
              onClick={() => handleScroll("circle", "right")}
            />
          </div>
        </div>

        {/* 科目 */}
        <div className="search-section">
          <h2 className="search-section-title">科目</h2>
          <div className="search-list-wrapper">
            <img
              src={leftIcon}
              alt="left"
              className="list-arrow left-arrow"
              onClick={() => handleScroll("subject", "left")}
            />
            <ul className="search-list">
              {subjects.slice(subjectIndex, subjectIndex + 5).map((subject) => (
                <motion.li
                  key={subject}
                  className={`search-list-item ${selectedSubjects.includes(subject) ? "selected" : ""}`}
                  onClick={() => toggleSelection("subject", subject)}
                  variants={getItemVariants()}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  {subject}
                </motion.li>
              ))}
            </ul>
            <img
              src={rightIcon}
              alt="right"
              className="list-arrow right-arrow"
              onClick={() => handleScroll("subject", "right")}
            />
          </div>
        </div>
      </div>
      <div className="search-buttons">
        <button onClick={clearSelections} className='custom-button'>クリア</button>
        <button onClick={handleSearch} className='custom-button'>検索</button>
      </div>
    </div>
  );
};

export default Search;
