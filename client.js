// React компонент с множеством проблем для SonarQube
import React, { useState, useEffect } from "react";
import axios from "axios";

// Намеренно использую глобальные переменные для состояния (плохая практика)
let globalUsers = [];
let globalError = null;

// Компонент с проблемами
function UserDashboard() {
  // Неоптимальное объявление состояния с избыточными полями
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
    unused1: null,
    unused2: "",
    unused3: 0,
  });

  // Дублирующие переменные состояния
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Явная бесконечная рекурсия
  function recursiveFunction() {
    return recursiveFunction();
  }

  // Утечка памяти с использованием setInterval без очистки
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("This interval runs forever and never cleans up");
      setState({ ...state });
    }, 1000);
    // Отсутствует return () => clearInterval(interval);
  }, []);

  // Избыточные useEffect с опасными зависимостями, вызывающие повторный рендеринг
  useEffect(() => {
    setState({ ...state, isLoading: true });
    globalUsers = [...globalUsers, { id: Math.random() }]; // Модификация глобальной переменной

    // Функция без обработки ошибок
    fetch("https://api.example.com/users")
      .then((response) => response.json())
      .then((data) => {
        setState({ ...state, users: data, isLoading: false });
      });
    // Отсутствует .catch для обработки ошибок
  }, [state]); // Опасная зависимость, вызывающая бесконечный цикл

  // Дублированный код с первым useEffect
  useEffect(() => {
    setState({ ...state, isLoading: true });

    fetch("https://api.example.com/users")
      .then((response) => response.json())
      .then((data) => {
        setState({ ...state, users: data, isLoading: false });
      });
  }, [state.page, state.filter]);

  // Вложенная функция с чрезмерной сложностью и множеством параметров
  function complexFunction(a, b, c, d, e, f, g, h, i, j, k) {
    let result = 0;

    if (a > b) {
      if (c > d) {
        if (e > f) {
          if (g > h) {
            if (i > j) {
              result = k * 2;
            } else {
              result = k / 2;
            }
          } else {
            if (i > j) {
              result = k + 2;
            } else {
              result = k - 2;
            }
          }
        } else {
          result = k * 4;
        }
      } else {
        result = k / 4;
      }
    } else {
      result = k;
    }

    return result;
  }

  // Небезопасная обработка данных с использованием eval
  function calculateValue(expression) {
    return eval(expression); // Критическая уязвимость безопасности
  }

  // Функция с SQL-инъекцией
  function getUserByName(name) {
    // SQL-инъекция
    const query = `SELECT * FROM users WHERE name = '${name}'`;
    console.log(query);
    return query;
  }

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

  // Хранение учетных данных в коде
  const credentials = {
    username: "admin",
    password: "super_secret_password123!",
    apiKey: "AKIAIOSFODNN7EXAMPLE",
  };

  // Функция с жесткой привязкой к порядку параметров
  function processUser(name, email, age, id, role) {
    // Создание потенциального null reference
    const user = null;
    console.log(user.name); // Потенциальный null reference exception

    return `User ${name} with email ${email} is ${age} years old`;
  }

  // Функция с множеством console.log
  function debugFunction() {
    console.log("Debug 1");
    console.log("Debug 2");
    console.log("Debug 3");
    console.log("Debug 4");
    console.log("Debug 5");
    console.log("This is a secret:", credentials.password);
  }

  // Неоптимальный рендеринг с повторяющимися стилями
  return (
    <div className="dashboard">
      <h1>User Dashboard</h1>

      {/* Отсутствие ключей в списке */}
      <ul>
        {state.users.map((user) => (
          <li>
            {user.name} - {user.email}
            <button onClick={() => deleteUser(user.id)}>Delete</button>
            {/* Прямое использование eval в JSX */}
            <span>{eval("user.age * 2")} years old in 2 years</span>
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
          onChange={(e) => setState({ ...state, searchTerm: e.target.value })}
          style={{
            marginBottom: "10px",
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />

        <select
          onChange={(e) => setState({ ...state, filter: e.target.value })}
          style={{
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        >
          {/* Отсутствие ключей в списке опций */}
          {state.filterOptions.map((option) => (
            <option value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Повторение дублирующих стилей */}
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
          placeholder="Another search box..."
          style={{
            marginBottom: "10px",
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
      </div>

      {/* Небезопасное условное отображение */}
      {state.isLoading && <div>Loading...</div>}

      {/* Задвоенное условие с предыдущим */}
      {state.isLoading ? <div>Loading data, please wait...</div> : null}
    </div>
  );
}

export default UserDashboard;
