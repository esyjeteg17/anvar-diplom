# SBORIKA — школа инженерного мышления для детей

Дипломный проект: сайт-визитка и система управления для частной школы робототехники
**SBORIKA** (Москва, 4 партнёрских центра, дети 5–14 лет).

Состав:

- **Публичный лендинг** — рассказывает о школе, формате занятий, центрах и преподавателях; содержит интерактивную карту, квиз-генератор промокода и форму заявки.
- **Админ-панель** — закрытая часть для сотрудников: финансы, расписание занятий с посещаемостью, реестр детей, инвентаризация оборудования.
- **Бэкенд** — единое REST-API для обоих фронтов + хранилище данных (PostgreSQL).

## Содержание

- [Технологический стек](#технологический-стек)
- [Структура репозитория](#структура-репозитория)
- [Требования](#требования)
- [Запуск](#запуск)
- [Архитектура backend](#архитектура-backend)
- [Архитектура frontend](#архитектура-frontend)
- [API](#api)
- [Доступ в админ-панель](#доступ-в-админ-панель)
- [Конвенции разработки](#конвенции-разработки)

## Технологический стек

### Frontend (лендинг и админ-панель)

- **Nuxt 4** (Vue 3, структура `app/`)
- **TypeScript** в strict-режиме
- **Tailwind CSS v4** через плагин `@tailwindcss/vite`; токены бренда — в CSS через `@theme`
- **Pinia** через модуль `@pinia/nuxt` для state management
- **Leaflet + OpenStreetMap** — интерактивная карта центров (без API-ключей)
- API — встроенные `$fetch` / `useFetch` Nuxt-а; базовый URL из `runtimeConfig.public.apiBase`

### Backend

- **Python 3.12+**, **Django 5.x**
- **Django REST Framework**
- **PostgreSQL** через `psycopg` v3
- `django-cors-headers` — CORS для фронтов
- `django-environ` — конфигурация через `.env`
- **Session-аутентификация** с `CsrfExemptSessionAuthentication` (защита через CORS-allowlist)

## Структура репозитория

```
Anvar/
├── backend/              # Django + DRF
│   ├── apps/             # Локальные приложения (apps.<name>)
│   │   ├── leads/        # Заявки с лендинга
│   │   ├── centers/      # Партнёрские центры
│   │   ├── staff/        # Сотрудники
│   │   ├── children/     # Дети + родители
│   │   ├── lessons/      # Занятия + посещаемость
│   │   ├── finance/      # Расходы и финансовая сводка
│   │   └── equipment/    # Учёт оборудования (наборы/планшеты/подставки)
│   ├── config/           # settings, urls, api_urls, auth
│   ├── manage.py         # пропатчен — runserver по дефолту на 8042
│   ├── requirements.txt
│   ├── .env              # секреты (не коммитить)
│   └── venv/
├── frontend-landing/     # Публичный лендинг (Nuxt 4, порт 4040)
│   ├── app/
│   │   ├── components/
│   │   │   ├── ui/       # переиспользуемые: BrandLogo, BrandButton, IconGear, ...
│   │   │   ├── layout/   # SiteContainer, SectionWrapper, AdminPage
│   │   │   ├── sections/ # секции лендинга (Hero, About, Lessons, ...)
│   │   │   └── quiz/     # компоненты квиза
│   │   ├── composables/  # useReveal, useDate
│   │   ├── stores/       # Pinia: leads, leadIntent, quiz, app
│   │   ├── pages/
│   │   ├── public/teachers/  # AI-фото преподавателей (Pollinations.ai)
│   │   └── assets/css/main.css
│   └── nuxt.config.ts
├── frontend-admin/       # Админ-панель (Nuxt 4, порт 4041)
│   └── app/
│       ├── components/
│       │   ├── ui/       # Modal, ConfirmDialog, FormField, SelectField, ToastContainer, ...
│       │   ├── layout/   # AdminPage
│       │   ├── children/ # ChildForm
│       │   ├── schedule/ # WeekNav, DayColumn, LessonCard, LessonForm, AttendanceRow
│       │   ├── finance/  # StatCard, ExpenseForm, StaffForm
│       │   └── equipment/
│       ├── composables/  # useApi, useDate
│       ├── stores/       # auth, children, centers, staff, lessons, finance, equipment, toasts
│       ├── pages/        # /login, /finance, /schedule, /children, /equipment
│       ├── layouts/      # default (с sidebar), auth
│       ├── middleware/   # auth.global
│       └── plugins/      # auth.client (bootstrap сессии)
├── CLAUDE.md             # Правила разработки и контекст проекта
└── README.md             # этот файл
```

## Требования

- macOS / Linux (на Windows — через WSL)
- **Python 3.12+**
- **Node.js 20+** и **npm**
- **PostgreSQL 14+** (локально, на стандартном порту 5432)

## Запуск

### 1. PostgreSQL

Создать базу `anvar_db` (имя пользователя — `postgres`, пароль — `postgres`):

```bash
createdb -U postgres anvar_db
# или в psql:
# CREATE DATABASE anvar_db OWNER postgres;
```

Параметры подключения переопределяются в `backend/.env` (см. `backend/.env.example`).

### 2. Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser   # для входа в админ-панель
python manage.py runserver         # автоматически встанет на 8042
```

После запуска доступно:

- API: <http://localhost:8042/api/>
- Health-check: <http://localhost:8042/api/health/>
- Django admin: <http://localhost:8042/admin/>

### 3. Лендинг

```bash
cd frontend-landing
npm install
npm run dev
```

Открыть: <http://localhost:4040/>

### 4. Админ-панель

```bash
cd frontend-admin
npm install
npm run dev
```

Открыть: <http://localhost:4041/>

## Архитектура backend

Каждое приложение в `backend/apps/<name>/` строится по единому шаблону:

- `models.py` — Django-модели с `verbose_name` на русском.
- `serializers.py` — DRF-сериализаторы с валидацией.
- `views.py` — ViewSet'ы для CRUD; кастомные `@action` для агрегатов
  (`/finance/expenses/summary/`, `/equipment/summary/`, `/equipment/adjust/`).
- `urls.py` — DefaultRouter, монтируется в `config/api_urls.py` под префиксом `/api/<name>/`.
- `admin.py` — Django admin с фильтрами, поиском и быстрой правкой.

### Основные модели

| Приложение  | Модель        | Назначение                                      |
|-------------|---------------|-------------------------------------------------|
| `leads`     | `Lead`        | Заявка с лендинга (имя, телефон, промокод, статус) |
| `centers`   | `Center`      | Партнёрский центр (адрес, координаты)           |
| `staff`     | `Staff`       | Сотрудник (роль, зарплата, статус)              |
| `children`  | `Child`       | Ребёнок + родители (центр, абонемент)           |
| `lessons`   | `Lesson`      | Занятие (центр, преподаватель, дата, тема)      |
| `lessons`   | `Attendance`  | Присутствие ребёнка на занятии + комментарий    |
| `finance`   | `Expense`     | Расход с категорией и суммой                    |
| `equipment` | `Equipment`   | Счётчик оборудования по типу                    |

### Аутентификация

Session-based: фронт-админка постится на `/api/auth/login/`, получает `sessionid` cookie,
далее ходит с `credentials: include`. CSRF-проверка отключена через
кастомный `CsrfExemptSessionAuthentication` — защита от CSRF идёт через
строгий CORS-allowlist (только `localhost:4040` и `localhost:4041`).

## Архитектура frontend

### Лендинг (`frontend-landing`)

Одна страница со следующими секциями:

1. **Navbar** — sticky-шапка с логотипом, якорной навигацией, CTA «Записаться».
2. **Hero** — крупный логотип SBORIKA, заголовок «Робототехника для детей»,
   возраст «5–14 лет», CTA на квиз. Декор: парящие LEGO-кубики,
   вращающиеся шестерёнки с parallax-эффектом при скролле.
3. **Marquee** — бегущая лента «Собирай • Думай • Создавай».
4. **About** — миссия и 4 карточки ценностей.
5. **Stats** — 4 анимированных счётчика с иконками.
6. **Lessons** — две панели: «На занятиях дети» и «Формат занятий».
7. **Marquee** — вторая лента-разделитель.
8. **Centers** — интерактивная карта Leaflet + 4 карточки центров.
9. **Teachers** — карточки преподавателей с AI-фото.
10. **Quiz** — 10-вопросный квиз; промокод по результату.
11. **Contacts** — телефон, ВКонтакте, форма заявки (отправляется в Django).
12. **Footer** — бренд, навигация, copyright.

#### Особенности

- **Параметризация через пропсы**: `IconGear` (12 пропсов), `BrandButton`
  (variant + size + as link/button), `IconCard`, `CenterCard`, `TeacherCard`
  и т.д. — один компонент покрывает все варианты.
- **Анимации появления** — `useReveal` (composable на IntersectionObserver) +
  компонент `<Reveal direction delay duration>` для stagger-эффектов.
- **Брендовые токены** — `--color-bg / brand / line / slate / ink` в `@theme`.
  Никакого хардкода hex.
- **Связь квиз → форма** — стор `useLeadIntentStore` хранит промокод
  между секциями; форма контактов автозаполняется и отправляет с `source=landing/quiz`.

### Админ-панель (`frontend-admin`)

Защищённое приложение. Глобальный middleware `auth.global` редиректит на `/login`
при отсутствии сессии. Layout с боковым меню (5 пунктов).

| Страница       | URL          | Что показывает                                      |
|----------------|--------------|-----------------------------------------------------|
| Финансы        | `/finance`   | 4 stat-карточки (доход / зарплаты / расходы / прибыль), CRUD сотрудников и расходов |
| Расписание     | `/schedule`  | Недельный календарь занятий (свой grid), модалка с темой и автосохранением посещаемости |
| Дети           | `/children`  | Таблица с поиском и фильтром по центру, CRUD       |
| Оборудование   | `/equipment` | Счётчики «наборы / планшеты / подставки» с кнопками +1 / −1 |

#### Особенности

- **Toast-уведомления** — глобальный стор `toasts` + `<ToastContainer>` в layout.
  Все CRUD-операции автоматически показывают «Сохранено» / «Не удалось сохранить».
- **Modal через Teleport** — закрытие по Esc / клику вне / крестику; блокировка скролла body.
- **`useApi` composable** — единая обёртка над `$fetch` с `credentials: include`.
- **Свой календарь расписания** — без библиотек: `WeekNav` + 7 `DayColumn` + `LessonCard`.

## API

Под префиксом `/api/`:

| Endpoint                                | Метод                  | Описание                                  |
|-----------------------------------------|------------------------|-------------------------------------------|
| `/auth/login/`                          | POST                   | Логин: `{username, password}` → sessionid |
| `/auth/logout/`                         | POST                   | Выход                                     |
| `/auth/me/`                             | GET                    | Текущий пользователь                      |
| `/health/`                              | GET                    | Health-check                              |
| `/leads/`                               | POST                   | Создание заявки (публичный)               |
| `/centers/`                             | GET / POST / PUT / DELETE | CRUD центров                            |
| `/staff/`                               | GET / POST / PUT / DELETE | CRUD сотрудников                        |
| `/children/`                            | GET / POST / PUT / DELETE | CRUD детей                              |
| `/lessons/?date_from=&date_to=&center=` | GET                    | Занятия за период                         |
| `/lessons/`                             | POST / PUT / DELETE    | CRUD занятий                              |
| `/lessons/attendance/`                  | GET / POST / PUT / DELETE | CRUD посещаемости                       |
| `/finance/expenses/`                    | GET / POST / PUT / DELETE | CRUD расходов                           |
| `/finance/expenses/summary/?date_from=&date_to=` | GET           | Сводка: доход, зарплаты, расходы, прибыль |
| `/equipment/`                           | GET                    | 3 записи (наборы/планшеты/подставки)      |
| `/equipment/adjust/`                    | POST                   | `{type, delta}` — +1 / −1                  |

Все защищённые роуты требуют сессию (см. `auth/login`).

## Доступ в админ-панель

После `python manage.py createsuperuser` — войти на <http://localhost:4041/login>
с этими учётными данными.

В разработке для удобства создан тестовый пользователь:

```
Логин:  admin
Пароль: admin
```

(Создаётся через стандартный Django-механизм `createsuperuser`,
не зашит в код.)

## Конвенции разработки

Полный свод правил (стек, структура, конвенции именования, правила работы
с компонентами, ограничения по библиотекам) — в [CLAUDE.md](./CLAUDE.md).

Ключевые принципы:

- **Все комментарии в коде — на русском** (требование диплома).
- **Только Pinia** для state management — никакого Vuex или ad-hoc-стора.
- **Только Tailwind utility-классы** — без UI-китов (Nuxt UI, Vuetify и т.д.).
- **Брендовые токены** — через CSS-переменные в `@theme`. Никакого хардкода hex.
- **Максимальная декомпозиция компонентов** — каждый повторяющийся UI-элемент
  выносится в отдельный компонент с пропсами для вариаций.
- **Backend-приложения** регистрируются как `apps.<name>` и монтируются
  через `path("<resource>/", include("apps.<name>.urls"))`.

## Лицензии и атрибуции

- Карты: [OpenStreetMap](https://www.openstreetmap.org/copyright) (ODbL).
- AI-фото преподавателей: [Pollinations.ai](https://pollinations.ai), бесплатное использование.
- Шрифт: Inter (Google Fonts, OFL).
