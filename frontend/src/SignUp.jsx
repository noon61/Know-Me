import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Login.css";

function SignUp() {
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);

  // 入力値のステート
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      const res = await axios.post("http://localhost:3001/api/register", {
        email,
        password,
        name, // nameは今は保存されないけど、DB連携時に役立つので送っておくと◎
      });
      console.log(res.data.message); // 確認用
      setIsRegistered(true); // 成功表示に切り替え
    } catch (err) {
      alert(err.response?.data?.message|| "登録に失敗しました");
    }
  };

  useEffect(() => {
    if (isRegistered) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isRegistered, navigate]);

  return (
    <div className="login-container">
      <div className="login-card">
        {isRegistered ? (
          <h2>ありがとうございました</h2>
        ) : (
          <>
            <h2>新規登録</h2>
            <input
              type="text"
              placeholder="名前"
              className="login-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="メールアドレス"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="パスワード"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSignUp} className="login-button">
              登録する
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default SignUp;