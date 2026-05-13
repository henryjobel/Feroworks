// only for cpanel hosting
import { createApp } from './src/app.js';
import { env } from './src/config/env.js';

const app = createApp();

app.listen(env.PORT || 3000, () => {
  console.log(`Passenger running on port ${env.PORT}`);
});