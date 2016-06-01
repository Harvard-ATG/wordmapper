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

# Make sure we have some basic tools and libraries available
package {'git':
    ensure => latest,
    require => Exec['apt-get-update'],
}
package {'nodejs':
    ensure => latest,
    require => Exec['apt-get-update'],
}
package {'nodejs-legacy':
    ensure => latest,
    require => Package['nodejs']
}
package {'npm':
    ensure => latest,
    require => Package['nodejs-legacy']
}
