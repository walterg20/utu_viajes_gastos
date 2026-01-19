import { Injectable } from '@nestjs/common';

/**
 * Servicio principal de la aplicación UTU Viajes y Gastos
 * 
 * @description
 * Este servicio proporciona endpoints básicos y información general sobre la API.
 * 
 * La API UTU Viajes y Gastos es un sistema completo para la gestión de:
 * - Usuarios y autenticación (JWT y Google OAuth)
 * - Productos y listas de compra
 * - Cotizaciones de monedas
 * 
 * @see https://utuviajesgastos-desarrollo.up.railway.app/api para documentación completa en Swagger
 */
@Injectable()
export class AppService {
  /**
   * Retorna una página HTML estilizada de bienvenida de la API
   * 
   * @returns Página HTML con información de la API
   */
  getHello(): string {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UTU Viajes y Gastos API</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            color: #333;
        }
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 800px;
            width: 100%;
            padding: 60px 40px;
            text-align: center;
        }
        .logo {
            font-size: 48px;
            margin-bottom: 20px;
        }
        h1 {
            color: #667eea;
            font-size: 36px;
            margin-bottom: 15px;
            font-weight: 700;
        }
        .subtitle {
            color: #666;
            font-size: 18px;
            margin-bottom: 40px;
            line-height: 1.6;
        }
        .features {
            text-align: left;
            background: #f8f9fa;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
        }
        .features h2 {
            color: #667eea;
            font-size: 24px;
            margin-bottom: 20px;
            text-align: center;
        }
        .features ul {
            list-style: none;
            padding: 0;
        }
        .features li {
            padding: 12px 0;
            padding-left: 30px;
            position: relative;
            color: #555;
            font-size: 16px;
            line-height: 1.6;
        }
        .features li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #667eea;
            font-weight: bold;
            font-size: 20px;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 40px;
            border-radius: 50px;
            text-decoration: none;
            font-size: 18px;
            font-weight: 600;
            margin-top: 30px;
            transition: transform 0.3s, box-shadow 0.3s;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }
        .version {
            margin-top: 40px;
            color: #999;
            font-size: 14px;
        }
        @media (max-width: 600px) {
            .container {
                padding: 40px 20px;
            }
            h1 {
                font-size: 28px;
            }
            .subtitle {
                font-size: 16px;
            }
            .features {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🚂</div>
        <h1>UTU Viajes y Gastos API</h1>
        <p class="subtitle">Sistema completo para la gestión de viajes, gastos, listas de compra y cotizaciones de monedas</p>
        
        <div class="features">
            <h2>Funcionalidades</h2>
            <ul>
                <li>Usuarios y autenticación (JWT y Google OAuth)</li>
                <li>Gestión de productos y listas de compra</li>
                <li>Cotizaciones de monedas en tiempo real</li>
            </ul>
        </div>
        
        <a href="/api" class="cta-button">Ver Documentación Swagger</a>
        
        <p class="version">API v1.0</p>
    </div>
</body>
</html>
    `.trim();
  }
}
