## Программные зависимости
- nodejs+npm
- imagemagick

## Зависимости js модулей nodejs
В папке с проектом сделать npm

## Инструменты
Рекомендуется использовать LiveReload он умеет компилировать less по сохварению

## Пояснения по папкам
- app 			- Папка с приложением
- bin			- Исполняемые файлы (Скрипт для работы с проектом "deploy")
- deploy		- Папка с компилированным приложением (обфусцированным, готовым к деплою)
- node_modules	- Модули приложения
- tasks			- Задания для сборщика Grunt
- Gruntfile.js	- Конфигурация сборщика Grunt
- package.json	- Зависимости для серверного приложения

## Сборка проекта и запуск локального сервера
npm install
- ./bin/deploy help 	- комментарии по доступным командам
- ./bin/deploy server 	- Запуск локального сервера [http://localhost:3007] для отладки app
- ./bin/deploy build 	- Делает sprite, less, squeeze - в папке deploy будет собранный проект
