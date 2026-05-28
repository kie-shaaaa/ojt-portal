import { Global, Module } from '@nestjs/common';
import { RequestContextInterceptor } from '../interceptors/request-context.interceptor';
import { RequestContextService } from '../services/request-context.service';

@Global()
@Module({
  providers: [RequestContextService, RequestContextInterceptor],
  exports: [RequestContextService],
})
export class RequestContextModule {}
