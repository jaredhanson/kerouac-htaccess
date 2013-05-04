var htaccess = require('index');

function MockSite() {
  this.settings = {};
  this.pages = {};
}

MockSite.prototype.get =
MockSite.prototype.set = function(setting, val) {
  if (1 == arguments.length) {
    return this.settings[setting];
  } else {
    this.settings[setting] = val;
    return this;
  }
}

MockSite.prototype.page = function(path, fn) {
  this.pages[path] = new MockPage(path, fn);
}

function MockPage(path, fn) {
  this.path = path;
  this.fn = fn;
  this.data = '';
}

MockPage.prototype.write = function(data) {
  this.data += data;
}


describe('htaccess plugin', function() {
  
  it('should export function', function() {
    expect(htaccess).to.be.a('function');
  });
  
  describe('when invoked', function() {
    var site = new MockSite();
    site.set('base url', 'http://www.example.com/')
    
    var redirect = {
      '/old-1.html': '/new-1.html',
      '/foo/2.html': '/foo/two/'
    }
    
    htaccess({
      redirect: redirect
    })(site, site.pages);
    
    it('should add /.htaccess page', function() {
      expect(site.pages).to.include.keys('/.htaccess');
    });
    
    describe('and then rendering .htaccess', function() {
      var p = site.pages['/.htaccess'];

      it('should write .htaccess', function(done) {
        var expected = [
          "Redirect 301 /old-1.html http://www.example.com/new-1.html",
          "Redirect 301 /foo/2.html http://www.example.com/foo/two/",
          ""
        ].join("\n");
        
        p.end = function() {
          expect(p.data).to.equal(expected);
          done();
        };
        
        p.fn(p, function(err) {
          return done(new Error('should not call next'));
        });
      });
    });
  });
  
  describe('when invoked with optioned redirects', function() {
    var site = new MockSite();
    site.set('base url', 'http://www.example.com/')
    
    var redirect = {
      '/old-1.html': '/new-1.html',
      '/foo/2.html': { path: '/foo/too/', status: 302 }
    }
    
    htaccess({
      redirect: redirect
    })(site, site.pages);
    
    it('should add /.htaccess page', function() {
      expect(site.pages).to.include.keys('/.htaccess');
    });
    
    describe('and then rendering .htaccess', function() {
      var p = site.pages['/.htaccess'];

      it('should write .htaccess', function(done) {
        var expected = [
          "Redirect 301 /old-1.html http://www.example.com/new-1.html",
          "Redirect 302 /foo/2.html http://www.example.com/foo/too/",
          ""
        ].join("\n");
        
        p.end = function() {
          expect(p.data).to.equal(expected);
          done();
        };
        
        p.fn(p, function(err) {
          return done(new Error('should not call next'));
        });
      });
    });
  });
  
  describe('when invoked on a site without base url setting', function() {
    var site = new MockSite();
    
    it('should throw an error', function() {
      expect(function() {
        htaccess({})(site, site.pages);
      }).to.throw(/requires \"base url\" setting/);
    });
  });
  
});
