import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { UsersService } from '../users/users.service';
import { RegisterDto } from '../../dto/register.dto';
import { LoginDto } from '../../dto/login.dto';
import { GoogleLoginDto } from '../../dto/google-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.usersService.create({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
      photoUrl: registerDto.photoUrl,
    });

    // Eliminar password del objeto de respuesta
    const { password, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email, true);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Si el usuario no tiene password (creado sin autenticación), no puede hacer login
    if (!user.password) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        photoUrl: user.photoUrl,
      },
    };
  }

  async validateUser(userId: string) {
    return await this.usersService.findOne(userId);
  }

  async checkStatus(userId: string) {
    const user = await this.usersService.findOne(userId);
    
    // Eliminar password del objeto de respuesta
    const { password, ...userWithoutPassword } = user;
    
    return {
      valid: true,
      user: {
        id: userWithoutPassword.id,
        email: userWithoutPassword.email,
        name: userWithoutPassword.name,
        photoUrl: userWithoutPassword.photoUrl,
        createdAt: userWithoutPassword.createdAt,
      },
    };
  }

  async googleLogin(googleLoginDto: GoogleLoginDto) {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    
    if (!clientId) {
      throw new UnauthorizedException('Google Client ID no configurado');
    }

    const client = new OAuth2Client(clientId);

    try {
      // Verificar el token de Google
      const ticket = await client.verifyIdToken({
        idToken: googleLoginDto.idToken,
        audience: clientId,
      });

      const payload = ticket.getPayload();
      
      if (!payload || !payload.email) {
        throw new UnauthorizedException('Token de Google inválido');
      }

      const { email, name, picture, sub: googleId } = payload;

      // Buscar o crear usuario
      let user = await this.usersService.findByEmail(email);

      if (!user) {
        // Crear nuevo usuario con Google
        user = await this.usersService.create({
          email,
          name: name || undefined,
          photoUrl: picture || undefined,
          password: undefined, // Usuarios de Google no tienen password
        });
      } else {
        // Actualizar información si cambió
        const updatedName = name || user.name || undefined;
        const updatedPhotoUrl = picture || user.photoUrl || undefined;
        
        if (user.name !== updatedName || user.photoUrl !== updatedPhotoUrl) {
          await this.usersService.update(user.id, {
            name: updatedName,
            photoUrl: updatedPhotoUrl,
          });
          // Recargar usuario actualizado
          user = await this.usersService.findOne(user.id);
        }
      }

      // Generar JWT propio
      const jwtPayload = { email: user.email, sub: user.id };
      return {
        access_token: this.jwtService.sign(jwtPayload),
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          photoUrl: user.photoUrl,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Token de Google inválido o expirado');
    }
  }
}
