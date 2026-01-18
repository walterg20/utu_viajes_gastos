import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@ejemplo.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Nombre del usuario',
    example: 'Juan Pérez',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'URL de la foto de perfil',
    example: 'https://ejemplo.com/foto.jpg',
  })
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiPropertyOptional({
    description: 'Contraseña del usuario (hasheada)',
    example: 'hashed_password',
  })
  @IsOptional()
  @IsString()
  password?: string;
}
