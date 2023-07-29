import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import { database } from "./firebaseConfig";
import Editor from "./components/Editor";
import "./styles.css";
import Login from "./components/Login";

import { useState, useEffect } from "react";

export default function App() {
  const [user, setUser] = useState({});

  useEffect(() => {
    if (user) {
      let usersaved = JSON.parse(localStorage.getItem("user"));
      setUser(usersaved);
    }
  }, []);

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Login user={user} setUser={setUser} />} />
        <Route
          path="/home"
          element={<Home database={database} user={user} setUser={setUser} />}
        />
        <Route path="/editor/:id" element={<Editor database={database} />} />
      </Routes>
    </div>
  );
}
