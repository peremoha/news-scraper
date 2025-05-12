# Інтеграція програмних систем: Проєкт

## Опис проекту

Цей проєкт реалізує систему збору, обробки та відображення новин із використанням скрапера, черг RabbitMQ, бази даних SQLite, GraphQL API та React-інтерфейсу. Авторизація користувачів і управління ролями (`admin`/`user`) також імплементовані.

---

## Структура проекту
project/
├── backend/                        # Усі компоненти бекенду
│   ├── main.py                     # Скрапер для збору новин
│   ├── consumer.py                 # RabbitMQ Consumer: обробляє чергу і зберігає новини
│   ├── flask_graphql_server.py     # Flask GraphQL API для взаємодії з базою даних
│   ├── db/                         # Модуль для роботи з базою даних
│   │   ├── database.py             # SQLAlchemy engine і сесії
│   │   ├── models.py               # Моделі таблиць News і User
│   ├── requirements.txt            # Список залежностей Python
│
├── frontend/                       # React-додаток — інтерфейс користувача
│   ├── src/                        # Основний код React
│   │   ├── components/             # React-компоненти: Login, Register, NewsList, NewsModal тощо
│   │   ├── utils/                  # Утиліти, наприклад, логіка авторизації (auth.js)
│   │   ├── App.js                  # Головний компонент додатка
│   │   ├── index.js                # Точка входу у React-додаток
│   │   └── style.css               # CSS-стилі для додатка
│   ├── package.json                # Список залежностей Node.js проєкту
│   ├── package-lock.json           # Лок-файл залежностей Node.js (згенерований автоматично)
│
├── README.md                       # Документація проєкту

---

## Як запустити проект

---

### 1. **Встановлення залежностей**

#### Python (`backend`):
Перейдіть у папку `backend` і виконайте:
```bash
cd backend
pip install -r requirements.txt
```

#### Node.js (`frontend`):
Перейдіть у папку `frontend` і виконайте:
```bash
cd frontend
npm install
```

---

### 2. **Запуск RabbitMQ**

#### Варіант 1: Вручну (локально встановлений RabbitMQ)
1. Запустіть RabbitMQ як сервіс:
   ```bash
   rabbitmq-service start
   ```
2. Переконайтеся, що RabbitMQ працює:  
   Відкрийте [http://localhost:15672](http://localhost:15672), щоб перевірити RabbitMQ Management UI.  
   - Логін: `guest`  
   - Пароль: `guest`

#### Варіант 2: Через Docker
Якщо у вас не встановлений RabbitMQ локально, ви можете запустити його через Docker:
```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

---

### 3. **Запуск бекенду**

#### 3.1. RabbitMQ Consumer:
Перейдіть у папку `backend` і запустіть скрипт `consumer.py`, який обробляє чергу `news_queue`:
```bash
cd backend
python consumer.py
```

#### 3.2. Flask GraphQL API:
У тій самій папці запустіть GraphQL API:
```bash
python flask_graphql_server.py
```
GraphQL буде доступний за адресою:  
[http://localhost:5000/graphql](http://localhost:5000/graphql)

#### 3.3. Скрапер:
Після запуску GraphQL і RabbitMQ Consumer запустіть скрапер:
```bash
python main.py
```
Скрапер збере новини і помістить їх у чергу RabbitMQ.

---

### 4. **Запуск фронтенду**

1. Перейдіть у папку `frontend`:
   ```bash
   cd frontend
   ```

2. Запустіть React-додаток:
   ```bash
   npm start
   ```

3. Додаток буде доступний за адресою:  
   [http://localhost:3000](http://localhost:3000)

---

## Як перевірити роботу

---

### 1. **GraphQL API**:
- Відкрийте GraphQL Playground за адресою:  
  [http://localhost:5000/graphql](http://localhost:5000/graphql)
- Використовуйте запити, наприклад:
  ```graphql
  query {
     allNews(limit: 5, offset: 0) {
       id
       title
       publicationDate
       sourceUrl
     }
  }
  ```

---

### 2. **React-інтерфейс**:
- Відкрийте [http://localhost:3000](http://localhost:3000) для перегляду списку новин.  
- Авторизація доступна з логіном і паролем.  

---

### 3. **RabbitMQ**:
- Перевірте чергу `news_queue` у RabbitMQ Management UI:  
  [http://localhost:15672](http://localhost:15672)
- Логін: `guest`  
- Пароль: `guest`

---

## Залежності проекту

### Python (`backend`)
Усі залежності перелічені у файлі `requirements.txt`. Основні:
- **SQLAlchemy**: Для ORM.
- **Pika**: Для роботи з RabbitMQ.
- **Selenium**: Для автоматизації збору новин.
- **Flask**: Для створення GraphQL API.
- **Flask-JWT-Extended**: Для авторизації через JWT.
- **Bcrypt**: Для хешування паролів.

### Node.js (`frontend`)
Усі залежності перелічені у файлі `package.json`. Основні:
- **React**: Для створення інтерфейсу користувача.
- **Apollo Client**: Для взаємодії з GraphQL API.
- **React Router**: Для маршрутизації.

---

## Демо ролей (`admin` / `user`)

1. **`admin`:**  
   - Має доступ до створення, редагування та видалення новин.  
   - Відображаються кнопки "Add News", "Edit", "Delete".

2. **`user`:**  
   - Може лише переглядати новини.  
   - Кнопки "Add News", "Edit", "Delete" не відображаються.

---


