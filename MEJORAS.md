# MEJORAS — Movete Boedo Movete Web
_Última revisión: mayo 2026_

---

## ✅ COMPLETADO

- Tipografías reales del sistema de identidad (Barlow + Big Caslon CC)
- Preloader con logo al entrar
- Galería completa con lightbox (18 fotos, WebP, lazy loading)
- Formulario de adhesión en sumate.html (estructura lista, backend pendiente)
- PDF de plataforma descargable desde sección 09
- Imágenes convertidas a WebP (115MB → 4.8MB)
- Botones "siguiente sección" en cada acordeón
- Footer con tres columnas y links a páginas internas
- Botón SUMATE flotante
- Favicon con logo MBM
- Texto justificado en contenido editorial
- Scroll al tope al cargar (fix hash en URL)
- analisis.html con texto completo y diseño editorial

---

## PRIORIDAD ALTA

### 4. Analytics
Sin métricas no sabés cuánta gente entra, desde dónde, qué secciones leen.
Opciones:
- **Plausible** (privacy-first, sin cookies, sin banner): recomendado
- **Google Analytics 4**: más potente, requiere banner de cookies
Ver TODO en index.html.

### 5. Lista completa de candidatos
La sección 05 solo tiene un párrafo y el PDF. Agregar cards para cada uno de
los 20 candidatos: nombre, rol, zona o profesión. No necesita foto de todos —
con nombre y cargo alcanza para dar volumen y seriedad a la propuesta.

---

## PRIORIDAD MEDIA

### 6. WhatsApp flotante
Botón fijo bottom-left con link a WhatsApp para consultas rápidas.
Implementación: 10 líneas de CSS y un link `https://wa.me/549XXXXXXXXX`.
Alto impacto en conversión, especialmente desde mobile.

### 7. Botón "Compartir" nativo
En mobile, un botón que dispare la Web Share API (`navigator.share()`) para
compartir el sitio directamente por WhatsApp, Instagram o donde el usuario elija.
Fallback: copiar el link al portapapeles. Ideal en el hero o en el footer.

### 8. Barra de progreso de lectura en analisis.html
El análisis es un documento largo. Una barra fina en el tope de la página que
muestre el avance de lectura mejora la UX y da sensación de control.
Implementación: ~15 líneas de JS con `scrollY / (scrollHeight - innerHeight)`.

### 9. Política de privacidad
El formulario de adhesión recolecta datos personales. Es buena práctica (y en
algunos contextos obligatorio) tener una página mínima de política de privacidad
linkeada desde el checkbox del formulario. Una página simple, 300 palabras.

### 10. Sección de novedades / prensa
Una página o sección con apariciones en medios, comunicados y actividades.
Formato mínimo viable: lista de cards con título, medio, fecha y link externo.
Se puede mantener manualmente editando el HTML.

### 11. Video de presentación
Si existe material audiovisual del lanzamiento o spots de campaña, integrarlo
en la sección de candidatos o en una sección dedicada.
Usar `<video>` con `autoplay muted loop` + poster, o embed de YouTube/Vimeo.

### 12. CSS print para analisis.html
El análisis es un documento que la gente puede querer imprimir o guardar como PDF.
Un `@media print` básico que oculte nav, ajuste márgenes y use fuente negra
sobre blanco tarda 30 minutos y mejora mucho la lectura impresa.

---

## PRIORIDAD BAJA / FUTURO

### 13. Testimonios de socios
3–4 citas cortas de socios (nombre + número de socio + zona) reforzando la identidad
"lista de socios". Formato: quote grande en serif + nombre pequeño. Muy fácil de
implementar, da mucha autenticidad.

### 14. Mapa de adherentes
Un SVG de Argentina coloreado por provincia según el campo "zona" del formulario.
Requiere que el backend del form esté funcionando. Impacto visual alto pero
complejidad media. Evaluar si tiene datos suficientes para tener sentido.

### 15. Schema.org markup
Agregar JSON-LD de tipo `Organization` + `Event` en el head para que Google
entienda mejor el sitio. Mejora la aparición en búsquedas relacionadas con CASLA 2026.

### 16. Accesibilidad (a11y)
- Skip link "Ir al contenido" al inicio del body
- Foco visible en todos los elementos interactivos (actualmente se pierde en algunos)
- Revisar contraste WCAG AA en textos pequeños sobre fondo cream
- Asegurar que el lightbox de galería sea navegable por teclado (ya implementado parcialmente)

### 17. Animación de entrada en hero
El hero es la primera impresión. Una animación de entrada sutil (fade + slide up
escalonado en las líneas del título) con CSS puro daría más presencia al sitio
sin agregar peso.

---

## INFRAESTRUCTURA

### 18. Dominio propio
Registrar `moveteboedo.com.ar` cuanto antes. El `.com.ar` refuerza el carácter
nacional y es más creíble para el votante de CASLA.
Proveedores: NIC Argentina (oficial), Donweb, Cloudflare Registrar.

### 19. Migrar hosting a Netlify o Cloudflare Pages
GitHub Pages funciona, pero Netlify ofrece:
- Deploy previews por rama
- Formularios nativos (resolvería el TODO del form)
- Headers de caché configurables
- Redirects simples
Sin costo para este volumen de tráfico.

### 20. Lighthouse audit
Correr un audit completo y apuntar a > 90 en Performance, Accessibility y SEO.
Los principales gains probables: caché de assets, tamaño del HTML, ARIA roles faltantes.

---

## NOTAS TÉCNICAS

- **Stack**: HTML + CSS + JS vanilla. Sin build tools. Correcto para el alcance actual.
- **Si el sitio crece**: migrar a Astro mantiene vanilla pero agrega estructura, SSG y mejor SEO.
- **Fonts**: locales (Barlow + Big Caslon CC), sin dependencia de Google Fonts. ✅
- **Imágenes**: todas en WebP con lazy loading. ✅
- **Deploy actual**: GitHub Pages en `waldo2103.github.io/mbm-web`
