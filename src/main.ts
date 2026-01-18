import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
  
  // Habilitar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('UTU Viajes y Gastos API')
    .setDescription('API REST para gestión de viajes, gastos, listas de compra y cotizaciones')
    .setVersion('1.0')
    .addTag('auth', 'Endpoints de autenticación')
    .addTag('users', 'Gestión de usuarios')
    .addTag('productos', 'Gestión de productos')
    .addTag('listas-compra', 'Gestión de listas de compra')
    .addTag('cotizaciones', 'Gestión de cotizaciones de monedas')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa el token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const host = process.env.HOST || 'localhost';
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Habilitar CORS si es necesario
  app.enableCors();

  const port = process.env.PORT || 3000;
  
    await app.listen(port);
    console.log(`Application is running on: http://${host}:${port}`);
    console.log(`Swagger documentation available at: http://${host}:${port}/api`);
  } catch (error) {
    console.error('Error starting application:', error);
    process.exit(1);
  }
}
bootstrap();
