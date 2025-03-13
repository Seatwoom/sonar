import React, { useState, useEffect } from "react";
import axios from "axios";

// Компонент с множеством проблем
function UserDashboard() {
  // Неоптимальное объявление состояния
  const [state, setState] = useState({
    users: [],
    isLoading: false,
    error: null,
    filter: "",
    page: 1,
    showModal: false,
    selectedUser: null,
    modalContent: "",
    searchTerm: "",
    sortOrder: "asc",
    filterOptions: ["all", "active", "inactive"],
    selectedFilter: "all",
  });

  // Избыточные useEffect с зависимостями
  useEffect(() => {
    setState({ ...state, isLoading: true });

    // Функция без обработки ошибок
    fetch("https://api.example.com/users")
      .then((response) => response.json())
      .then((data) => {
        setState({ ...state, users: data, isLoading: false });
      });
  }, [state.page, state.filter]); // Неправильные зависимости

  // Избыточная функция
  const handleSearch = (e) => {
    // Хранение события в состоянии (плохая практика)
    setState({ ...state, searchTerm: e.target.value });
  };

  // Дублирование логики
  const handleFilter = (e) => {
    setState({ ...state, filter: e.target.value });
  };

  // Утечка памяти (setState в таймауте без очистки)
  useEffect(() => {
    const timer = setTimeout(() => {
      setState({ ...state, isLoading: false });
    }, 3000);
    // Отсутствует return () => clearTimeout(timer);
  }, []);

  // Небезопасная обработка данных
  const renderUserInfo = (user) => {
    // XSS уязвимость
    return <div dangerouslySetInnerHTML={{ __html: user.description }} />;
  };

  // Игнорирование условий ошибки
  const deleteUser = (id) => {
    const newUsers = state.users.filter((user) => user.id !== id);
    setState({ ...state, users: newUsers });

    // Отсутствие обработки ошибок
    axios.delete(`https://api.example.com/users/${id}`);
  };

  // Неоптимальный рендеринг
  return (
    <div className="dashboard">
      <h1>User Dashboard</h1>

      {/* Отсутствие ключей в списке */}
      <ul>
        {state.users.map((user) => (
          <li>
            {user.name} - {user.email}
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Дублирование стилей inline */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "20px",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          backgroundColor: "#f8f8f8",
        }}
      >
        <input
          type="text"
          placeholder="Search users..."
          onChange={handleSearch}
          style={{
            marginBottom: "10px",
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />

        <select
          onChange={handleFilter}
          style={{
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        >
          {state.filterOptions.map((option) => (
            <option value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Небезопасное условное отображение */}
      {state.isLoading && <div>Loading...</div>}
    </div>
  );
}

export default UserDashboard;
