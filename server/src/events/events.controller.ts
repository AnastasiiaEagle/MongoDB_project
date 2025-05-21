import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsDto } from './dto/evetns.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({summary: 'Створення події'})
  @ApiBody({type: EventsDto})
  @ApiResponse({status: 201, description: "Нова подія створена"})
  @ApiResponse({status: 400, description: "Некоректні дані"})
  @Post()
  create(@Body() createPostDto: EventsDto) {
    return this.eventsService.create(createPostDto);
  }

  @ApiOperation({summary: 'Виведення подій'})
  @ApiResponse({status: 200, description: "Подіїї виведено"})
  @ApiResponse({status: 400, description: "Непередбачувана помилка"})
  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @ApiOperation({summary: 'Виведення події'})
  @ApiResponse({status: 200, description: "Подіїю виведено"})
  @ApiResponse({status: 400, description: "Непередбачувана помилка"})
  @ApiResponse({status: 500, description: "Невірний id"})
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID події',
    example: "42234555",
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @ApiOperation({summary: 'Оновлення даних події'})
  @ApiResponse({status: 200, description: "Подіїю оновлено"})
  @ApiResponse({status: 400, description: "Некоректні дані"})
  @ApiResponse({status: 500, description: "Невірний id"})
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID події',
    example: "42234555",
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: EventsDto) {
    return this.eventsService.update(id, dto);
  }

  @ApiOperation({summary: 'Видалення події'})
  @ApiResponse({status: 200, description: "Подіїю видалено"})
  @ApiResponse({status: 400, description: "Некоректні дані"})
  @ApiResponse({status: 500, description: "Невірний id"})
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID події',
    example: "42234555",
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.delete(id);
  }
}
