import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class EventsDto {
    @IsNotEmpty({message: "Поле не може бути пустим"})
    @IsString({message: "Поле має бути рядком"})
    @MinLength(5, {message: "Пароль має бути мінімум з 5 символів"})
    @MaxLength(64, {message: "Пароль має бути максимум з 64 символів"})
    name: string

    @IsNotEmpty({message: "Поле не може бути пустим"})
    @IsString({message: "Поле має бути рядком"})
    @MinLength(5, {message: "Пароль має бути мінімум з 5 символів"})
    @MaxLength(128, {message: "Пароль має бути максимум з 128 символів"})
    description: string;

    @IsNotEmpty({message: "Поле на має бути пустим"})
    @IsString({message: "Поле має бути рядком"})
    date: string

    @IsNotEmpty({message: "Поле на має бути пустим"})
    @IsString({message: "Поле має бути рядком"})
    location: string

    @IsNotEmpty({message: "Поле на має бути пустим"})
    @IsNumber()
    maxParticipants: number
}