import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import profileImage from "./assets/Profile.png";
import { FaInstagram, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import "./Profile.css";

function UserProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {}; // ユーザーIDを取得

  const [name, setName] = useState("函館　未来");
  const [grade, setGrade] = useState("2年　情報システムコース");
  const [lab, setLab] = useState("所属なし");
  const [circle, setCircle] = useState([]);
  const [image, setImage] = useState(profileImage);
  const [instagram, setInstagram] = useState("fun_hakodate");
  const [xAccount, setXAccount] = useState("Funcl_GI");
  const [github, setGithub] = useState("Funcy-ICT");

  const yearOptions = [
    "学部1年",
    "学部2年",
    "学部3年",
    "学部4年",
    "修士1年",
    "修士2年",
  ];

  const [courseRecords, setCourseRecords] = useState({
    "学部1年": [],
    "学部2年": [],
    "学部3年": [],
    "学部4年": [],
    "修士1年": [],
    "修士2年": [],
  });


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/students/" + userId, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log("Fetched user profile:", data);

        if (data) {
          setName(data.name || "函館　未来");
          setGrade(data.grade || "2年　情報システムコース");
          setLab(data.lab_name || "所属なし");
          setCircle(data.circle_name ? [data.circle_name] : []);
          setInstagram(data.instagram || "fun_hakodate");
          setXAccount(data.x_account || "Funcl_GI");
          setGithub(data.github || "Funcy-ICT");

          const newRecords = {
            "学部1年": [],
            "学部2年": [],
            "学部3年": [],
            "学部4年": [],
            "修士1年": [],
            "修士2年": [],
          };

          data.subjects.forEach((subject) => {
            if (subject.grade && newRecords[subject.grade]) {
              newRecords[subject.grade].push(subject.name);
            }
          });
          console.log("New course records:", newRecords);

          setCourseRecords(newRecords);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);



  return (
    <div className="profile-container">
      <div className="profile-left">
        <img src={image} alt="プロフィール画像" className="profile-image" />
        <div className="profile-name-info">
          <h3>{name}</h3>
          <p>{grade}</p>
          <div className="sns-icons">
            <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noreferrer">
              <FaInstagram size={24} color="#ffb6c1" />
            </a>
            <a href={`https://x.com/${xAccount}`} target="_blank" rel="noreferrer">
              <FaXTwitter size={24} color="#ffb6c1" />
            </a>
            <a href={`https://github.com/${github}`} target="_blank" rel="noreferrer">
              <FaGithub size={24} color="#ffb6c1" />
            </a>
          </div>
        </div>
        <div>
          <button className="edit-button"onClick={()=>navigate("../message")}>メッセージ</button>
        </div>
      </div>

      <div className="profile-right">
        <h3>研究室</h3>
        <div className="tag-container">
          <span className="tag-button selected readonly">{lab}</span>
        </div>

        <h3>サークル</h3>
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

        <h3>履修登録</h3>
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
      </div>
    </div>
  );
}

export default UserProfile;
