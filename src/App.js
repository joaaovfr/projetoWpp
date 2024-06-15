import { useEffect, useState } from 'react';
import './App.css';
import Image from './assets/profissao-programador.png';
import SendMessageIcon from './assets/send.png';
import socket from 'socket.io-client'


const io = socket('http://localhost:4000');

function App() {

  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    io.on("users", (users) => setUsers(users))
    io.on("message", (message) => setMessages((messages) => [...messages, message]))
    io.on("connect", (socket) => console.log(socket.id))

  }, [])

  const handleJoin = () => {
    if (name) {
      io.emit("join", name);
      setJoined(true);
    }
  }

  const handleMessage = () => {
    if (message) {
      io.emit("message", { message, name })
      setMessage("");
    }
  }

  if (!joined) {
    return (
      <div>
        <span>Digite seu nome:</span>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={() => handleJoin()}>Entrar</button>
      </div>
    )
  }

  return (
    <div className="container">
      <div className='back-ground'></div>
      <div className='chat-container'>

        <div className='chat-contacts'>
          <div className='chat-options'></div>
          <div className='chat-item'>
            <img src={Image} className='image-profile' alt='' />
            <div className='title-chat-container'>
              <span className='title-message'>CLONE WPP - ESTUDO </span>
              <span className='last-message'>
                {messages.length? `${messages[messages.length - 1].name}: ${messages[messages.length - 1].message}`: ''}
              </span>
            </div>
          </div>
        </div>

        <div className='chat-messages'>
          <div className='chat-options'>
            <div className='chat-item'>
              <img src={Image} className='image-profile' alt='' />
              <div className='title-chat-container'>
                <span className='title-message'>Networking Profissão Programador</span>
                <span className='last-message'>
                  {users.map((user, index) => (
                    <span>{user.name}{index + 1 < users.length? ' , ': ''}</span>
                  ))}
                </span>
              </div>
            </div>
          </div>

          <div className='chat-message-area'>
            {messages.map((message, index) => (
              <div className={message.name === name? 'user-container-message right': 'user-container-message left'}>
                <span
                  key={index}
                  className={message.name === name? 'user-my-message': 'user-other-message'}
                >
                  {message.name}: {message.message}</span>
              </div>

            ))}
          </div>

          <div className='chat-input-area'>
            <input
              className='chat-input'
              placeholder='Mensagem'
              value={message}
              onChange={(e) => setMessage(e.target.value)} />
            <img src={SendMessageIcon} alt='' className='send-message-icon' onClick={() => handleMessage()} />
          </div>

        </div>




      </div>

    </div>
  );
}

export default App;
