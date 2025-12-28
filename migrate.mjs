#!/usr/bin/env node

/**
 * Database Migration Script for Railway
 * This script runs database migrations using Drizzle Kit
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting database migration...');

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL environment variable is not set');
  process.exit(1);
}

console.log('✅ DATABASE_URL is configured');
console.log('📦 Running drizzle-kit generate...');

// Run drizzle-kit generate
const generate = spawn('pnpm', ['drizzle-kit', 'generate'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

generate.on('close', (code) => {
  if (code !== 0) {
    console.error(`❌ drizzle-kit generate failed with code ${code}`);
    process.exit(code);
  }

  console.log('✅ Schema generated successfully');
  console.log('📦 Running drizzle-kit migrate...');

  // Run drizzle-kit migrate
  const migrate = spawn('pnpm', ['drizzle-kit', 'migrate'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });

  migrate.on('close', (migrateCode) => {
    if (migrateCode !== 0) {
      console.error(`❌ drizzle-kit migrate failed with code ${migrateCode}`);
      process.exit(migrateCode);
    }

    console.log('✅ Database migration completed successfully!');
    console.log('🎉 All tables created in Railway MySQL database');
  });
});
