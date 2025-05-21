import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto {
    @ApiProperty({ example: '1111@gmail.com', description: 'Емейл користувача' })
    @IsEmail({},{message: "Некоректний емейл"})
    @IsNotEmpty({message: "Поле не може бути пустим"})
    @IsString({message: "Поле має бути рядком"})
    email: string;

    @ApiProperty({ example: '111111', description: 'Пароль користувача' })
    @IsNotEmpty({message: "Поле на має бути пустим"})
    @IsString({message: "Поле має бути рядком"})
    @MinLength(5, {message: "Пароль має бути мінімум з 5 символів"})
    @MaxLength(128, {message: "Пароль має бути максимум з 128 символів"})
    password: string
}