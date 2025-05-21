import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { ParticipantsDto } from './dto/participants.dto';
import { Request } from 'express';

@Controller('participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @Post()
  create(@Body() createPostDto: ParticipantsDto, @Req() req: Request) {
    return this.participantsService.create(createPostDto, req);
  }

  @Get()
  findAll() {
    return this.participantsService.findAll();
  }

  @Get('event/:id')
  findEventAll(@Param('id') id: string) {
    return this.participantsService.findEventAll(id);
  }

  @Get('user')
  findUserAll(@Req() req: Request) {
    return this.participantsService.findUserAll(req);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.participantsService.delete(id);
  }
}
