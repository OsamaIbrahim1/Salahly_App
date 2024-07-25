import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import * as env from './config';
import { AdminModule, AuthModule, CommonModule, UserModule } from './modules';

@Module({
  imports: [
    MongooseModule.forRoot(env.DB_CONNECTION_HOST),
    AuthModule,
    CommonModule,
    UserModule,
    AdminModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})

export class AppModule { }