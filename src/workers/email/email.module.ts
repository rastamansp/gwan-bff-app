import { Module } from '@nestjs/common';
import { EmailWorker } from './email.worker';

@Module({
  providers: [EmailWorker],
})
export class EmailWorkerModule {} 