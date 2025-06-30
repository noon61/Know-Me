import React from 'react';
import { useParams } from 'react-router-dom';
import './Profile.css';
import profileImage from './assets/f1.png'; // ← ここで読み込む

function UserProfile() {
  const { id } = useParams();

  const user = {
    id,
    name: "鈴木　花子",
    grade: "2年 情報システムコース",
    lab: "石尾研",
    circle: "Dance.Sarfy, FUNGC",
    subjects: ["情報処理演習", "アルゴリズムとデータ構造", "応用数学Ⅰ"],
    instagram: "fun_hakodate",
    x_account: "Funcl_GI",
    github: "Funcy-ICT",
    image: profileImage // ← importした画像をここで使う
  };

  return (
    <div className="profile-container">
      <div className="profile-left">
        <img src={user.image} className="f1-image" alt="プロフィール" />
        <h3>{user.name}</h3>
        <p>{user.grade}</p>
        <p>{user.lab}</p>
        <p>{user.circle}</p>

        <div className="sns-icons">
          {user.instagram && (
            <a href={`https://instagram.com/${user.instagram}`} target="_blank" rel="noreferrer">
              Instagram
            </a>
          )}
          {user.x_account && (
            <a href={`https://x.com/${user.x_account}`} target="_blank" rel="noreferrer">
              X（旧Twitter）
            </a>
          )}
          {user.github && (
            <a href={`https://github.com/${user.github}`} target="_blank" rel="noreferrer">
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
