import { join } from 'path';
import { createConnection, ConnectionOptions } from 'typeorm';
import {SQLITE_DB_FILE,  } from '@config';

export const dbConnection = async () => {
  const dbConfig: ConnectionOptions = {
    type: 'sqlite',
    // username: POSTGRES_USER,
    // password: POSTGRES_PASSWORD,
    // host: POSTGRES_HOST,
    // port: +POSTGRES_PORT,
    database: SQLITE_DB_FILE || 'db.sq3',// POSTGRES_DATABASE,
    synchronize: true,
    enableWAL: true,
    logging: false,
    entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
    migrations: [join(__dirname, '../**/*.migration{.ts,.js}')],
    subscribers: [join(__dirname, '../**/*.subscriber{.ts,.js}')],
    // cli: {
    //   entitiesDir: 'src/entities',
    //   migrationsDir: 'src/migration',
    //   subscribersDir: 'src/subscriber',
    // },
  };

  await createConnection(dbConfig);
};
