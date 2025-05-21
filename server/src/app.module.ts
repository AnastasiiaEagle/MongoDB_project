import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events.module';
import { ParticipantsModule } from './participants/participants.module';

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,
    }),PrismaModule, AuthModule, EventsModule, ParticipantsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
