import React, { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";

let name = sessionStorage.getItem("userName");
if (!name) {
  name = prompt("Enter your name") || Math.random().toString();
  sessionStorage.setItem("userName", name);
}

const URL = `http://localhost:4000?user=${name}`;
const socket = io(URL, {
  autoConnect: false,
});

const fakeMessages = [
  { userName: "Bob", message: "Hi" },
  { userName: "Sam", message: "Hello" },
];

function App() {
  const [users, setUsers] = useState<string[]>(["a", "b"]);
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("userName") as string;
    setUsername(storedUsername);
    socket.connect();
    function onUsersEvent(updatedUsers: string[]) {
      setUsers(updatedUsers);
    }

    function onMessagesEvent(updatedMEssages: any[]) {
      setMessages(updatedMEssages);
    }

    socket.on("users", onUsersEvent);
    socket.on("messages", onMessagesEvent);

    return () => {
      socket.off("users", onUsersEvent);
      socket.off("messages", onMessagesEvent);
      socket.close();
    };
  }, []);

  const handleSumbit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("messages", message);
    setMessage("");
  };

  return (
    <div className='App'>
      <header className='App-header'>Mini Chat</header>
      <h1>Hello {username}</h1>
      <div className='wrap'>
        <div className='messages'>
          <h2>Messages</h2>
          <ul>
            {messages.map((mes) => (
              <li key={Math.random()}>
                <span>{mes.user}: </span>
                {mes.message}
              </li>
            ))}
          </ul>
          <form onSubmit={handleSumbit}>
            <input
              type='text'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type='submit'>Send</button>
          </form>
        </div>
        <div className='users'>
          <h2>Users</h2>
          <ul>
            {users.length &&
              users.map((us) => <li key={Math.random()}>{us}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
