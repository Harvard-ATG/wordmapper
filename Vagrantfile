# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.network "forwarded_port", guest: 8000, host: 8000, auto_correct: true
  config.vm.provision :puppet do |puppet|
    puppet.manifests_path = "vagrant/manifests"
  end
  config.vm.provider "virtualbox" do |v|
	v.memory = 1024
	v.cpus = 2
  end
end
