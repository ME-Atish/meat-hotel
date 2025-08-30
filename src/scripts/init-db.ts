import { AppDataSource } from '../data-source';

async function initDB() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected and schema synchronized!');
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDB();
