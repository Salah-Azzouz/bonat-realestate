export const PostgresFactoryConfig: any = () => {
  const entitiesPath = __dirname + './../../../common/schema/*.entity{.ts,.js}';
  return {
    database: process.env.DB_NAME,
    entities: [entitiesPath],
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: +process.env.DB_PORT,
    type: 'postgres',
    username: process.env.DB_USERNAME,
    synchronize: true,
    ssl: process.env.DB_SSL_MODE ? false : { rejectUnauthorized: false },
  };
};
