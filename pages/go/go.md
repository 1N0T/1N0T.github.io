## Instalar GO en família debian.
Utinizamos **snap** para realizar la instalación.
```bash
sudo snap install go --classic
```
Los programas instalados con **snap** se depositan en los siguientes directorios
```
/snap/bin                   - Enlaces simbólicos a las aplicaciones.
/snap/<snapname>/<revision> - Punto de montaje para el contenido del snap.
/snap/<snapname>/current    - Enlace simbólica a la versión actual.
```
