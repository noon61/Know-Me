import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './UserProfile.css';
import profileImage from './assets/f1.png';
import { FaInstagram, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

function UserProfile() {
  const { id } = useParams();

  const initialUser = {
    id,
    name: "鈴木　花子",
    grade: "2年 情報システムコース",
    lab: "石尾研",
    circle: "Dance.Sarfy, FUNGC",
    subjects: ["情報処理演習", "アルゴリズムとデータ構造", "応用数学Ⅰ"],
    instagram: "fun_hakodate",
    x_account: "Funcl_GI",
    github: "Funcy-ICT",
    image: profileImage
  };

  const [isEditing, setIsEditing] = useState(false);
  const [instagram, setInstagram] = useState(initialUser.instagram);
  const [xAccount, setXAccount] = useState(initialUser.x_account);
  const [github, setGithub] = useState(initialUser.github);

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => {
    // 必要であればここで保存処理（例: API呼び出し）を書く
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-left">
        <img src={initialUser.image} className="f1-image" alt="プロフィール" />
        <h3>{initialUser.name}</h3>
        <p>{initialUser.grade}</p>
        <p>{initialUser.lab}</p>
        <p>{initialUser.circle}</p>

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
            <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noreferrer">
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
            <a href={`https://x.com/${xAccount}`} target="_blank" rel="noreferrer">
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
            <a href={`https://github.com/${github}`} target="_blank" rel="noreferrer">
              <FaGithub size={24} color="#ffb6c1" />
            </a>
          ) : null}
        </div>
        <button className="message-button" onClick={() => alert("メッセージ送信画面へ")}>
          send message
        </button>

        {/* <button className="edit-button" onClick={isEditing ? handleSave : handleEdit}>
          {isEditing ? 'Save' : 'Edit Profile'}
        </button> */}
      </div>
    </div>
  );
}

export default UserProfile;
