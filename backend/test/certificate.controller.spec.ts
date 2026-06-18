import { Test, TestingModule } from '@nestjs/testing';
import { CertificateService } from '../src/services/certificate.service';
import { CertificateController } from '../src/controllers/certificate.controller';

describe('CertificateController', () => {
  let controller: CertificateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CertificateController],
      providers: [CertificateService],
    }).compile();

    controller = module.get<CertificateController>(CertificateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
