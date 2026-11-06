import * as esbuild from 'esbuild';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// 1. Проверяем, существует ли локальный конфиг
const configPath = resolve('./vault-path.json');
let targetVaultPluginDir = '.'; // По умолчанию пишем в корень проекта

if (existsSync(configPath)) {
  try {
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));
    targetVaultPluginDir = config.vaultPath;
    console.log(`📂 Найден локальный конфиг. Путь к хранилищу: ${targetVaultPluginDir}`);
  } catch (error) {
    console.error('❌ Ошибка чтения vault-path.json:', error.message);
    process.exit(1);
  }
} else {
  console.warn('⚠️  Файл vault-path.json не найден. Использую шаблон vault-path.example.json');
  console.warn('   Создай vault-path.json и укажи путь к своему хранилищу Obsidian.');
}

const isDev = process.argv.includes('--dev');

async function build() {
  // 2. ВАЖНО: Используем context API для режима watch
  const ctx = await esbuild.context({
    entryPoints: ['main.ts'],
    bundle: true,
    outfile: `${targetVaultPluginDir}/main.js`,
    external: ['obsidian'],
    format: 'cjs',
    target: 'es2018',
    sourcemap: isDev ? 'inline' : false,
    minify: !isDev,
  });

  if (isDev) {
    // 3. Включаем режим слежения за изменениями
    await ctx.watch();
    console.log(`🟢 Режим разработки: слежение активно. Измени main.ts и сохрани.`);
  } else {
    // 4. Для обычной сборки просто выполняем и закрываем
    await ctx.rebuild();
    await ctx.dispose();
    console.log('✅ Сборка завершена успешно!');
  }
}

build().catch((error) => {
  console.error('❌ Ошибка сборки:', error);
  process.exit(1);
});

