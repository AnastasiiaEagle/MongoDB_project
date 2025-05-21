import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class ParticipantsDto {
    @ApiProperty({ example: '682d55a02f82f5c0f2c4b91c', description: 'id події' })
    @IsNotEmpty({message: "Поле не може бути пустим"})
    @IsString({message: "Поле має бути рядком"})
    @MinLength(5, {message: "Пароль має бути мінімум з 5 символів"})
    @MaxLength(64, {message: "Пароль має бути максимум з 64 символів"})
    eventId: string
}