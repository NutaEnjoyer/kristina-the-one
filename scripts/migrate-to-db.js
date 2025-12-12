// Скрипт миграции данных из letterText.js в PostgreSQL через API
import { letters } from '../src/letterText.js';

const API_URL = 'http://localhost:8080/api/letters';

async function migrateLetters() {
  console.log(`Starting migration of ${letters.length} letters...`);

  let successCount = 0;
  let errorCount = 0;

  for (const letter of letters) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: letter.title,
          text: letter.text,
          date: letter.date || '',
          tag: letter.tag || '',
          inProgress: letter.inProgress || false,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const created = await response.json();
      console.log(`✓ Migrated letter ${letter.id}: "${letter.title}"`);
      successCount++;
    } catch (error) {
      console.error(`✗ Failed to migrate letter ${letter.id}: "${letter.title}"`, error.message);
      errorCount++;
    }
  }

  console.log(`\nMigration complete!`);
  console.log(`Success: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
}

migrateLetters();
