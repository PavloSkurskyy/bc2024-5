// Імпорт необхідних модулів
const { Command } = require('commander'); // Модуль для обробки командного рядка
const express = require('express');       // Модуль для створення веб-сервера

// Ініціалізація Commander.js
const program = new Command();

program
  .requiredOption('-h, --host <host>', 'Адреса сервера') // Обов'язковий параметр: хост
  .requiredOption('-p, --port <port>', 'Порт сервера')  // Обов'язковий параметр: порт
  .requiredOption('-c, --cache <path>', 'Шлях до кешованих файлів'); // Обов'язковий параметр: шлях до кешу

// Обробка аргументів
program.parse(process.argv);
const options = program.opts();

// Перевірка параметрів
if (!options.host || !options.port || !options.cache) {
  console.error('Помилка: Усі параметри (-h, -p, -c) мають бути задані!');
  process.exit(1); // Завершити виконання програми з помилкою
}

// Ініціалізація Express.js
const app = express();

// Додаткові маршрути (можна додати, якщо потрібно)
app.get('/', (req, res) => {
  res.send('Веб-сервер працює!'); // Відповідь для головного маршруту
});

// Запуск сервера
const host = options.host; // Адреса сервера
const port = options.port; // Порт сервера

app.listen(port, host, () => {
  console.log(`Сервер запущено на http://${host}:${port}`);
  console.log(`Шлях до кешу: ${options.cache}`);
});
