# TODO — sebascm-dev.com

Ideas y features pendientes para implementar en el futuro.

---

## Panel de Administración

- [ ] **Indicador online/offline** — cuando el admin está logueado mostrar un icono de "online" en el perfil público o en algún lugar del portfolio. Requiere WebSockets/polling o lógica de "sesión activa en los últimos X minutos". Feature independiente, no relacionada con el perfil.

---

## Perfil

- [ ] **Skills/Tecnologías** — tabla `profile_skills` con nombre, nivel (básico/intermedio/avanzado) y categoría (frontend, backend, tools). Gestionable desde el admin y mostrable en el portfolio.
- [ ] **Educación** — tabla `profile_education` con institución, título, año inicio/fin. Por ahora cubierto con el campo `degree`.
- [ ] **Idiomas detallados** — tabla `profile_languages` con idioma y nivel (nativo, B2, C1...). Por ahora cubierto con campo de texto libre.

---

## Portfolio público

- [ ] Conectar datos del portfolio público a la DB en vez de `src/data/about.ts`

---
