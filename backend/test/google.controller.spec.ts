import { Test, TestingModule } from '@nestjs/testing';
import { GoogleController } from '../src/controllers/google.controller';
import { GoogleService } from '../src/services/google.service';

describe('GoogleController', () => {
  let controller: GoogleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleController],
      providers: [GoogleService],
    }).compile();

    controller = module.get<GoogleController>(GoogleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
