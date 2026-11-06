// Импортируем базовый класс Plugin и утилиту Notice из типов Obsidian
import { Plugin, Notice } from 'obsidian';

// Наш главный класс наследуется от Plugin. Это требование Obsidian API.
export default class PrelatexPlugin extends Plugin {

    // Этот метод вызывается Obsidian, когда пользователь включает плагин в настройках
    async onload() {
        console.log('Загрузка плагина Prelatex...');

        // Добавляем команду, которая будет видна в палитре команд Obsidian (Ctrl/Cmd + P)
        this.addCommand({
            id: 'test-ast-command',
            name: 'Тест: Проверка работы Prelatex',
            callback: () => {
                // Показываем всплывающее уведомление в интерфейсе Obsidian
                new Notice('Prelatex: AST модуль готов к работе! 🚀');
                console.log('Команда выполнена успешно. Архитектура работает. Какой восторг!.');
            }
        });
    }

    // Этот метод вызывается, когда пользователь выключает плагин
    onunload() {
        console.log('Выгрузка плагина Prelatex. Очистка ресурсов...');
    }
}
