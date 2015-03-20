'use strict';

describe('Provider: githubEventsProvider', function () {

  beforeEach(module('githubEvents'));
  var provider;

  describe('config username', function (){
    var username = 'johnDoe';

    beforeEach(module('githubEvents', function (githubEventsProvider){
      githubEventsProvider.username(username);
    }));

    beforeEach(inject(function (githubEvents){
      provider = githubEvents;
    }));

    it('should get username', function (){
      expect(provider.getUser()).toBe(username);
    });
  });

  describe('config template', function (){
    var eventType = 'IssuesEvent';
    var eventSection = 'fooSection';
    var tplContents = 'My new template';
    var tplPath;

    beforeEach(module('githubEvents', function (githubEventsProvider){
      githubEventsProvider.template(eventType, eventSection, tplContents);
    }));

    beforeEach(inject(function (githubEvents){
      provider = githubEvents;
    }));

    it('should get template', function (){
      tplPath = provider.getTemplate('IssuesEvent', eventSection);
      expect(tplPath).toContain(eventSection);
    });

    it('should return default-empty if template section does not exists', function (){
      tplPath = provider.getTemplate('IssuesEvent', 'invalidSection');
      expect(tplPath).toContain('default');
      expect(tplPath).toContain('empty');
    });

  });

  describe('config loader', function (){
    var message = 'My custom loader message';

    beforeEach(module('githubEvents', function (githubEventsProvider){
      githubEventsProvider.loader(message);
    }));

    beforeEach(inject(function (githubEvents){
      provider = githubEvents;
    }));

    it('should get loader message', function (){
      expect(provider.getLoader()).toContain(message);
    });
  });

  describe('config error', function (){
    var message = 'My custom error message';

    beforeEach(module('githubEvents', function (githubEventsProvider){
      githubEventsProvider.error(message);
    }));

    beforeEach(inject(function (githubEvents){
      provider = githubEvents;
    }));

    it('should get error message', function (){
      expect(provider.getError()).toContain(message);
    });
  });

});
