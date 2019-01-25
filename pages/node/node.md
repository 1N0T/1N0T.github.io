## Actualizar versión de node.js.
Procedemos a borrar la caché de npm.
```bash
sudo npm cache clean -f
```
Instalamos de forma global una utilidad llamada **n**.
```bash
sudo npm install -g n
```
Instalamos la última versión estable.
```bash
sudo n stable
```
O podemos especificar una versión determinada.
```bash
sudo n 0.8.20
```
