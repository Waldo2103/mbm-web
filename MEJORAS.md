# MEJORAS — Movete Boedo Movete Web

Lista de mejoras propuestas, ordenadas por impacto y prioridad.

---

## PRIORIDAD ALTA

### 1. Foto real del candidato
Reemplazar el placeholder con la foto oficial de Manuel Agote (preferentemente en camiseta del club o con identidad visual de MBM). El placeholder actual tiene un patrón de diagonal pero la imagen real va a darle mucha más fuerza a la sección de candidatos.

### 2. Formulario de adhesión (SUMATE)
El botón "SUMATE" lleva a la sección CTA pero no hay forma de adherirse online. Agregar un formulario con:
- Nombre completo
- Número de socio CASLA
- Email
- Zona geográfica (ciudad/provincia)
- Checkbox de aceptación de política de privacidad

Integrar con: Google Forms embebido (rápido), Typeform, o Formspree si se quiere más control.

### 3. Tipografías reales del sistema de identidad
Cuando estén disponibles, reemplazar Barlow Condensed y Playfair Display por las tipografías originales del sistema gráfico de MBM. Ajuste mínimo de pesos y tamaños según la fuente final.

### 4. Favicon y meta imagen
- Agregar favicon con el cuervo o el logo MBM
- Agregar imagen OG (1200×630px) para cuando se comparte en redes sociales e Instagram Stories
- Completar meta tags: `og:image`, `og:url`, `twitter:card`

### 5. Lista completa de candidatos
Actualmente solo aparece el candidato a presidente. Agregar:
- Candidato/a a vicepresidente
- Resto de la lista (si se define)
- Sistema de cards replicable para cada candidato

---

## PRIORIDAD MEDIA

### 6. Animación del cuervo en el hero
El cuervo es el símbolo de MBM. Agregar un cuervo en SVG animado que vuele a través del hero al cargar la página. Opciones:
- SVG con animación CSS de vuelo (path animation)
- Lottie animation si se tiene la ilustración
- Sutil: que aparezca una sola vez al cargar y desaparezca

### 7. Contador regresivo al evento
Si hay eventos futuros, un countdown en el hero o en la hero__event card (`02 MAYO · quedan X días`) le da urgencia y dinamismo.

### 8. Video de presentación
Si existe material audiovisual (grabacion web movete.mov ya está en el repositorio), embeber un video de lanzamiento o presentación en la sección de candidatos o en una sección dedicada. Usar `<video>` con autoplay muted + poster, o un embed de YouTube/Vimeo.

### 9. SEO y Analytics
- Completar `<title>` con keywords relevantes
- Agregar Google Analytics 4 o Plausible (privacy-first)
- Agregar Meta Pixel si se van a hacer campañas en Instagram/Facebook
- Schema.org markup para la organización

### 10. Sección de prensa y novedades
Una sección simple con las últimas apariciones en medios o comunicados. Puede ser:
- 3 cards con título, medio, fecha y link
- Un feed de noticias básico (incluso manual en un JSON)
- Integración con el feed de Instagram si hay contenido ahí

---

## PRIORIDAD BAJA / MEJORAS FUTURAS

### 11. Modo oscuro / claro
El sitio es 100% oscuro por diseño institucional. No es urgente, pero si se agregan secciones con mucho texto largo podría evaluarse.

### 12. WhatsApp flotante
Botón flotante de contacto por WhatsApp para que socios hagan consultas o quieran sumarse informalmente. Implementación trivial, impacto alto en conversión.

### 13. Galería de fotos
Sección con fotos del lanzamiento en Ushuaia, actividades previas, asistencia a asambleas, etc. Lightbox simple (sin librerías externas, CSS puro).

### 14. Versión PDF descargable de la plataforma
Generar un PDF de la plataforma 2026 con la misma estética y ofrecer descarga en la sección de propuestas. Herramienta: Canva, InDesign o CSS print stylesheet.

### 15. Mapa interactivo de adherentes
Un mapa de Argentina (SVG o Leaflet.js) que muestre la distribución geográfica de socios adherentes, actualizado según los registros del formulario.

### 16. Testimonios de socios
Sección con 3-4 citas de socios con nombre (y número de socio opcional), reforzando la identidad "lista de socios". Formato simple: quote + nombre + zona.

### 17. Preloader de entrada
Una animación breve al cargar la página: el logo MBM aparece sobre fondo navy y hace un fadeout antes de mostrar el sitio. Da una sensación premium y da tiempo a que carguen las fuentes.

### 18. Optimización de performance
- Convertir todas las imágenes a WebP
- Agregar `loading="lazy"` a imágenes below-the-fold
- Preload de fuentes críticas
- Target: Lighthouse > 90 en todas las métricas

### 19. Internacionalización mínima (i18n)
Si el alcance de la campaña crece: versión en inglés para socios en el exterior. Implementación simple con `?lang=en` y un JS de swapping de strings.

### 20. Accesibilidad (a11y)
- ARIA labels en elementos interactivos
- Foco visible en todos los links
- Contraste mínimo WCAG AA en textos pequeños (revisar el texto en crema sobre fondo navy)
- Navegación por teclado completa

---

## NOTAS TÉCNICAS

- **Stack actual**: HTML + CSS + JS vanilla. Sin build tools. Ideal para el alcance actual.
- **Siguiente paso si crece**: Migrar a Astro (mantiene vanilla pero agrega structure, partial hydration, y facilita SEO/SSG).
- **Hosting recomendado**: Netlify (free tier, deploy en < 1 min, HTTPS automático, formularios nativos).
- **Dominio**: Registrar `moveteboedo.com` o `moveteboedo.com.ar` cuanto antes.
