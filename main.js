const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Отримання параметра --cache з командного рядка
const cacheDir = process.argv.find(arg => arg.startsWith('--cache='))
    ?.split('=')[1] || './cache';

// Перевірка існування директорії кешу
if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir);
}

// Маршрут для отримання тексту нотатки
app.get('/notes/:name', (req, res) => {
    const noteName = req.params.name;
    const notePath = path.join(cacheDir, noteName);

    if (!fs.existsSync(notePath)) {
        return res.status(404).send('Not found');
    }

    const noteText = fs.readFileSync(notePath, 'utf-8');
    res.status(200).send(noteText);
});

// Маршрут для оновлення тексту нотатки
app.put('/notes/:name', (req, res) => {
    const noteName = req.params.name;
    const notePath = path.join(cacheDir, noteName);

    if (!fs.existsSync(notePath)) {
        return res.status(404).send('Not found');
    }

    const newText = req.body.text;
    fs.writeFileSync(notePath, newText);
    res.status(200).send('Note updated');
});

// Маршрут для видалення нотатки
app.delete('/notes/:name', (req, res) => {
    const noteName = req.params.name;
    const notePath = path.join(cacheDir, noteName);

    if (!fs.existsSync(notePath)) {
        return res.status(404).send('Not found');
    }

    fs.unlinkSync(notePath);
    res.status(200).send('Note deleted');
});

// Маршрут для отримання списку всіх нотаток
app.get('/notes', (req, res) => {
    const files = fs.readdirSync(cacheDir);
    const notes = files.map(file => {
        const filePath = path.join(cacheDir, file);
        const text = fs.readFileSync(filePath, 'utf-8');
        return { name: file, text };
    });

    res.status(200).json(notes);
});

// Маршрут для створення нової нотатки
app.post('/write', (req, res) => {
    const { note_name, note } = req.body;
    const notePath = path.join(cacheDir, note_name);

    if (fs.existsSync(notePath)) {
        return res.status(400).send('Note already exists');
    }

    fs.writeFileSync(notePath, note);
    res.status(201).send('Note created');
});

// Маршрут для отримання HTML-форми
app.get('/UploadForm.html', (req, res) => {
    const formPath = path.join(__dirname, 'UploadForm.html');
    res.sendFile(formPath);
});

// Запуск сервера
const host = process.argv.find(arg => arg.startsWith('--host='))
    ?.split('=')[1] || 'localhost';

const port = process.argv.find(arg => arg.startsWith('--port='))
    ?.split('=')[1] || 3000;

app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
