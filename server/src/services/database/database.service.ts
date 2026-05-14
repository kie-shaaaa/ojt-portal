import { Injectable, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import chalk from 'chalk';
import { createApplications } from '../../services/database/models/applications.model';
import { createUserAccounts } from '../../services/database/models/user-accounts.model';
import { createOjtData } from '../../services/database/models/ojt-data.model';
import { createFileUploads } from '../../services/database/models/file-uploads.model';
import { createApplicationSettings } from '../../services/database/models/application-settings.model';
import { createLogs } from './models/logs.model';
import { createAppointment } from './models/appointment.model';
import { createSchool } from './models/school.model';
import { createCourses } from './models/courses.model';

dotenv.config();

console.log(chalk.bgBlue.black('[SERVICE] Database service loaded'));

@Injectable()
export class DatabaseService implements OnModuleInit {
  private pool: Pool;

  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      console.error(
        chalk.red.bold('DATABASE_URL is not defined in environment variables'),
      );
      throw new Error('DATABASE_URL is missing');
    }

    this.pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });

    console.log(chalk.blueBright('Database client initialized.'));
  }

  async onModuleInit() {
    console.log(chalk.yellow('Connecting to the database...'));

    await this.pool.query('SELECT 1');
    console.log(chalk.green('Connected to the database!'));

    console.log(chalk.cyan('Creating tables...'));

    await createUserAccounts(this.pool);
    await createApplications(this.pool);
    await createFileUploads(this.pool);
    await createOjtData(this.pool);
    await createApplicationSettings(this.pool);
    await createLogs(this.pool);
    await createAppointment(this.pool);
    await createSchool(this.pool);
    await createCourses(this.pool);

    console.log(chalk.bgGreen.black('[SUPABASE] All tables are ready!'));
  }

  getClient(): Pool {
    return this.pool;
  }
}
