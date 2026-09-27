# Учебное приложение Next.js

## Запуск в Docker

Нужен запущенный Docker Desktop (Linux containers) или Docker Engine с Compose.
Команды выполняются в терминале из корня проекта.

1. Если `.env` ещё нет, скопируйте пример:

   ```powershell
   Copy-Item .env.example .env
   ```

2. Укажите свой `POSTGRES_PASSWORD` в `.env`. Если база уже запускалась,
   сохраните прежний пароль: правка `.env` не меняет пароль существующей БД.
3. Соберите и запустите:

   ```sh
   docker compose up -d --build
   ```

Откройте http://localhost:8080. С другой виртуальной машины —
`http://IP_СЕРВЕРА:8080`. Порт задаётся через `HTTP_PORT` в `.env`.
На сервере нужно разрешить входящие подключения к этому порту из лабораторной сети.

Схема: браузер → Nginx → Next.js. PostgreSQL запущен отдельно и сохраняет
данные в volume. Подключение Next.js к БД и таблицы пока не реализованы.
Внутри Docker адрес приложения — `app:3000`, базы — `db:5432`.
На компьютере опубликован только порт Nginx; порты 3000 и 5432 не опубликованы.

- `Dockerfile` собирает существующее приложение и запускает standalone-сервер.
- `next.config.ts` включает standalone-сборку.
- `.dockerignore` исключает зависимости, локальные сборки и `.env` из образа.
- `compose.yaml` запускает три сервиса: `nginx`, `app`, `db`.
- `nginx/default.conf` передаёт HTTP-запросы в Next.js.

## Команды

```sh
# Состояние контейнеров
 docker compose ps

# Журналы (Ctrl+C завершает просмотр)
 docker compose logs -f

# Остановить и удалить контейнеры, сохранив базу
 docker compose down

# Консоль базы с именами по умолчанию
 docker compose exec db psql -U web_app -d web_app
```

`docker compose down -v` удаляет и данные базы — не используйте для обычной остановки.
После изменения исходников повторите `docker compose up -d --build`.
Первый запрос может потребовать нескольких секунд, пока Next.js запускается.

## Разработка без Docker для приложения

```sh
npm install
npm run dev
```

Адрес: http://localhost:3000. В PowerShell при запрете скриптов используйте `npm.cmd`.

```sh
npm run typecheck
npm run build
```
