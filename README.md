# kerouac-htaccess

This is a [Kerouac](https://github.com/jaredhanson/kerouac) plugin that supports
[.htaccess](http://en.wikipedia.org/wiki/Htaccess).  These files are
configuration files that reside in the same directory as the website, and are
used to issue directives to [Apache](http://httpd.apache.org/) (or other
compatible web server).

## Install

    $ npm install kerouac-htaccess
    
## Usage

This plugin is typically used to declare redirects in the situation where your
URL structure has changed, and you want to point old URLs to their new location.

    var redirect = {
      '/guide/intro.html': '/guide/intro/'
    }

    site.plug(require('kerouac-htaccess')({ redirect: redirect }));

## Tests

    $ npm install
    $ make test

[![Build Status](https://secure.travis-ci.org/jaredhanson/kerouac-htaccess.png)](http://travis-ci.org/jaredhanson/kerouac-htaccess)  [![David DM](https://david-dm.org/jaredhanson/kerouac-htaccess.png)](http://david-dm.org/jaredhanson/kerouac-htaccess)

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2012-2013 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>
