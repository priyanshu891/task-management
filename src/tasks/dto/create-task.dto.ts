import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
    @ApiProperty({
        required: true
    })
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        required: true
    })
    @IsNotEmpty()
    description: string;
}