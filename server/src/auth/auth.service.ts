import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { isDev } from 'src/utils/id-dev.utils';
import { hash, verify } from 'argon2';
import { JwtPayload } from './interfaces/jwt.interface';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {

    private readonly JWT_ACCESS_TOKEN_TTL: string
    private readonly JWT_REFRESH_TOKEN_TTL: string
    private readonly COOKIE_DOMAIN: string

    constructor( 
        private readonly prismaService: PrismaService, 
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,){
            this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow<string>('JWT_ACCESS_TOKEN_TTL')
            this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow<string>('JWT_REFRESH_TOKEN_TTL')
            this.COOKIE_DOMAIN = configService.getOrThrow<string>('COOKIE_DOMAIN')
    } 

    async register(res: Response, dto: AuthDto){
        const { username, email, password } = dto

        const existUser = await this.prismaService.users.findUnique({
            where: {
                email,
            }
        })

        if(existUser){
            throw new ConflictException("Такий користувач вже існує")
        }

        const user = await this.prismaService.users.create({
            data: {
                username,
                email,
                password: await hash(password)
            }
        })

        return this.auth(res, user.id)
    }

    async login(res: Response, dto: LoginDto){
        const {email, password} = dto

        const user = await this.prismaService.users.findUnique({
            where: {
                email,
            },
            select: {
                id: true,
                password: true
            }
        })

        if(!user){
            throw new NotFoundException("Користувача не знайдено 1")
        }

        const isValidPassword = await verify(user.password, password);

        if(!isValidPassword){
            throw new NotFoundException("Користувача не знайдено 2")
        }

        return this.auth(res, user.id)
    }

    async refresh(req: Request, res: Response){   // перевірка авторизованого користувача на життя токену
        const refreshToken = req.cookies['refreshToken']
        if (!refreshToken || refreshToken === 'refreshToken') {
            throw new UnauthorizedException('Недійсний refresh-токен')
        }

        const payload: JwtPayload = await this.jwtService.verifyAsync(refreshToken)
        if(payload){
            const user = await this.prismaService.users.findUnique({
                where: {
                    id: payload.id
                },
                select: {
                    id: true
                }
            })

            if(!user) {
                throw new NotFoundException('Користувача не знайдено')
            }

            return this.auth(res, user.id)
        }
    }

    async logout(res: Response){  // вихід
        this.setCookie(res, 'refreshToken', new Date(0))
        return true
    }

    async getMe(req: Request){
        const refreshToken = req.cookies['refreshToken']
        if (!refreshToken) throw new UnauthorizedException('Токен відсутній')
        const payload = await this.jwtService.verifyAsync(refreshToken);
        const user = await this.prismaService.users.findUnique({
            where: {
                id: payload.id
            }
        })

        if(user){
            return payload.id
        }else return false
    }

    private auth(res: Response, id: string){
        const { accessToken, refreshToken } = this.generateToken(id)
        this.setCookie(res, refreshToken, new Date(Date.now() + 1000 * 60 * 60 * 24 * 7))

        return { accessToken }
    }

    private generateToken(id: string){
        const payload: JwtPayload = {id}
        const accessToken = this.jwtService.sign(payload, {expiresIn: this.JWT_ACCESS_TOKEN_TTL})
        const refreshToken = this.jwtService.sign(payload, {expiresIn: this.JWT_REFRESH_TOKEN_TTL})

        return{
            accessToken,
            refreshToken
        }
    }

    private setCookie(res: Response, value: string, expires: Date){
        res.cookie("refreshToken", value, {
            httpOnly: true,
            domain: this.COOKIE_DOMAIN,
            expires,
            secure: !isDev(this.configService),
            sameSite: isDev(this.configService) ? 'none' : 'lax'
        })
    }

}
