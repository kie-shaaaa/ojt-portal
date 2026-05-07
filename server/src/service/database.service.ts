import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'pg';
import * as dotenv from 'dotenv';
import chalk from 'chalk';
import { createApplications } from './models/applications.model';
import { createUserAccounts } from './models/user-accounts.model';
import { createOjtData } from './models/ojt-data.model';
import { createFileUploads } from './models/file-uploads.model';
import { createApplicationSettings } from './models/application-settings.model';

dotenv.config();

console.log(chalk.bgBlue.black('[SERVICE] Database service loaded'));

@Injectable()
export class DatabaseService implements OnModuleInit {
  private client: Client;

  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      console.error(
        chalk.red.bold('DATABASE_URL is not defined in environment variables'),
      );
      throw new Error('DATABASE_URL is missing');
    }

    this.client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });

    console.log(chalk.blueBright('Database client initialized.'));
  }

  async onModuleInit() {
    console.log(chalk.yellow('Connecting to the database...'));

    await this.client.connect();
    console.log(chalk.green('Connected to the database!'));

    console.log(chalk.cyan('Creating tables...'));

    await createUserAccounts(this.client);
    await createApplications(this.client);
    await createFileUploads(this.client);
    await createOjtData(this.client);
    await createApplicationSettings(this.client);

    console.log(chalk.bgGreen.black('[SUPABASE] All tables are ready!'));
  }

  getClient(): Client {
    return this.client;
  }
}
