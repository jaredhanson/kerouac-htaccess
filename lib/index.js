/**
 * Module dependencies.
 */
var url = require('url');


/**
 * .htaccess plugin.
 *
 * This plugin adds a `/.htaccess` file to a site, which is used to issue
 * configuration directives to Apache.
 *
 * Examples:
 *
 *     var redirect = {
 *       '/old.html': '/new.html',
 *       '/foo/1.html': { path: '/foo/one/', status: 302 }
 *     }
 *     site.plug(require('kerouac-htaccess')({ redirect: redirect }));
 *
 * @return {Function}
 * @api public
 */
exports = module.exports = function(options) {
  var redirect = options.redirect;
  
  return function robots(site, pages) {
    if (!site.get('base url')) throw new Error('htaccess requires "base url" setting');
    
    site.page('/.htaccess', function(page, next) {
      var uri = url.parse(site.get('base url'))
        , txt = '';
      
      for (var key in redirect) {
        var rdir = redirect[key];
        if (typeof rdir == 'string') {
          rdir = { path: rdir, status: 301 };
        }
        rdir.status = rdir.status || 301;
        uri.pathname = rdir.path;
        
        txt += 'Redirect ' + rdir.status + ' ' + key + ' ' + url.format(uri) + '\n';
      }
      
      page.write(txt);
      page.end();
    });
  }
}
