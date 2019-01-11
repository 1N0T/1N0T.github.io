## Instalar GO en familia debian.
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
## Hola mundo !!!
```
package main
import "fmt"

func main() {
    fmt.Println("Hola mundo !!!)
}

```
```
go run hola-mundo.go
```
```
go build hola-mundo.go
./hola-mundo
```
