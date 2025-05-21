import { Module } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { ParticipantsController } from './participants.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { getJwtConfig } from 'src/config/jwt.config';

@Module({
  imports:[
    JwtModule.registerAsync({
      imports: [ConfigModule, PrismaModule],
      useFactory: getJwtConfig,
      inject: [ConfigService],
    })
  ],
  controllers: [ParticipantsController],
  providers: [ParticipantsService],
})
export class ParticipantsModule {}
