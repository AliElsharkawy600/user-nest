import dotenv from 'dotenv';
dotenv.config();
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthGuardImpl } from './auth/auth.guard';
import { RolesGuard } from './roles/roles.guard';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
          throw new Error('MONGO_URI is not defined');
        }
        return {
          uri: mongoURI,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuardImpl,
    },
    RolesGuard,
    Reflector,
  ],
})
export class AppModule {}
