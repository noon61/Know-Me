import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./Message.css";

// 画像をimport
import f1Img from './assets/f1.png';
import f2Img from './assets/f2.png';

function ChatRoom() {
  const { userId } = useParams();
  const navigate = useNavigate();

  // 相手の名前と画像を設定
  const partnerName = userId === "1" ? "Endo" : "Hayashi";
  const partnerAvatar = userId === "1" ? f1Img : f2Img;

  const [messages, setMessages] = useState([
    { from: "me", text: "こんにちは！" },
    { from: "other", text: "よろしくね！" }
  ]);

  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: "me", text: input }]);
    setInput("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        {/* ヘッダー */}
        <div className="chat-header">
          <button onClick={() => navigate(-1)}>←</button>
          {partnerName}
        </div>

        {/* メッセージ一覧 */}
        <div className="message-list">
          {messages.map((msg, index) => (
            <div key={index} className="message-row">
              {msg.from === "other" && (
                <img src={partnerAvatar} alt="avatar" className="avatar" />
              )}
              <div className={`message ${msg.from}`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* 入力欄 */}
        <div className="chat-input-area">
          <input
            className="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力..."
          />
          <button className="chat-send-button" onClick={sendMessage}>
            送信
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;
