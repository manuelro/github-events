# github-events
AngularJS/Bootstrap directive to display public Github events with configurable templates.

##Installation
Clone the repo or use Bower to download it to your dependencies folder.

####Using Bower:
`bower install github-events --save`

####Adding GithubEvents to your project
Add GithubEvents module to your AngularJS app dependencies:
```js
  angular.module('myApp', ['githubEvents']);
  //...
```

##Configuration options
The GithubEvents Directive allows you to set some configuration inside the config block of your application using the `githubEventsProvider`. The available options are:
####Username
This is an optional way to configure the username for the public Github events you want to display.
```js
  angular.module('myApp', ['githubEvents'])
    .config(function(githubEventsProvider){
      githubEventsProvider.username('foobar');
      //...
    });
```

####Loader Message
This is an optional way to configure the loader message, this is the message that first appear while loading the public events from Github API.
```js
  angular.module('myApp', ['githubEvents'])
    .config(function(githubEventsProvider){
      githubEventsProvider.loader('My custom loader message');
      //...
    });
```

####Error Message
Using this method you can configure the contents of the error message template.
```js
  angular.module('myApp', ['githubEvents'])
    .config(function(githubEventsProvider){
      githubEventsProvider.error('<b>My error message supports directives and bindings</b>');
      //...
    });
```

####Customizing Templates
Use this configuration option if you want to change the template contents for a particular type of event. This method expects 2 parameters and one optional value in the form of (type, section, value). 

![githubEvents directive content distribution](https://raw.githubusercontent.com/manuelro/github-events/master/app/images/github-events.jpg)

The events templates bind to a single event type, since ng-repeat creates a variable named `events`, therefore you can access the event data using AngularJS expressions like follows:
```js
  angular.module('myApp', ['githubEvents'])
    .config(function(githubEventsProvider){
      // Configuring a template section
      githubEventsProvider.template('IssuesCommentEvent', 'heading', '<h4>{{event.actor.login}}</h4>');
      
      // This is equivalent to the first statement, 
      // but instead of passing a string as the second parameter
      // we pass in an object with each one of the sections that you want to modify
      githubEventsProvider.template('IssuesCommentEvent', {
        date: '<small>{{event.created_at}}</small>',
        heading: '<h4>{{event.actor.login}}</h4>'
      });
      //...
    });
```
#####Dates in templates:
This directive uses [timeAgo](https://github.com/yaru22/angular-timeago) filters. It is not needed to install this repo separately since it's already bundled with the project. Refer to it's documentation for further details on how to format dates and times with `timeAgo`.


####Methods Chaining
The configuration methods allow chaining for easier writing.
```js
  //...
  githubEventsProvider.username('myFooUsername').loader('My custom loader message');
  //...
```

##Directives
GithubEvents comes bundled with one main directive and a secondary one that sets the loader contents, for a easier way to create full responsive UX/UI.

####roGithubEvents Directive
This directive serves as the main starting point for the placement of your public Github events. It takes three main attributes which give further freedom for displaying the right amount of data.
```html
  <ro-github-events user="String" minimal="Boolean" limit="Number"></ro-github-events>
```
#####Main Attributes
__user:__ Lets you set the username from the directive itself.

__minimal:__ If this option is set to true, then the icon, avatar and body of the event will be hidden.

__limit:__ This option limits the quantity of events to display, the default Github API is 30 events per username.

#####Secondary attributes
Any of the sections available in the template (`icon`, `date`, `heading`, `avatar` and `body`) can be hidden if needed, just pass this in as an attribute to the directive with a `false` value, and the directive will to the rest. For example:
```html
  <ro-github-events user="myFooUsername" icon="true" body="false"></ro-github-events>
```
This will show the `icon` and hide the `body` sections of every event.


####roGithubLoader Directive
This directive lets you create a custom template for the loader. It must be inside `ro-github-events` directive. Anything you put inside this directive will be transcluded as the content to be displayed while loading your Github events.

```html
  <ro-github-events>
    <ro-github-loader>My custom loader animation goes here</ro-github-loader>
  </ro-github-events>
```

##Events
The `roGithubEventsCtrl` controller emits two events:

__eventsReadyEvent__: This event is emitted when the events have been loaded.

__eventsErrorEvent__: This event is emitted if the server returns an error.

##Contribution and nice-to-have
This is a very new project, but it can expand to support other CSS frameworks out-of-the-box templating. Right now the default templating is based on Twitter Bootstrap. Some templates may not be finished yet, feel free to contribute.
