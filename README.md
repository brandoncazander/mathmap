## Getting Started
1. Download and install [Vagrant](http://www.vagrantup.com/) and [VirtualBox](https://www.virtualbox.org/)
2. Clone this repository `git clone https://github.com/brandoncazander/mathmap.git`
3. `cd ./mathmap`
4. `vagrant up`
5. `vagrant ssh`
6. `/vagrant/run.sh`
7. Visit [http://localhost:8100/index](http://localhost:8100/index) for the canvas view or [http://localhost:8100/list](http://localhost:8100/list) for the list view
8. [Django Admin](http://localhost:8100/admin/) username=administrator password=mathmap
9. After you're done, run `vagrant halt` to stop the VM or `vagrant destroy` to completely remove it
