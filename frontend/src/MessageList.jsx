import { useNavigate } from "react-router-dom";
import './MessageList.css';
import yukiImg from './assets/f1.png';
import sotaImg from './assets/f2.png';

function MessageList() {
  const navigate = useNavigate();

  // 仮データ：今後はAPIから取得も可能
  const users = [
    { id: "1", name: "Endo", avatar: yukiImg, lastMessage: "よろしくね〜" },
    { id: "2", name: "Hayashi", avatar: sotaImg, lastMessage: "また話そう！" }
  ];

  return (
    <div className="message-list-wrapper">
      <h2 className="message-list-title"></h2>
      <ul className="message-list">
        {users.map(user => (
          <li key={user.id} className="message-item" onClick={() => navigate(`/message/${user.id}`)}>
            <img src={user.avatar} alt={user.name} className="message-avatar" />
            <div className="message-info">
              <div className="message-name">{user.name}</div>
              <div className="message-last">{user.lastMessage}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MessageList;
