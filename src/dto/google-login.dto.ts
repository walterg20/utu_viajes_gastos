import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleLoginDto {
  @ApiProperty({
    description: 'ID Token obtenido de Google OAuth',
    example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyMzQ1NiJ9...',
  })
  @IsString()
  idToken: string;
}
