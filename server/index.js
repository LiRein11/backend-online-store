require('dotenv').config();
const sequelize = require('./db');
const express = require('express');
const models = require('./models/models');
const cors = require('cors');
const router = require('./routes/index')

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors()); // Для того, чтобы отправлять запросы с браузера
app.use(express.json()); // Для того, чтобы приложение могло парсить json формат
app.use('/api', router)


const start = async () => {
  try {
    await sequelize.authenticate(); // С помощью этой функции будет устанавливаться подключение к БД
    await sequelize.sync(); // Функция будет сверять состояние БД со схемой данных
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
