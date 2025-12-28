#!/usr/bin/env node

/**
 * Database Verification Script for Railway
 * Verifies that all tables are created successfully
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

console.log('🔍 Verifying database connection and tables...');

if (!process.env.DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL environment variable is not set');
  process.exit(1);
}

try {
  // Parse DATABASE_URL
  const dbUrl = new URL(process.env.DATABASE_URL);
  
  // Create connection
  const connection = await mysql.createConnection({
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port) || 3306,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1), // Remove leading slash
  });

  console.log('✅ Database connection successful');

  // Check for tables
  const [tables] = await connection.query('SHOW TABLES');
  
  console.log(`\n📊 Found ${tables.length} tables in database:`);
  
  const expectedTables = [
    'users',
    'user_profiles',
    'contests',
    'user_teams',
    'team_players',
    'matches',
    'match_results',
    'leaderboards',
    'transactions',
    'compliance_logs',
    'sessions'
  ];

  const tableNames = tables.map(row => Object.values(row)[0]);
  
  expectedTables.forEach(tableName => {
    if (tableNames.includes(tableName)) {
      console.log(`  ✅ ${tableName}`);
    } else {
      console.log(`  ❌ ${tableName} (MISSING)`);
    }
  });

  await connection.end();

  const allTablesExist = expectedTables.every(table => tableNames.includes(table));
  
  if (allTablesExist) {
    console.log('\n🎉 All database tables verified successfully!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tables are missing. Run migrations with: pnpm db:push');
    process.exit(1);
  }

} catch (error) {
  console.error('❌ Database verification failed:', error.message);
  process.exit(1);
}
