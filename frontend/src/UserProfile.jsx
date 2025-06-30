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
    subjects: ["情報処理演習, アルゴリズムとデータ構造, 応用数学Ⅰ"],

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
  <div className="user-profile-container">
    {/* 左側：画像・名前・SNS・ボタン */}
    <div className="user-profile-left">
      <img src={initialUser.image} className="f1-image" alt="プロフィール" />
      <h3>{initialUser.name}</h3>
      <p>{initialUser.grade}</p>

      <div className="user-sns-icons">
        {instagram && (
          <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noreferrer">
            <FaInstagram size={24} color="#ffb6c1" />
          </a>
        )}
        {xAccount && (
          <a href={`https://x.com/${xAccount}`} target="_blank" rel="noreferrer">
            <FaXTwitter size={24} color="#ffb6c1" />
          </a>
        )}
        {github && (
          <a href={`https://github.com/${github}`} target="_blank" rel="noreferrer">
            <FaGithub size={24} color="#ffb6c1" />
          </a>
        )}
      </div>

      <button className="user-message-button" onClick={() => alert("メッセージ送信画面へ")}>
        Message
      </button>
    </div>

    {/* 右側：コース・研究室・サークルなど */}
    <div className="user-profile-right">
      
      <p><strong>研究室：</strong>{initialUser.lab}</p>
      <p><strong>サークル：</strong>{initialUser.circle}</p>
      <p><strong>履修登録：</strong>{initialUser.subjects}</p>
    </div>
  </div>
);

}

export default UserProfile;
