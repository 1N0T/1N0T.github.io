## Iniciar cluster swarm.
``` bash
docker swarm init --advertise-addr 10.1.1.10
```
## Añadir un nodo al cluster swarm.
En el nodo anterior, ejecutar el siguiente comando.
``` bash
docker swarm join-token manager
```
Nos mostrará algo parecido a:
``` bash
docker swarm join --token bla-bla-bla... 10.1.1.10:2377
```
La salida del comando, la copiamos y la ejecutamos en cada uno de los nodos que queramos añadir al cluster.

## Visulizar los nodos del cluster.
``` bash
docker node ls
```

## Crear redes virtuales.
``` bash
docker network create --driver overlay miRedVirtual
```
Esto crea una especie de **VLAN** llamada **miRedVirtual**. Podemos visualizar las redes disponibles con
```
docker network ls
```
Podemos conectar caontainers a la red especificando su nombre. Los servicios conectados a la misma VLAN, se pueden comunicar entre ellos utilizando el nombre del servicio (como si fuera su nombre DNS).
``` bash
docker service create --name psql --network miRedVirtual -e POSTGRES_PASSWORD=miContraseña postgres
```

