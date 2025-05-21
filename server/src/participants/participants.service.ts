import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/interfaces/jwt.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { ParticipantsDto } from './dto/participants.dto';

@Injectable()
export class ParticipantsService {
    private readonly JWT_ACCESS_TOKEN_TTL: string
    private readonly JWT_REFRESH_TOKEN_TTL: string
    private readonly COOKIE_DOMAIN: string
    constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService
    ) {
        this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow<string>('JWT_ACCESS_TOKEN_TTL')
        this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow<string>('JWT_REFRESH_TOKEN_TTL')
        this.COOKIE_DOMAIN = configService.getOrThrow<string>('COOKIE_DOMAIN')
    }

    private inRefreshToken = async (req: Request): Promise<string> =>{ // Дістаємо з токену користувача
        const refreshToken = req.cookies['refreshToken'];
        if (!refreshToken || refreshToken === 'refreshToken') {
            throw new UnauthorizedException('Недійсний refresh-токен');
        }
        const payload: JwtPayload = await this.jwtService.verifyAsync(refreshToken);
        const userId = payload.id;

        return userId
    }

    async create(dto: ParticipantsDto, req: Request){
        const userId: string = await this.inRefreshToken(req)

        const existUser = await this.prismaService.users.findUnique({
            where: {
                id: userId
            }
        })
        if(!existUser){
             throw new NotFoundException("Такого користувача не існує")
        }

        const participants = await this.prismaService.participants.findMany({
            where: {
                eventId: dto.eventId
            }
        })


        const maxParticipants = await this.prismaService.events.findUnique({
            where: {
                id: dto.eventId
            },
            select:{
                maxParticipants: true
            }
        })


        if(maxParticipants?.maxParticipants && participants.length >= maxParticipants?.maxParticipants){
             console.log("Кількість реєстрацій на цю подію вичерпано")
                throw new ConflictException("Кількість реєстрацій на цю подію вичерпано")
        }

        return await this.prismaService.participants.create({
            data:{
                userId: userId,
                eventId: dto.eventId
            }
        })
    }

    async delete(id: string){
        const isParticipants = await this.prismaService.participants.findUnique({
            where: {
                id
            }
        })

        console.log(isParticipants)
        if(!isParticipants){
            throw new NotFoundException("Такого запису на подію не існує")
        }

        return await this.prismaService.participants.delete({
            where:{
                id
            }
        })
    }

    async findAll(){
        return await this.prismaService.participants.findMany({
        })
    }

    async findUserAll(req: Request){
        const userId: string = await this.inRefreshToken(req)

        return await this.prismaService.participants.findMany({
            where: {
                userId
            }
        })
    }
    async findEventAll(id: string){
        return await this.prismaService.participants.findMany({
            where: {
                eventId: id
            }
        })
    }
}

//Зробити перевірку чи може 1 користувач реєструватись на одну подію декілька разів