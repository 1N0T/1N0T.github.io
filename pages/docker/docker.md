## Docker.
Para realizar la instalación en la familia debian.
``` bash
sudo apt install docker docker-compose
```
## Ejecutar comandos sin sudo.
Para no tener que anteponer **sudo** a todos los comandos de **docker**, podemos seguir el siguiente procedimiento.
``` bash
sudo usermod -aG docker $USER

sudo chown "$USER":"$USER" /home/"$USER"/.docker -R
sudo chmod g+rwx "$HOME/.docker" -R

sudo setfacl -m user:$USER:rw /var/run/docker.sock
```
