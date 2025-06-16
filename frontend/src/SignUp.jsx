import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Login.css";

function SignUp() {
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);

  const handleSignUp = () => {
    // 登録処理をここで行う（仮）
    setIsRegistered(true); // メッセージ表示をONにする
  };

  useEffect(() => {
    if (isRegistered) {
      // 1秒後にログイン画面へ遷移
      const timer = setTimeout(() => {
        navigate("/");
      }, 1000);//ミリ秒単位

      // クリーンアップ
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
            <input type="text" placeholder="名前" className="login-input" />
            <input type="email" placeholder="メールアドレス" className="login-input" />
            <input type="password" placeholder="パスワード" className="login-input" />
            <button onClick={handleSignUp} className="login-button">登録する</button>
          </>
        )}
      </div>
    </div>
  );
}

export default SignUp;
