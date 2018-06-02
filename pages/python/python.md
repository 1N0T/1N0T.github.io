
# Virtualenv en familia debian.
Para evitar el conflicto entre diferentes versiones de librerías necesarias para nuestros proyectos python, utilizaremos **virtualenv**. Para instalarlo, tenemos que seguir los siguientes pasos:
```bash
sudo -H pip install virtualenv
```
Para crear un entorno virtual separado, realizaremos lo siguiente:
```bash
mkdir myproject
cd myproject
virtualenv venv
source venv/bin/activate
```
A partir de este momento ya estamos en un entorno python aislado. Lo reconoceremos porque nos aparecerá, en nuestro caso, algo como **(venv)** al principio del prompt de la línea de comandos.

Podemos instalar nuevos paquetes, que se copiarán dentro de nuestro directorio, sin afectar a la instalación python del sistema.
```bash
pip install flask
```
Para regresar a la situación normal, desactivaremos el entorno virtual con:
```bash
deactivate 
```

Si queremos crear un entorno virtual utilizando **python 3**
```bash
mkdir myproject
cd myproject
virtualenv -p python3 venv
source venv/bin/activate
```

Ya podemos proceder a instalar los paquetes que nos interesen.
```bash
pip3 install jupyter
```
Para desactivar el entorno virtual.
```bash
deactivate
```

En ambos casos, en lugar de:
```bash
source venv/bin/activate
```
Podemos activar el entorno virtual con:
```bash
. venv/bin/activate
```