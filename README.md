# cards-against
Juego de cartas multijugador online inspirado en "Cartas contra la humanidad"
 
front-end desplegado en https://cards-against.netlify.app

back-end desplegado en https://cards-against-api-socket.herokuapp.com

### como montar el proyecto
tenemos dos componentes:
* un front-end hecho react y styled-components (carpeta www)
* un back-end hecho con nodejs y socket.io (carpeta api)

en ambas carpetas es necesario instalar las dependencias `node_modules` (con `npm install` o con `yarn`). Esto solo es necesario hacerlo una vez.
* para arrancar el backend con live-reload se usa el comando `npm run dev` en la carpeta `api`
* para arrancar el frontend con live-reload se usa el comando `npm start` en la carpeta `www`

### contribuciones
Todas las contribuciones son bienvenidas, tanto en forma de feedback (issue) como en forma de codigo (PR) siempre que se mantengan las reglas de estilo definidas via eslint
