import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@ApiCookieAuth('refreshToken') // Отримання токена з кукі?
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

    @ApiOperation({summary: 'Реєстрація користувача'})
    @ApiBody({type: AuthDto})
    @ApiResponse({status: 200, description: "Нового користувача створено"})
    @ApiResponse({status: 400, description: "Некоректні дані"})
    @ApiProperty({
      description: 'access token, який потрібно зберегти в localStorage',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    async register (@Res({passthrough: true}) res: Response, @Body() dto: AuthDto){
      return await this.authService.register(res, dto);
    }

    @ApiOperation({summary: 'Авторизація користувача'})
    @ApiBody({type: LoginDto})
    @ApiResponse({status: 200, description: "Користувача авторизовано"})
    @ApiResponse({status: 400, description: "Некоректні дані"})
    @ApiProperty({
      description: 'access token, який потрібно зберегти в localStorage',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login (@Res({passthrough: true}) res: Response, @Body() dto: LoginDto){
      return await this.authService.login(res, dto);
    }

    @ApiOperation({summary: 'Оновлення токенів'})
    @ApiResponse({status: 200, description: "Токени оновлено"})
    @ApiResponse({status: 400, description: "Некоректні дані"})
    @ApiProperty({
      description: 'access token, який потрібно зберегти в localStorage',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    @ApiCookieAuth('refreshToken')
    @HttpCode(HttpStatus.OK)
    @Get('refresh')
    async refresh (@Req() req: Request, @Res({passthrough: true}) res: Response){
      return await this.authService.refresh(req, res);
    }

    @ApiOperation({summary: 'Вихід користувача'})
    @ApiResponse({status: 200, description: "Користувач вийшов з аккаунту"})
    @ApiResponse({status: 400, description: "Некоректні дані"})
    @ApiCookieAuth('refreshToken')
    @HttpCode(HttpStatus.OK)
    @Get('logout')
    async logout (@Res({passthrough: true}) res: Response){
      return await this.authService.logout(res);
    }

    @ApiOperation({summary: 'Перевірка користувача'})
    @ApiResponse({status: 200, description: "Користувача перевірено"})
    @ApiResponse({status: 400, description: "Некоректні дані"})
    @ApiCookieAuth('refreshToken')
    @HttpCode(HttpStatus.OK)
    @Get('me')
    async getMe (@Req() req: Request){
      return await this.authService.getMe(req);
    }
}
