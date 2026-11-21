# Paquete de favicon Kraken

El favicon usa una versión simplificada del símbolo central del logotipo. Se eliminó el texto porque no resulta legible en pestañas de 16×16 o 32×32 píxeles.

## Instalación

1. Copia todos los archivos de esta carpeta a la raíz pública de tu sitio (`public/`, `www/` o equivalente).
2. Copia el contenido de `favicon-head.html` dentro de la etiqueta `<head>` de tu página.
3. Si el sitio no se publica desde la raíz del dominio, adapta las rutas que empiezan por `/` tanto en el HTML como en `site.webmanifest`.

## Archivos principales

| Archivo | Tamaño/uso |
|---|---|
| `favicon.ico` | 16×16, 32×32 y 48×48 en un solo archivo |
| `favicon-16x16.png` | Pestañas y navegadores clásicos |
| `favicon-32x32.png` | Navegadores modernos |
| `favicon-48x48.png` | Windows y accesos directos |
| `favicon-64x64.png` | Tamaño adicional |
| `favicon-96x96.png` | Tamaño adicional para accesos directos |
| `favicon-128x128.png` | Tamaño adicional |
| `favicon-256x256.png` | Tamaño adicional de alta resolución |
| `favicon-512x512.png` | Tamaño adicional de alta resolución |
| `apple-touch-icon.png` | 180×180, iPhone/iPad, fondo sólido |
| `android-chrome-192x192.png` | Android/PWA, fondo transparente |
| `android-chrome-512x512.png` | Android/PWA, fondo transparente |
| `android-chrome-maskable-192x192.png` | Android/PWA adaptable, fondo sólido |
| `android-chrome-maskable-512x512.png` | Android/PWA adaptable, fondo sólido |
| `favicon-master-1024.png` | Maestro transparente para futuras exportaciones |
| `site.webmanifest` | Configuración de la aplicación web |

## Colores

- Azul marino: `#032B59`
- Azul hielo: `#D9EAFB`

Estos tonos fueron muestreados directamente del logotipo suministrado.
