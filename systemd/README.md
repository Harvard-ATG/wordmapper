This includes the `systemd` service file used to run wordmapper on an Ubuntu 16.04 Xenial server.

To setup:

```sh
$ cp ./wordmapper.service /lib/systemd/system/wordmapper.service
$ systemctl daemon-reload
$ sudo service wordmapper start
$ sudo service wordmapper status
```

