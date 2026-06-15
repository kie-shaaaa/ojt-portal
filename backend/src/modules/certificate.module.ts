import { Module } from '@nestjs/common';
import { CertificateService } from '../services/certificate.service';
import { DatabaseModule } from './database.module';
import { GoogleModule } from './google.module';
import { CertificateController } from '../controllers/certificate.controller';

@Module({
  imports: [DatabaseModule, GoogleModule],
  controllers: [CertificateController],
  providers: [CertificateService],
})
export class CertificateModule {}
