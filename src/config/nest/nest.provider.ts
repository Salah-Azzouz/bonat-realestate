import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.APP_ENV || 'development',
  name: process.env.APP_NAME || 'Bonat Real Estate API',
  url: process.env.APP_URL || 'http://localhost',
  port: parseInt(process.env.APP_PORT) || 3000,
}));
