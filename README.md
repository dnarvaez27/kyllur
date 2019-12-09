# Kyllur

## About the project
The name comes frome the sound of quyllur from Quechuan language that stands for star.
### The project
Initially this project starts as a University project for ISIS-3710 Web development. However, we want to power this tool up to explore things in the sky beyond our sight. We want you to explore the sky above you, explore the stars and satellites above a location , we will show you this objects in real time*

![](https://i.imgur.com/bJWE5Lc.png)

## What we use?
We are using [N2YO](https://www.n2yo.com/) for accessing satellites location in real time, our own database in Mongo to store around 3K stars coordinates parsed from [VizieR](http://vizier.u-strasbg.fr/viz-bin/VizieR?-source=v/50).

### Technologies
* **Node.js**
  * **Express.js**
* **React**
* **WS (WebSockets)**
* **MongoDB - Atlas**

## Running

* Backend
  > To run the backend first configure the environment variables.
  ```
    npm start
  ```
  * To run the backend in development
  ```
    npm run start-dev
  ```
* Frontend
  > To run the frontend first configure the backend endpoint
  ```
    cd front
    npm start
  ```

## Environment Variables
```
  DELTA_INTERVAl: Time interval to notify a user
```
```
  MONGODB_URI: URI to access MongoDB
```
```
  N2YO_KEY: API Key to make N2YO requests
```

## DB Model
```
  Stars: {
    _id:
    nombre:
    estado:
    masa
    descubrimiento
    actualizacion
    estado_publicacion
    tipo_deteccion
    ra
    dec
    distancia_estrella
    masa_estrella
  }
```
```
  Locations: {
    _id
    latitude
    longitude
  }
```

## Collaborators
* Pedro Salazar Paredes  
  [Site](https://pedrito.dev/)
* David Narvaez Guerrero  
  [Site](http://dnarvaez27.github.io/)


## See More
* [Babel CLI](https://babeljs.io/docs/en/babel-cli)
* [Source Maps](https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/)
* [TypeScript CLI](https://www.typescriptlang.org/docs/handbook/compiler-options.html)


___
## Licence
This project is public under the MIT license, found [here](https://github.com/dnarvaez27/kyllur/blob/master/LICENSE)
