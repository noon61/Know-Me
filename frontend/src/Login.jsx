import { useNavigate } from "react-router-dom";
import "./Login.css"; // スタイルを別ファイルに分ける場合

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/profile");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <input type="email" placeholder="メールアドレス" className="login-input" />
        <input type="password" placeholder="パスワード" className="login-input" />
        <button onClick={handleLogin} className="login-button">Login</button>
        <p>
        <a href="/signup">新規登録</a>
        {/* <button onClick={handleLogin} className="/sinup">新規登録</button> */}

        </p>
      </div>
    </div>
  );
}

export default Login;
