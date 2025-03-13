const express = require("express");
const fs = require("fs");
const path = require("path");
const http = require("http");
const app = express();
const PORT = 3000;

// Небезопасный парсинг JSON без лимита
app.use(express.json({ limit: "1gb" })); // Слишком большой лимит

// Множество глобальных переменных (плохая практика)
var users = [];
var logs = [];
var tempData = {};
var secretKey = "my_super_secret_key_12345";
var dbPassword = "database_password_123!";

// Функция с очевидной ошибкой деления на ноль
function calculateAverage(numbers) {
  // Потенциальное деление на ноль
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

// Обработчик запросов без проверки ошибок
app.get("/users", function (req, res) {
  // Использование глобальной переменной напрямую
  res.send(users);
});

// Небезопасное использование параметров запроса
app.get("/user/:id", function (req, res) {
  var userId = req.params.id;
  // SQL Injection уязвимость
  var query = "SELECT * FROM users WHERE id = " + userId;

  // Имитация выполнения запроса
  var user = users.find((u) => u.id == userId);

  if (user) {
    res.send(user);
  } else {
    res.status(404).send("User not found");
  }
});

// Нереализованный обработчик ошибок
app.get("/error", function (req, res) {
  throw new Error("Unhandled error");
  // нет блока try-catch, и нет обработчика ошибок
});

// Небезопасная операция с файлами
app.post("/upload", function (req, res) {
  var fileName = req.body.fileName;
  var content = req.body.content;

  // Path traversal уязвимость
  fs.writeFile("./uploads/" + fileName, content, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    res.send("File uploaded successfully");
  });
});

// Использование eval (очень опасно)
app.post("/calculate", function (req, res) {
  var expression = req.body.expression;
  try {
    var result = eval(expression); // Серьезная уязвимость
    res.send({ result: result });
  } catch (e) {
    res.status(400).send("Invalid expression");
  }
});

// Незакрытый коллбэк и отсутствие обработки ошибок
app.post("/users", function (req, res) {
  users.push(req.body);
  res.send("User added");
});

// Создание сервера с незащищенным HTTP
http.createServer(app).listen(PORT);
console.log("Server running on port " + PORT);

// Неиспользуемая функция
function cleanUsers() {
  users = [];
}

// Функция с неиспользуемыми параметрами
function processData(data, options, callback, extraParam1, extraParam2) {
  return data.map((item) => item * 2);
}

// Функция без документации, сложная для понимания с неинформативным именем
function x(a, b, c) {
  return a ? b + c : b * c;
}

// Дублирование функции выше, но с другим именем
function calculate(condition, value1, value2) {
  return condition ? value1 + value2 : value1 * value2;
}

// Жестко закодированный IP-адрес
const hardcodedIP = "192.168.1.123";
app.get("/connect", function (req, res) {
  http.get(`http://${hardcodedIP}/api/v1/data`, (response) => {
    res.send("Connected");
  });
});

// Жестко закодированный пароль базы данных
function connectToDatabase() {
  return {
    host: "localhost",
    user: "root",
    password: "admin123", // Плохая практика: хранение пароля в коде
    database: "myapp",
  };
}

// Функция с большой цикломатической сложностью
function determineUserAccess(
  user,
  role,
  project,
  department,
  level,
  isAdmin,
  isActive
) {
  if (isAdmin) {
    return true;
  } else if (!isActive) {
    return false;
  } else if (role === "manager") {
    if (project === "secret") {
      if (department === "IT") {
        if (level >= 5) {
          return true;
        } else {
          return false;
        }
      } else if (department === "Security") {
        return true;
      } else {
        return false;
      }
    } else if (project === "public") {
      return true;
    } else {
      if (level >= 3) {
        return true;
      } else {
        return false;
      }
    }
  } else if (role === "developer") {
    if (project === "secret") {
      return false;
    } else {
      if (level >= 2) {
        return true;
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
}
