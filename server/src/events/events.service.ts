import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventsDto } from './dto/evetns.dto';

@Injectable()
export class EventsService {
    constructor(
        private readonly prismaService: PrismaService, 
    ) {}

    async create(dto: EventsDto){
        const {name, description, date, location, maxParticipants} = dto
        const event = await this.prismaService.events.create({
            data:{
                name,
                description,
                date,
                location,
                maxParticipants
            }
        })
        return event
    }

    async findOne(id: string) {
        const post = await this.prismaService.events.findUnique({
        where: {
            id
        }
        })

        if(!post){
        throw new NotFoundException("Нічого не знайдено")
        } 

        return post
    }

    async findAll(){
        return await this.prismaService.events.findMany({
        })
    }

    async update(id: string, dto: EventsDto){
        const isPost = await this.findOne(id)

        if(isPost){

            const {name, description, date, location, maxParticipants} = dto

            await this.prismaService.events.update({
                where: {
                    id
                },
                data: {
                    name,
                    description,
                    date,
                    location,
                    maxParticipants
                }
            })
            return true
        }
        return false
    }

    async delete(id: string){
        const isPost = await this.findOne(id)

        if(isPost){
            await this.prismaService.events.delete({
                where: {
                    id
                }
            })
            return true
        }
        return false
    }

    
}

