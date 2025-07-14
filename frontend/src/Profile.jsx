import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import profileImage from "./assets/Profile.png";
import { FaInstagram, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import "./Profile.css";
import { jwtDecode } from "jwt-decode"; // Corrected import for jwt-decode

function Profile() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState("函館　未来");
  const [grade, setGrade] = useState("2年　情報システムコース");

  // 研究室
  const [labOptions, setLabOptions] = useState([]);
  const [lab, setLab] = useState(null); // 所属なしのid

  // サークル（単一選択）
  const [circleOptions, setCircleOptions] = useState([]);
  const [circleId, setCircleId] = useState(24); // 所属なしのid

  // 履修登録（科目）
  const yearOptions = [
    "学部1年", "学部2年", "学部3年", "学部4年", "修士1年", "修士2年"
  ];
  const [selectedYear, setSelectedYear] = useState("学部1年");
  const [courseOptionsByYear, setCourseOptionsByYear] = useState({});

  // 選択はid配列で保持
  const [courseRecords, setCourseRecords] = useState({
    "学部1年": [],
    "学部2年": [],
    "学部3年": [],
    "学部4年": [],
    "修士1年": [],
    "修士2年": []
  });

  // SNS
  const [instagram, setInstagram] = useState("fun_hakodate");
  const [xAccount, setXAccount] = useState("Funcl_GI");
  const [github, setGithub] = useState("Funcy-ICT");

  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(profileImage);

  // JWTトークンからユーザーID取得・プロフィール取得
  // 1. 基本的なデータを取得するためのuseEffect
  // このeffectはコンポーネントの初回マウント時にのみ実行されます。
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, redirecting to login");
      navigate("/login");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      
      // ユーザーIDをセットし、後続のeffectで利用する
      setUserId(decoded.id);

      // ユーザーに依存しないマスターデータを取得
      fetchLab();
      fetchCircle();
      fetchSubjects();
    } catch (error) {
      console.error("Invalid token", error);
      navigate("/login");
    }
  }, [navigate]); // navigateは変わらないので、事実上初回のみ実行される

  // 2. ユーザー固有のプロフィール情報を取得するためのuseEffect
  // userIdとcourseOptionsByYearの準備ができてから実行される
  useEffect(() => {
    // userIdがセットされ、かつ科目リストの取得が完了していることを確認
    if (userId && Object.keys(courseOptionsByYear).length > 0) {
      fetchUserProfile(userId);
    }
    // このeffectは、userIdかcourseOptionsByYearの値が実際に変わった時だけ再実行される
  }, [userId, courseOptionsByYear]);


  // プロフィール取得
  const fetchLab = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/labs");
      const data = await res.json();
      if (data) {
        setLabOptions(data.map(lab => ({ id: lab.id, name: lab.name })));
        console.log("Fetched labs:", data);
      }
    } catch (err) {
      console.error("Error fetching labs:", err);
    }
  };

  const fetchCircle = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/circles");
      const data = await res.json();
      if (data) {
        setCircleOptions(data.map(circle => ({ id: circle.id, name: circle.name })));
      }
    } catch (err) {
      console.error("Error fetching circles:", err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/subjects");
      const data = await res.json();
      if (data) {
        console.log("Fetched subjects:", data);
        const grouped = data.reduce((acc, subject) => {
          const year = subject.grade;
          if (!acc[year]) acc[year] = [];
          acc[year].push({ id: subject.id, name: subject.name });
          return acc;
        }, {});
        setCourseOptionsByYear(grouped);
        // 初期化
        const initialRecords = {};
        Object.keys(grouped).forEach(year => {
          initialRecords[year] = [];
        });
        setCourseRecords(initialRecords);
      }
    } catch (err) {
      console.error("Error fetching subjects:", err);
    }
  };

  const fetchUserProfile = async (userId) => {
    try {
      const res = await fetch(`http://localhost:3001/api/students/${userId}`);
      const data = await res.json();
      if (data) {
        setName(data.name);
        setGrade(data.grade);
        // Ensure that lab and circleId are set correctly based on existing options
        setLab(data.lab_id); // Only set the ID, name is for display
        setCircleId(data.circle_id); // Only set the ID, name is for display

        setInstagram(data.instagram || "fun_hakodate");
        setXAccount(data.x_account || "Funcl_GI");
        setGithub(data.github || "Funcy-ICT");

        const newRecords = {
          "学部1年": [], "学部2年": [], "学部3年": [],
          "学部4年": [], "修士1年": [], "修士2年": []
        };
        data.subjects?.forEach(({ name, grade }) => {
          if (newRecords[grade]) {
            const courseObj = courseOptionsByYear[grade]?.find(c => c.name === name);
            if (courseObj && !newRecords[grade].includes(courseObj.id)) {
              newRecords[grade].push(courseObj.id);
            }
          }
        });
        setCourseRecords(newRecords);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  // 保存処理
  const handleSave = async () => {
    setIsEditing(false);
    const token = localStorage.getItem("token");

    const subjects = Object.entries(courseRecords).flatMap(([grade, ids]) =>
      ids.map(id => {
        const course = courseOptionsByYear[grade]?.find(c => c.id === id);
        return { id, name: course?.name || "", grade };
      })
    );
    console.log("Selected subjects:", subjects);

    const updated = {
      id: userId,
      name,
      grade,
      lab_id: lab,
      circle_id: circleId,
      subjects,
      instagram,
      x_account: xAccount,
      github
    };

    console.log("Saving profile:", updated);
    try {
      const res = await fetch("http://localhost:3001/api/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error("Update failed");
      const result = await res.json();
      console.log("Updated profile:", result);
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  // ログアウト
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // 画像変更
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  // 研究室追加
  const addNewLab = async () => {
    const trimmed = prompt("新しい研究室名を入力してください")?.trim();
    if (trimmed && !labOptions.some(l => l.name === trimmed)) {
      try {
        const res = await fetch("http://localhost:3001/api/addLab", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: trimmed }),
        });
        if (res.ok) {
          fetchLab(); // Re-fetch labs to update the list
        } else {
          console.error("Failed to add lab on server.");
        }
      }
      catch (err) {
        console.error("Error adding lab:", err);
        return;
      }
    }
  };

  // サークル追加
  const addNewCircle = async () => {
    const trimmed = prompt("新しいサークル名を入力してください")?.trim();
    if (trimmed && !circleOptions.some(c => c.name === trimmed)) {
      try {
        const res = await fetch("http://localhost:3001/api/addCircle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: trimmed }),
        });
        if (res.ok) {
          fetchCircle(); // Re-fetch circles to update the list
        } else {
          console.error("Failed to add circle on server.");
        }
      }
      catch (err) {
        console.error("Error adding circle:", err);
        return;
      }
    }
  };

  // 科目追加
  const addNewCourse = () => {
    const trimmed = prompt("新しい授業名を入力してください")?.trim();
    if (!trimmed) return;

    // A real application would typically send this to the backend to get a proper ID
    // For now, we're just generating a client-side ID which is okay for this example's scope.
    const newId = Math.max(0, ...(courseOptionsByYear[selectedYear] || []).map(c => c.id)) + 1;
    const newCourseObj = { id: newId, name: trimmed };

    // Update courseOptionsByYear for the current selectedYear
    setCourseOptionsByYear(prevOptions => ({
      ...prevOptions,
      [selectedYear]: [...(prevOptions[selectedYear] || []), newCourseObj]
    }));

    // Automatically select the newly added course
    setCourseRecords(prevRecords => ({
      ...prevRecords,
      [selectedYear]: [...(prevRecords[selectedYear] || []), newId]
    }));
  };

  // 科目選択トグル
  const toggleCourse = (year, courseId) => {
    const current = courseRecords[year];
    const updated = current.includes(courseId)
      ? current.filter((c) => c !== courseId)
      : [...current, courseId];
    setCourseRecords({ ...courseRecords, [year]: updated });
  };

  return (
    <div className="profile-container">
      <div className="profile-left">
        <img src={image} alt="プロフィール画像" className="profile-image" />
        {isEditing && (
          <input type="file" accept="image/*" onChange={handleImageChange} />
        )}

        <div className="profile-name-info">
          {isEditing ? (
            <>
              <input value={name} onChange={(e) => setName(e.target.value)} />
              <select
                className="grade-select"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              >
                <option value="学部1年">学部1年</option>
                <option value="学部2年">学部2年</option>
                <option value="学部3年">学部3年</option>
                <option value="学部4年">学部4年</option>
                <option value="修士1年">修士1年</option>
                <option value="修士2年">修士2年</option>
              </select>
            </>
          ) : (
            <>
              <h3>{name}</h3>
              <p>{grade}</p>
            </>
          )}

          <div className="sns-icons">
            {["instagram", "xAccount", "github"].map((sns, i) => {
              const Icon = [FaInstagram, FaXTwitter, FaGithub][i];
              const value = { instagram, xAccount, github }[sns];
              const setValue = [setInstagram, setXAccount, setGithub][i];
              const url = {
                instagram: `https://instagram.com/${value}`,
                xAccount: `https://x.com/${value}`,
                github: `https://github.com/${value}`,
              }[sns];

              return isEditing ? (
                <div key={sns}>
                  <Icon size={24} color="#ffb6c1" />
                  <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
                </div>
              ) : (
                value && (
                  <a key={sns} href={url} target="_blank" rel="noreferrer">
                    <Icon size={24} color="#ffb6c1" />
                  </a>
                )
              );
            })}
          </div>

          {isEditing ? (
            <>
              <button className="edit-button" onClick={handleSave}>Save</button>
              <button className="edit-button" onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          ) : (
            <button className="edit-button" onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </div>
      </div>

      <div className="profile-right">
        {/* 研究室 */}
        <h3>研究室</h3>
        {isEditing ? (
          <>
            <div className="tag-select">
              {labOptions
                .filter(option => option.id !== 0) // Assuming 0 is "所属なし" and shouldn't be selectable as a real lab
                .map((option) => (
                  <button
                    key={option.id}
                    className={`tag-button ${lab === option.id ? "selected" : ""}`}
                    onClick={() => setLab(option.id)} // Only set the ID
                  >
                    {option.name}
                  </button>
                ))}
            </div>
            <button className="add-button" onClick={addNewLab}>＋ 研究室を追加</button>
          </>
        ) : (
          <span className="tag-button selected readonly">
            {labOptions.find(l => l.id === lab)?.name || "所属なし"}
          </span>
        )}

        {/* サークル */}
        <h3>サークル</h3>
        {isEditing ? (
          <>
            <div className="tag-select">
              {circleOptions
                .filter(option => option.id !== 0) // Assuming 0 is "所属なし" and shouldn't be selectable as a real circle
                .map((option) => (
                  <button
                    key={option.id}
                    className={`tag-button ${circleId === option.id ? "selected" : ""}`}
                    onClick={() => setCircleId(option.id)} // Only set the ID
                  >
                    {option.name}
                  </button>
                ))}
            </div>
            <button className="add-button" onClick={addNewCircle}>＋ サークルを追加</button>
          </>
        ) : (
          <span className="tag-button selected readonly">
            {circleOptions.find(c => c.id === circleId)?.name || "所属なし"}
          </span>
        )}

        {/* 履修登録 */}
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
            <div>
              {(courseOptionsByYear[selectedYear] || []).map((course) => (
                <button
                  key={course.id}
                  className={`tag-button ${courseRecords[selectedYear]?.includes(course.id) ? "selected" : ""}`}
                  onClick={() => toggleCourse(selectedYear, course.id)}
                >
                  {course.name}
                </button>
              ))}
            </div>
            <button className="add-button" onClick={addNewCourse}>＋ 授業を追加</button>
          </>
        ) : (
          <>
            {yearOptions.map((year) => (
              <div key={year} style={{ marginBottom: "10px" }}>
                <strong>{year}:</strong>
                {courseRecords[year]?.length > 0 ? (
                  <div className="tags-display">
                    {courseRecords[year].map((id) => {
                      // Ensure courseOptionsByYear[year] exists before trying to find
                      const name = courseOptionsByYear[year]?.find(c => c.id === id)?.name || "";
                      return <span key={id} className="tag-button selected readonly">{name}</span>;
                    })}
                  </div>
                ) : (
                  <span>未履修</span>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;