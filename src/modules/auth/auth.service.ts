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

    // Validar que el token no esté vacío
    if (!googleLoginDto.idToken || !googleLoginDto.idToken.trim()) {
      throw new UnauthorizedException('Token de Google requerido');
    }

    // Validar formato básico del JWT (debe tener 3 partes separadas por punto)
    const tokenParts = googleLoginDto.idToken.split('.');
    if (tokenParts.length !== 3) {
      throw new UnauthorizedException(
        'Formato de token inválido. Asegúrate de enviar un Google ID Token (no Access Token)'
      );
    }

    // En desarrollo, log del header del token para debugging
    if (process.env.NODE_ENV === 'development') {
      try {
        const header = JSON.parse(Buffer.from(tokenParts[0], 'base64').toString());
        console.log('Token header:', header);
        console.log('GOOGLE_CLIENT_ID configurado:', clientId.substring(0, 20) + '...');
      } catch (e) {
        console.warn('No se pudo decodificar el header del token');
      }
    }

    // Crear cliente OAuth2 con configuración mejorada
    const client = new OAuth2Client(clientId);

    try {
      // Verificar el token de Google
      // La librería descargará automáticamente las claves públicas de Google
      const ticket = await client.verifyIdToken({
        idToken: googleLoginDto.idToken,
        audience: clientId,
      });

      // Verificar que el ticket sea válido
      if (!ticket) {
        throw new UnauthorizedException('Token de Google inválido: no se pudo verificar');
      }

      const payload = ticket.getPayload();
      
      if (!payload || !payload.email) {
        throw new UnauthorizedException('Token de Google inválido: no contiene email');
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
      // Log del error completo para debugging (solo en desarrollo)
      if (process.env.NODE_ENV === 'development') {
        console.error('Error completo validando token de Google:', error);
        console.error('Mensaje de error:', error.message);
        console.error('Stack trace:', error.stack);
      }
      
      // Mensaje de error más descriptivo según el tipo de error
      const errorMessage = error.message || '';
      
      if (errorMessage.includes('Token used too early')) {
        throw new UnauthorizedException('Token de Google usado muy temprano. Verifica la hora de tu dispositivo.');
      }
      
      if (errorMessage.includes('Token expired')) {
        throw new UnauthorizedException('Token de Google expirado. Intenta iniciar sesión nuevamente.');
      }
      
      if (errorMessage.includes('audience') || errorMessage.includes('Client ID')) {
        throw new UnauthorizedException('Token de Google no válido para esta aplicación. Verifica el Client ID en la configuración.');
      }
      
      // Error específico de clave pública (PEM)
      if (errorMessage.includes('No pem found for envelope') || errorMessage.includes('PEM')) {
        throw new UnauthorizedException(
          'Error verificando token de Google: No se pudo obtener la clave pública. ' +
          'Verifica que el servidor tenga acceso a internet y que el token sea válido. ' +
          'Asegúrate de usar el ID Token (no el Access Token) desde Google Sign-In.'
        );
      }
      
      // Error genérico pero más informativo
      throw new UnauthorizedException(
        `Token de Google inválido: ${errorMessage || 'Error desconocido'}. ` +
        'Verifica que estés enviando un ID Token válido de Google Sign-In.'
      );
    }
  }
}
