# SOPHIETASTE · Del guardado al plato

Landing del recetario digital «Del guardado al plato» (colección Recetarios por el mundo).
Publicada en Netlify: https://sophietaste.netlify.app

## Precio y oferta
Todo se cambia en `script.js` → `CONFIG` (precio, precio regular, fecha de fin de oferta y enlace de Hotmart).
Después del `offerEnds`, la página muestra sola el precio regular y oculta los textos de lanzamiento.
Revisá siempre que Hotmart cobre el mismo precio que muestra la página.

## Píxel de Meta
El píxel se carga desde Netlify (Snippet injection), no desde este código.
Los botones de compra envían el evento `InitiateCheckout` si el píxel está cargado.

## Archivos
- `index.html` · estructura y textos
- `styles.css` · diseño (paleta y tipografías del recetario)
- `script.js` · precio, botones de compra y aviso «Más recetas»
- `img/` · portada y páginas del recetario
- `fonts/` · Lora e Inter (SIL Open Font License)
