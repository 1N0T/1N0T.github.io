## Pip en familia debian.
Para intalar **pip** para **python 2.x**
```bash
sudo apt install python-pip
```
Para intalar **pip3** para **python 3.x**
```bash
sudo apt install python3-pip
```

## Virtualenv en familia debian.
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

En **python 3**, en lugar de virtualenv, podemos utilizar el módulo **venv**-

```bash
mkdir myproject
cd myproject
python3 -m venv venv
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







## SSL sobre Bottle.
Bottle utiliza no tiene soporte para **SSL**, pero permite utilizar otras implementaciones de **WSGI**. A continuación mostramos un ejemplo de como utilizar **cheroot** (utilizado por **CherryPy**) para habilitar la comunicación **SSL**.

Requiere la instalación del módulo python correspondiente. 

```bash
sudo pip install cheroot
```

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-
import ssl
import os

from cheroot.ssl.builtin import BuiltinSSLAdapter
from bottle              import route, abort, error, response, run, redirect, request, static_file, ServerAdapter
from cheroot             import wsgi


# Configuramos directorios.
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, 'static')


# Mapeamos el contenido estático.
@route('/')
def recursos():
    return static_file('index.html', root = BASE_DIR)

@route('/static/<fichero:path>')
def recursos(fichero):
    return static_file(fichero, root = STATIC_DIR)


# Creamos un servidor cheroot SSL con el que iniciaremos Bottle (en lugar del
# servidor por defecto que no soporta SSL y tiene peor rendimiento).
# cheroot es el servidor utilizado por CherryPy.
class ServidorSSL(ServerAdapter):

    def run(self, handler):
        servidor = wsgi.Server((self.host, self.port), handler)
        # Los parámetros que recibe son: 
        #     La clave pública.
        #     La clave privada.
        #     La cadena de certificación (este parámetro es opcional)
        servidor.ssl_adapter = BuiltinSSLAdapter("clavePublica.crt", "clavePrivada.key", "cadenaDeCertificados.crt")

        # Deshabilitamos los protocolos más antiguos. Sólo permitimos TLSv1.2
        servidor.ssl_adapter.context.options |= ssl.OP_NO_TLSv1
        servidor.ssl_adapter.context.options |= ssl.OP_NO_TLSv1_1

        try:
            servidor.start()
        finally:
            servidor.stop()


# Iniciamos el servidor WEB.
if __name__ == "__main__":
    run(host="0.0.0.0", port=4443, server=ServidorSSL)

```
