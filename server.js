const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

// Небезопасный парсинг JSON (без проверки типа)
app.use(express.json());

// Глобальная переменная (плохая практика)
var users = [];

// Обработчик запросов без проверки ошибок
app.get("/users", function (req, res) {
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

// Запуск сервера без обработки ошибок
app.listen(PORT);
console.log("Server running on port " + PORT);

// Неиспользуемая функция
function cleanUsers() {
  users = [];
}

// Функция без документации, сложная для понимания
function x(a, b, c) {
  return a ? b + c : b * c;
}
