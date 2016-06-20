# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "ubuntu/trusty64"
  # Web server port
  config.vm.network "forwarded_port", guest: 8000, host: 8000, auto_correct: true
  # Karma port
  config.vm.network "forwarded_port", guest: 9876, host: 9876, auto_correct: true
  config.vm.provision :shell do |shell|
    shell.inline = "mkdir -p /etc/puppet/modules;
                    puppet module install puppetlabs-stdlib --force;"
  end
  config.vm.provision :puppet do |puppet|
    puppet.manifests_path = "vagrant/manifests"
  end
  config.ssh.forward_agent = true
  config.vm.provider "virtualbox" do |v|
    # Seems to be required for Ubuntu
    # https://www.virtualbox.org/manual/ch03.html#settings-processor
    v.customize ["modifyvm", :id, "--pae", "on"]
    # Recommended for Ubuntu
	v.cpus = 2
	v.memory = 1024
  end
end
