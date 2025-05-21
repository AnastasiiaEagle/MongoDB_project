import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { ParticipantsDto } from './dto/participants.dto';
import { Request } from 'express';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @ApiOperation({summary: 'Запис на подію'})
  @ApiBody({type: ParticipantsDto})
  @ApiResponse({status: 201, description: "Новий запис створена"})
  @ApiResponse({status: 401, description: "Недійсний refresh-токен"})
  @ApiResponse({status: 409, description: "Кількість реєстрацій на цю подію вичерпано"})
  @ApiCookieAuth('refreshToken')
  @Post()
  create(@Body() createPostDto: ParticipantsDto, @Req() req: Request) {
    return this.participantsService.create(createPostDto, req);
  }

  @ApiOperation({summary: 'Виведення усіх записів на усі події'})
  @ApiResponse({status: 200, description: "Події виведено"})
  @ApiResponse({status: 400, description: "Непередбачувана помилка"})
  @Get()
  findAll() {
    return this.participantsService.findAll();
  }

  @ApiOperation({summary: 'Виведення запланованих подій'})
  @ApiResponse({status: 200, description: "Список подій виведено"})
  @ApiResponse({status: 400, description: "Непередбачувана помилка"})
  @ApiResponse({status: 500, description: "Невірний id"})
  @ApiParam({
      name: 'id',
      type: String,
      description: 'ID події',
      example: "42234555",
    })
  @Get('event/:id')
  findEventAll(@Param('id') id: string) {
    return this.participantsService.findEventAll(id);
  }

  @ApiOperation({summary: 'Виведення подій користувача'})
  @ApiResponse({status: 200, description: "Список подій виведено"})
  @ApiResponse({status: 400, description: "Список подій порожній"})
  @ApiResponse({status: 500, description: "Невірний id"})
  @ApiParam({
      name: 'id',
      type: String,
      description: 'ID користувача',
      example: "42234555",
    })
  @Get('user')
  findUserAll(@Req() req: Request) {
    return this.participantsService.findUserAll(req);
  }

  @ApiOperation({summary: 'Видалення запланованої події'})
  @ApiResponse({status: 200, description: "Подію видалено"})
  @ApiResponse({status: 400, description: "Такої події не знадено"})
  @ApiResponse({status: 500, description: "Невірний id"})
  @ApiParam({
      name: 'id',
      type: String,
      description: 'ID запланованої події',
      example: "42234555",
    })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.participantsService.delete(id);
  }
}
