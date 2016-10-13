# puppet manifest

# Make sure the correct directories are in the path:
Exec {
    path => [
    '/usr/local/sbin',
    '/usr/local/bin',
    '/usr/sbin',
    '/usr/bin',
    '/sbin',
    '/bin',
    ],
    logoutput => true,
}

# Refresh the catalog of repositories from which packages can be installed:
exec {'apt-get-update':
    command => 'apt-get update'
}

exec {'setup-nodejs-source':
	command => 'curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -'
}

# Make sure we have some basic tools and libraries available
$packages = [
    'build-essential',
    'python2.7',
    'git',
    'postgresql',
    'postgresql-contrib',
    'awscli'
]

package { $packages: ensure => latest, }

package {'nodejs':
    ensure => latest,
    require => [Exec['apt-get-update'],Exec['setup-nodejs-source']],
}
# Install npm libraries
exec {'install-node-modules':
	cwd => '/vagrant',
	command => 'npm install',
	require => Package['nodejs'],
	user => 'vagrant',
	group => 'vagrant',
	logoutput => true,
}

# Setup postgres database
exec {'setupdb':
		cwd => '/vagrant',
		command => '/vagrant/vagrant/setupdb.sh',
		require => [Package['postgresql'],Package['postgresql-contrib']],
		user => 'vagrant',
		group => 'vagrant',
		logoutput => true
}

# Make sure PATH is set
file_line {'update PATH for node_modules':
    ensure => present,
    line => 'export PATH=/vagrant/node_modules/.bin:$PATH',
    path => '/home/vagrant/.profile',
    require => Exec['install-node-modules'],
}

