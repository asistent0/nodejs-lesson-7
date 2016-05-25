# nodejs-lesson-7
Lesson 7

Для работы приложения перед его зауском необходимо установить базу данных mongoDB и выполнить 2 команды

    > npm install
    > bower install

и после можно запустить одной из следующих команд:

    > node app.js
    > npm start

И открыть браузер по адресу <http://localhost:8000/>.

# API приложения

    localhost:8000/                   - method GET - получение всех задач
    localhost:8000/todo/add           - method POST - Добавление задач (передача данных в теле запроса title, date, description)
    localhost:8000/todo/edit/:id      - method PUT - Редактирование задачи
    localhost:8000/todo/completed/:id - method PATCH - Изменение готовности задачи
    localhost:8000/todo/dell/:id      - method DELETE - Удаление задачи
    localhost:8000/user/login         - method POST - Вход в приложение (передача данных в теле запроса username и password)
    localhost:8000/user/register      - method POST - Регистрация (передача данных в теле запроса username и password)
    localhost:8000/user               - method GET - Получение данных пользователя  (передача данных в теле запроса username)
    localhost:8000/user/logout        - method GET - Выход из приложения