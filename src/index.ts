import 'reflect-metadata';

import * as dotenv from 'dotenv';
import { useContainer } from 'routing-controllers';
import Container from 'typedi';
import { Server } from './server';

useContainer(Container);

dotenv.config({ path: './.env' });

Server.configure();
