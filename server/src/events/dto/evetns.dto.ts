import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class EventsDto {
    @ApiProperty({ example: 'test_name_event', description: 'Назва події' })
    @IsNotEmpty({message: "Поле не може бути пустим"})
    @IsString({message: "Поле має бути рядком"})
    @MinLength(5, {message: "Пароль має бути мінімум з 5 символів"})
    @MaxLength(64, {message: "Пароль має бути максимум з 64 символів"})
    name: string

    @ApiProperty({ example: 'test_description', description: 'Опис події' })
    @IsNotEmpty({message: "Поле не може бути пустим"})
    @IsString({message: "Поле має бути рядком"})
    @MinLength(5, {message: "Пароль має бути мінімум з 5 символів"})
    @MaxLength(225, {message: "Пароль має бути максимум з 128 символів"})
    description: string;

    @ApiProperty({ example: 'test_description', description: 'Опис події' })
    @IsNotEmpty({message: "Поле на має бути пустим"})
    @IsString({message: "Поле має бути рядком"})
    date: string

    @ApiProperty({ example: 'test_location', description: 'Локація' })
    @IsNotEmpty({message: "Поле на має бути пустим"})
    @IsString({message: "Поле має бути рядком"})
    location: string

    @ApiProperty({ example: 3, description: 'Максимальна кількість учасників' })
    @IsNotEmpty({message: "Поле на має бути пустим"})
    @IsNumber()
    maxParticipants: number
}