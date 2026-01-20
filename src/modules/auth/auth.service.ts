import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import * as admin from 'firebase-admin';
import { UsersService } from '../users/users.service';
import { RegisterDto } from '../../dto/register.dto';
import { LoginDto } from '../../dto/login.dto';
import { GoogleLoginDto } from '../../dto/google-login.dto';

@Injectable()
export class AuthService {
  private firebaseApp: admin.app.App | null = null;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    // Inicializar Firebase Admin si está configurado
    this.initializeFirebase();
  }

  private initializeFirebase() {
    const firebaseProjectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
    const firebasePrivateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY');
    const firebaseClientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');

    if (firebaseProjectId && firebasePrivateKey && firebaseClientEmail) {
      try {
        this.firebaseApp = admin.initializeApp({
          credential: admin.credential.cert({
            projectId: firebaseProjectId,
            privateKey: firebasePrivateKey.replace(/\\n/g, '\n'),
            clientEmail: firebaseClientEmail,
          }),
        });
      } catch (error: any) {
      }
    } else {
    }
  }

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
    // Validar que el token no esté vacío
    if (!googleLoginDto.idToken || !googleLoginDto.idToken.trim()) {
      throw new UnauthorizedException('Token requerido');
    }

    // Validar formato básico del JWT (debe tener 3 partes separadas por punto)
    const tokenParts = googleLoginDto.idToken.split('.');
    if (tokenParts.length !== 3) {
      throw new UnauthorizedException(
        'Formato de token inválido. Asegúrate de enviar un ID Token válido'
      );
    }

    // Decodificar header y payload del token para determinar el tipo
    let decodedPayload: any = null;
    
    try {
      decodedPayload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
    } catch (decodeError: any) {
      throw new UnauthorizedException('Token mal formado: no se pudo decodificar');
    }

    // Determinar si es un token de Firebase Auth
    const isFirebaseToken = decodedPayload.iss && (
      decodedPayload.iss.includes('firebase') || 
      decodedPayload.iss.includes('securetoken.google.com')
    );

    let payload: any;

    if (isFirebaseToken) {
      // Verificar token de Firebase usando Firebase Admin SDK
      if (!this.firebaseApp) {
        throw new UnauthorizedException(
          'Este es un token de Firebase Auth, pero Firebase Admin SDK no está configurado. ' +
          'Agrega las variables de entorno: FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL'
        );
      }

      try {
        const decodedToken = await admin.auth().verifyIdToken(googleLoginDto.idToken);
        
        payload = {
          email: decodedToken.email,
          name: decodedToken.name,
          picture: decodedToken.picture,
          sub: decodedToken.uid,
        };
        
      } catch (firebaseError: any) {
        throw new UnauthorizedException(
          `Error verificando token de Firebase: ${firebaseError.message}`
        );
      }
    } else {
      // Verificar token de Google Sign-In directo usando google-auth-library
      const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
      
      if (!clientId) {
        throw new UnauthorizedException('Google Client ID no configurado');
      }

      // Usar el Client ID del token si es diferente al configurado
      let verificationClientId = clientId;
      if (decodedPayload.aud && decodedPayload.aud !== clientId) {
        verificationClientId = decodedPayload.aud;
      }

      const client = new OAuth2Client(verificationClientId);

      try {
        const ticket = await client.verifyIdToken({
          idToken: googleLoginDto.idToken,
          audience: verificationClientId,
        });

        if (!ticket) {
          throw new UnauthorizedException('Token de Google inválido: no se pudo verificar');
        }

        const ticketPayload = ticket.getPayload();
        
        if (!ticketPayload || !ticketPayload.email) {
          throw new UnauthorizedException('Token de Google inválido: no contiene email');
        }

        payload = {
          email: ticketPayload.email,
          name: ticketPayload.name,
          picture: ticketPayload.picture,
          sub: ticketPayload.sub,
        };

      } catch (googleError: any) {
        const errorMessage = googleError.message || '';
        
        if (errorMessage.includes('No pem found')) {
          throw new UnauthorizedException(
            'Error verificando token de Google: No se pudo obtener la clave pública. ' +
            'Verifica que el servidor tenga acceso a internet para descargar claves de Google.'
          );
        }
        
        throw new UnauthorizedException(
          `Error verificando token de Google: ${errorMessage}`
        );
      }
    }

    // Ahora usar payload (ya sea de Firebase o Google Sign-In)
    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
      throw new UnauthorizedException('Token inválido: no contiene email');
    }

    // Buscar o crear usuario
    let user = await this.usersService.findByEmail(email);

    if (!user) {
      // Crear nuevo usuario
      user = await this.usersService.create({
        email,
        name: name || undefined,
        photoUrl: picture || undefined,
        password: undefined, // Usuarios de OAuth no tienen password
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
  }
}