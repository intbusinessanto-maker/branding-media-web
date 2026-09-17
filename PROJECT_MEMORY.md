# 🧭 Memoria del Proyecto — Bmmedios Web / branding-media-web

> Este archivo es la fuente de verdad sobre el estado del proyecto. Cualquier IA (Claude, Cursor, Copilot, Gemini, etc.) que trabaje aquí debe leerlo ANTES de tocar código, y actualizarlo DESPUÉS de completar trabajo significativo.

## 🎯 Norte del proyecto

- **Objetivo:** _(completar: qué problema resuelve este proyecto y para quién)_
- **Éxito significa:** _(completar: criterios de "terminado" / KPIs del proyecto)_
- **Stack principal (detectado automáticamente):** React

## 📍 Estado actual

- **Fase:** _(completar: MVP / en producción / refactor / mantenimiento)_
- **Última actualización:** 2026-07-28
- **Avance general:** _(completar: % aproximado y qué falta para la siguiente milestone)_

## 🗺️ Arquitectura y decisiones clave

| Fecha | Decisión | Por qué | Alternativas descartadas |
|---|---|---|---|
| 2026-07-28 | Se crea este archivo de memoria de proyecto | Dar trazabilidad y contexto a cualquier IA que retome el proyecto | — |

## 🕒 Historial de cambios

| Fecha | Qué se hizo | Archivos clave | Tests |
|---|---|---|---|
| 2026-07-28 | Configuración inicial de memoria de proyecto (PROJECT_MEMORY.md + reglas en CLAUDE.md) | PROJECT_MEMORY.md, CLAUDE.md | N/A |
| 2026-07-28 | Configuración de Vitest + Testing Library + reporter tdd-guard-vitest (patrón replicado desde Danger Agency). No había tests sueltos no-Vitest que excluir. Se agregó script `test` en package.json | vite.config.ts, src/test/setup.ts, src/test/smoke.test.ts, package.json, .gitignore, .claude/tdd-guard/data/config.json | Smoke test (`vitest setup > runs`) pasando |
| 2026-09-16 | Actualización de dirección y teléfono de oficina en todo el sitio: nueva dirección (Calle 93a # 13-24, Piso 5, Edificio QBO, Bogotá) y nuevo teléfono fijo (601 6672681) reemplazando el celular +57 301 697 8741 en la info visible. El número celular se mantiene intacto solo para los enlaces de WhatsApp (wa.me), por decisión del usuario, ya que WhatsApp requiere número celular. Se agregó la dirección como dato nuevo (antes solo existía "Bogotá, Colombia" sin dirección de calle). Verificado visualmente con dev server + browser-automation (screenshots de Contact y Footer), sin errores de consola nuevos. | src/components/Contact.tsx, src/components/Footer.tsx, index.html (Schema.org JSON-LD: telephone + address), public/llms.txt | Verificación visual (browser-automation), no aplica TDD (cambio de contenido estático, no lógica) |

## ⏭️ Próximos pasos

- [ ] _(pendiente por definir — completar con el backlog real del proyecto)_

## ⚠️ Riesgos y deuda técnica conocida

- _(ninguno registrado aún)_

## 📐 Reglas de trabajo para cualquier IA en este repo

1. **No parchear sin analizar el panorama completo.** Antes de resolver un bug o implementar un pedido, revisa cómo está construido el sistema (arquitectura, módulos relacionados, no solo el archivo que falla).
2. **TDD siempre que aplique.** Escribe o actualiza tests antes o junto con la implementación. No des una tarea por terminada sin pruebas que la validen.
3. **Actualiza este archivo** (Historial de cambios, Próximos pasos, Decisiones) al terminar cualquier tarea con cambios relevantes.
4. **Registra decisiones de arquitectura importantes** en la tabla de Decisiones, con el porqué y qué alternativas se descartaron.
5. **Prioriza soluciones escalables** sobre arreglos rápidos de un solo uso, salvo que se pida explícitamente lo contrario.
