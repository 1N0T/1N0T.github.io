
## Recursos de interés.

[Aquí](https://git-scm.com/book/es/v1/) tenemos una traducción al castellano, del libro **Pro Git**, y que podemos leer online de forma gratuita. 


## Subir un proyecto ya existente a GITHUB.
A menudo nos encontramos que hemos estando trabajando en una prueba de concepto, que pensábamos que no iba a llegar a nada interesante, pero de forma milagrosa, tras haber dedicado seguramente más horas de las que creemos, pensamos que podría resultar de interés para alguien más.

¿Que tenemos que hacer para subirlo a nuestra cuenta de **GitHub**?
* Creamos un nuevo proyecto den GitHub. Es recomendable añadir los ficheros de **licencia** y de **readme**
* Abrimos una consola de comandos en nuestro equipo. 
* Nos colocamos en el directorio raiz de nuestro proyecto.
* Con nuestro editor favorito, creamos el fichero **.gitignore** para indicar cuales son los ficheros que no tiene sentido que se guarden en el repositorio. Podemos encontrar una nutrida colección de plantillas  [aquí](https://github.com/github/gitignore) (seguro que encontramos una que se ajuste a nuestras necesidades).
* Posterirormente ejecutamos los siguientes comandos:
  * Inicializamos el proyecto.

    `git init`

  * Añadimos todo el contenido del directorio (excepto las excepciones de **.gitignore**).

    `git add .`

  * Realizamos la primera confirmación de cambios (en el repositorio local).

    `git commit -m "Commit inicial"`

  * Si no tenemos configurado nuestro usuario y correo, nos aparecerá un error que podemos subsanar con los comandos siguientes:
 
    `git config user.name "MiUsuario"`

    `git config user.email "MiEmail"`
  
  * Confirmamos los cambios que no habíamos confirmado antes.

    `git commit -m "Commit inicial"`
  
  * Añadimos la referencia a nuestro proyecto remoto de GitHub y que identificaremos como **origin**.

    `git remote add origin https://github.com/MiUsuario/MiProyecto.git`

  * Importamos a nuestro proyecto local, los ficheros de la rama **master**, del proyecto remoto que no existen (licencia y readme).

    `git pull https://github.com/MiUsuario/MiProyecto.git master`

  * Subimos todos los cambios pendientes de la rama **master**, al repositorio remoto que hemos identificado como **origin**.

    `git push -u origin master`

  * Nos hemos dado cuenta de que hemos subido un directorio que no necesitamos, y que no estaba en la lista de exclusiones. Procedemos a eliminarlo del control de cambios (no lo borramos realmente).
 
    `git rm -r --cached MiCarpetaInnecesaria`

  * Volvemos a subir los cambios (para eliminar el directrio innecesario).

    `git commit -m "Excluir ficheros innecesarios"`

    `git push -u origin master`
