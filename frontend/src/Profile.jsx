import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import profileImage from "./assets/Profile.png";
import { FaInstagram, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [name, setName] = useState("函館　未来");
  const [grade, setGrade] = useState("2年　情報システムコース");

  const [labOptions, setLabOptions] = useState([
    "石尾研",
    "石榑・佐藤研",
    "石田・稲村研",
    "伊藤研",
    "奥野研",
    "姜研",
    "所属なし",
  ]);
  const [lab, setLab] = useState("所属なし");
  const [newLab, setNewLab] = useState("所属なし");

  const [circleOptions, setCircleOptions] = useState([
    "Dance.Sarfy",
    "公立はこだて未来大学クルージング部",
    "ストリートダンスサークル一気狂う",
    "バドミントン部",
    "公立はこだて未来大学自動車部",
    "公立はこだて未来大学卓球サークル",
    "硬式テニス部",
    "バレーボールサークル",
    "軟式野球部",
    "函館学生連合〜息吹〜",
    "バスケットボールサークル",
    "サッカー・フットサルサークル",
    "総合文化健康サークル",
    "ランニングサークル",
    "アウトドアサークル",
    "brass FUN",
    "DARTS.FUN",
    "FUNGC",
    "FUN AI",
    "FUNラジ",
    "Illustrators",
    "劇団Null",
    "軽音サークル",
    "所属なし",
  ]);
  const [circle, setCircle] = useState([]);
  const [newCircle, setNewCircle] = useState("");

  // 学年一覧
  const yearOptions = [
    "学部1年",
    "学部2年",
    "学部3年",
    "学部4年",
    "修士1年",
    "修士2年",
  ];

  // 選択中の学年
  const [selectedYear, setSelectedYear] = useState("学部1年");

  // 学年ごとの履修済み授業
  const [courseRecords, setCourseRecords] = useState({
    "学部1年": [],
    "学部2年": [],
    "学部3年": [],
    "学部4年": [],
    "修士1年": [],
    "修士2年": [],
  });

  // 学年ごとの授業候補リスト
  const [courseOptionsByYear, setCourseOptionsByYear] = useState({
    "学部1年": ["解析学","物理学入門","線形代数","情報機器概論","情報表現入門","数学総合演習"],
    "学部2年": ["情報処理演習","アルゴリズムとデータ構造","応用数学Ⅰ","応用数学Ⅱ"],
    "学部3年": ["画像工学","ソフトウェア設計論Ⅱ","数値解析"],
    "学部4年": ["経済学特論","卒業研究"],
    "修士1年": ["認知システム通論"],
    "修士2年": ["課題研究Ⅲ"],
  });

  const [newCourse, setNewCourse] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(profileImage);

  const [instagram, setInstagram] = useState("fun_hakodate");
  const [xAccount, setXAccount] = useState("Funcl_GI");
  const [github, setGithub] = useState("Funcy-ICT");

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => setIsEditing(false);
  const handleLogout = () => navigate("/");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const addNewLab = () => {
    const trimmed = newLab.trim();
    if (trimmed && !labOptions.includes(trimmed)) {
      setLabOptions([...labOptions, trimmed]);
      setLab(trimmed);
    }
    setNewLab("");
  };

  const addNewCircle = () => {
    const trimmed = newCircle.trim();
    if (trimmed && !circleOptions.includes(trimmed)) {
      setCircleOptions([...circleOptions, trimmed]);
      setCircle([...circle, trimmed]);
    }
    setNewCircle("");
  };

  const addNewCourse = () => {
    const trimmed = newCourse.trim();
    if (!trimmed) return;

    const updatedOptions = [...(courseOptionsByYear[selectedYear] || [])];

    if (!updatedOptions.includes(trimmed)) {
      updatedOptions.push(trimmed);
      setCourseOptionsByYear({
        ...courseOptionsByYear,
        [selectedYear]: updatedOptions,
      });
    }

    if (!courseRecords[selectedYear].includes(trimmed)) {
      setCourseRecords({
        ...courseRecords,
        [selectedYear]: [...courseRecords[selectedYear], trimmed],
      });
    }

    setNewCourse("");
  };

  const toggleCourse = (year, course) => {
    const coursesForYear = courseRecords[year] || [];
    if (coursesForYear.includes(course)) {
      setCourseRecords({
        ...courseRecords,
        [year]: coursesForYear.filter((c) => c !== course),
      });
    } else {
      setCourseRecords({
        ...courseRecords,
        [year]: [...coursesForYear, course],
      });
    }
  };

  return (
    <>
      {/* ナビゲーションバー */}
      {/* <nav className="navbar">
        <div className="nav-links">
          <NavLink to="/profile" className="nav-link">Profile</NavLink>
          <NavLink to="/search" className="nav-link">Search</NavLink>
          <NavLink to="/message" className="nav-link">Message</NavLink>
        </div>
        <button className="logout-button" onClick={handleLogout}>Log out</button>
      </nav> */}

    <div className="profile-container">
      <div className="profile-left">
        <img src={image} alt="プロフィール画像" className="profile-image" />
        {isEditing && (
          <input type="file" accept="image/*" onChange={handleImageChange} />
        )}

        <div className="profile-name-info">
          {isEditing ? (
            <>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-name-grade"
              />
              <input
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="input-name-grade"
              />
            </>
          ) : (
            <>
              <h3>{name}</h3>
              <p>{grade}</p>
            </>
          )}

          <div className="sns-icons">
            {isEditing ? (
              <>
                <FaInstagram size={24} color="#ffb6c1" />
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                />
              </>
            ) : instagram ? (
              <a
                href={`https://instagram.com/${instagram}`}

                target="_blank"
                rel="noreferrer"
              >
                <FaInstagram size={24} color="#ffb6c1" />
              </a>
            ) : null}

            {isEditing ? (
              <>
                <FaXTwitter size={24} color="#ffb6c1" />
                <input
                  type="text"
                  value={xAccount}
                  onChange={(e) => setXAccount(e.target.value)}
                />
              </>
            ) : xAccount ? (
              <a
                href={`https://x.com/${xAccount}`}
                target="_blank"
                rel="noreferrer"
              >
                <FaXTwitter size={24} color="#ffb6c1" />
              </a>
            ) : null}

            {isEditing ? (
              <>
                <FaGithub size={24} color="#ffb6c1" />
                <input
                  type="text"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                />
              </>
            ) : github ? (
              <a
                href={`https://github.com/${github}`}
                target="_blank"
                rel="noreferrer"
              >
                <FaGithub size={24} color="#ffb6c1" />
              </a>
            ) : null}
          </div>

          {isEditing ? (
            <button className="edit-button" onClick={handleSave}>
              save
            </button>
          ) : (
            <button className="edit-button" onClick={handleEdit}>
              Edit Profile
            </button>
          )}
          
        </div>
      </div>

      <div className="profile-right">
        <h3>研究室</h3>
        {isEditing ? (
          <>
            <div className="tag-select">
              {labOptions.map((option) => (
                <button
                  key={option}
                  className={`tag-button ${lab === option ? "selected" : ""}`}
                  onClick={() => setLab(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="add-tag">
              <input
                value={newLab}
                onChange={(e) => setNewLab(e.target.value)}
                placeholder="新しい研究室を追加"
                onKeyDown={(e) => e.key === "Enter" && addNewLab()}
              />
            </div>
          </>
        ) : (
          <div className="tag-container">
            <span className="tag-button selected readonly">{lab}</span>
          </div>
        )}

        <h3>サークル</h3>
        {isEditing ? (
          <>
            <div className="tag-select">
              {circleOptions.map((option) => {
                const selected = circle.includes(option);
                return (
                  <button
                    key={option}
                    className={`tag-button ${selected ? "selected" : ""}`}
                    onClick={() =>
                      selected
                        ? setCircle(circle.filter((c) => c !== option))
                        : setCircle([...circle, option])
                    }
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            <div className="add-tag">
              <input
                value={newCircle}
                onChange={(e) => setNewCircle(e.target.value)}
                placeholder="新しいサークルを追加"
                onKeyDown={(e) => e.key === "Enter" && addNewCircle()}
              />
            </div>
          </>
        ) : (
          <div className="tag-container">
            {circle.length > 0 ? (
              circle.map((c, index) => (
                <span key={index} className="tag-button selected readonly">
                  {c}
                </span>
              ))
            ) : (
               <span></span>
            )}
          </div>
        )}

        <h3>履修登録</h3>

        {isEditing ? (
          <>
            <div className="tag-select">
              {yearOptions.map((year) => (
                <button
                  key={year}
                  className={`tag-button ${selectedYear === year ? "selected" : ""}`}
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                </button>
              ))}
            </div>

            <strong>{selectedYear}</strong>
            <div className="tag-select">
              {(courseOptionsByYear[selectedYear] || []).map((course) => {
                const selected = courseRecords[selectedYear]?.includes(course);
                return (
                  <button
                    key={course}
                    className={`tag-button ${selected ? "selected" : ""}`}
                    onClick={() => toggleCourse(selectedYear, course)}
                  >
                    {course}
                  </button>
                );
              })}
            </div>

            <div className="add-tag">
              <input
                value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
                placeholder="新しい授業を追加"
                onKeyDown={(e) => e.key === "Enter" && addNewCourse()}
              />
            </div>
          </>
        ) : (
          <>
            
            {yearOptions.map((year) => (
              <div key={year} style={{ marginBottom: "12px" }}>
                <strong>{year}:</strong>{" "}
                {courseRecords[year]?.length > 0 ? (
                  <div className="tags-display">
                    {courseRecords[year].map((course) => (
                      <span key={course} className="tag-button selected readonly">
                        {course}
                      </span>
                    ))}
                  </div>
                ) : (
                  "未履修"
                )}
              </div>
            ))}
          </>
        )}
      </div> 
    </div>  
    </>
  );
}
export default Profile;