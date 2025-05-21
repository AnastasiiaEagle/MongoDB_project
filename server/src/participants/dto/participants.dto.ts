import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class ParticipantsDto {
    @IsNotEmpty({message: "Поле не може бути пустим"})
    @IsString({message: "Поле має бути рядком"})
    @MinLength(5, {message: "Пароль має бути мінімум з 5 символів"})
    @MaxLength(64, {message: "Пароль має бути максимум з 64 символів"})
    eventId: string
}