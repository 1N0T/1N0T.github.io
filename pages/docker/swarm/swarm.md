## Iniciar cluster swarm.
```bash
docker swarm init --advertise-addr 10.1.1.10
```
## Añadir un nodo al cluster swarm.
En el nodo anterior, ejecutar el siguiente comando.
```bash
docker swarm join-token manager
```
Nos mostrará algo parecido a:
```bash
docker swarm join --token bla-bla-bla... 10.1.1.10:2377
```
La salida del comando, la copiamos y la ejecutamos en cada uno de los nodos que queramos añadir al cluster.

## Visulizar los nodos del cluster.
```bash
docker swarm ls
```

