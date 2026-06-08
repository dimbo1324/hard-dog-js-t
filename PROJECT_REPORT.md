# Project Modernisation Report

## Определённый язык и стек

Проект написан на чистом JavaScript, HTML и CSS. Основная технология рендера — HTML5 Canvas API. Модули используются через ES Modules. Фреймворки, библиотеки и сборщики не добавлялись.

## Что было изменено

- Проект приведён к аккуратной структуре Git-репозитория.
- Точка входа перенесена в корневой `index.html`.
- Исходный код разложен по зонам ответственности в `src/`.
- Исправлены нестабильные импорты с разным регистром папок.
- Устранена папка с пробелами в имени для констант.
- Введён единый config layer для игровых правил, controls и asset manifest.
- Добавлен `AssetManager` с кэшированием изображений.
- Разделены game loop, Canvas bootstrap, input, state machine, UI, enemies, effects и utils.
- Добавлена базовая обработка ошибок запуска.
- Добавлены инженерные проверки и тестовая структура.
- README переписан как практичная документация проекта.
- Добавлены документы для архитектуры, разработки, безопасности, QA и технического долга.
- Удалены приватные контакты из публичной документации.
- Экспортные отчёты и IDE-настройки не включены в финальный проект.

## Добавленные файлы

- `.gitignore`
- `.editorconfig`
- `.gitattributes`
- `.env.example`
- `package.json`
- `PROJECT_REPORT.md`
- `docs/ARCHITECTURE.md`
- `docs/DEVELOPMENT.md`
- `docs/SECURITY.md`
- `docs/MANUAL_QA.md`
- `docs/TECH_DEBT.md`
- `tools/dev-server.mjs`
- `tools/check-imports.mjs`
- `tools/security-scan.mjs`
- `tests/config.test.mjs`
- Новая структура `src/`

## Переработанные зоны

- `app/classes/Game.js` → `src/game/Game.js`
- `app/classes/Player.js` → `src/entities/player/Player.js`
- `app/classes/InputHandler.js` → `src/input/InputHandler.js`
- `app/classes/UI.js` → `src/ui/CanvasUI.js`
- `app/classes/States/*` → `src/states/*`
- `app/classes/Enemies/*` → `src/entities/enemies/*`
- `app/classes/effects/*` → `src/entities/effects/*`
- `app/background/*` → `src/rendering/background/*`
- `app/enums and constants/*` → `src/config/*`
- `app/links/*` → `src/assets/AssetManager.js` и `src/config/assets.js`
- `app/main/*` → `src/core/*` и `src/main.js`
- `app/style.css` → `src/styles/main.css`

## Исправленные проблемы

- Case-sensitive import bugs: `../Classes`, `../Background`, `../Base`, `StateHIT.js` могли ломаться на Linux/macOS с чувствительной файловой системой.
- Неправильное название `Enemie` заменено на `Enemy`.
- Опечатка `handleCollisionSPrites` исправлена в новой структуре.
- Дублирующее создание `FileManager/Image` заменено на общий `AssetManager`.
- Магические числа сгруппированы в конфигурационных файлах.
- Приватные контакты удалены из README.
- Добавлены базовые проверки на опасные паттерны: `eval`, `innerHTML`, inline handlers, возможные секреты.
- Добавлена безопасная отдача статических файлов с защитой от path traversal в dev-server.

## Сохранённая бизнес-логика

- Длительность игры: 18 секунд.
- Начальные жизни: 10.
- Интервал появления врагов: 1000 мс.
- Правило победы: счёт больше 2.
- Правило столкновения: rolling/diving уничтожают врага и дают очко.
- Обычное столкновение отнимает 1 жизнь и переводит игрока в hit-state.
- Набор клавиш сохранён, включая русскую раскладку.
- Debug-режим сохраняет прежний принцип: удерживать `U` 3 секунды.

## Оставшиеся риски

- Restart prompt сохранён, но restart-механика не добавлена, потому что её не было в исходной бизнес-логике.
- Полноценная browser/e2e-проверка не добавлялась, чтобы не вводить зависимости.
- Визуальное отображение зависит от спрайтов и Canvas, поэтому часть проверок остаётся ручной.
- Бинарные font-файлы не включены в итоговый архив; используются fallback-шрифты.

## Выполненные проверки

```bash
npm run check
npm test
```

Результат:

- ES Module import paths: passed.
- Basic security scan: passed.
- Node.js tests: 4 passed.
- Dev server smoke-test через HTTP: passed.
- Проверена выдача `index.html`, `src/main.js` и `assets/images/player.png`.
- Проверено отсутствие font binaries в финальном архиве.

## Как запустить проект

```bash
npm start
```

Открыть:

```text
http://localhost:4173
```

## Как продолжить разработку

1. Создать отдельную Git-ветку.
2. Изменять только нужные модули.
3. Константы менять в `src/config`.
4. Новые чистые правила покрывать тестами в `tests/`.
5. Запускать `npm run check` и `npm test` перед merge.
6. Ручные сценарии проверять по `docs/MANUAL_QA.md`.
