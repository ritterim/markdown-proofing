---
layout: post
title: "Angular Prime Directive"
date: 2016-02-08 21:12:18
image:  # if no image, color defaults dark blue
description: "The Angular 1.x directive starter guide I wish I had a year ago."
tags:
- Angular
- Directives
- Beginner
categories:
- Development
twitter_text: 'Angular Prime Directive: create prime Angular directives'
authors: Nathan White
---

# Angular Prime Directive

On my journey through the #RIMdev team, I've been maintaining a lot of Angular 1.x . I've had to learn through many mistakes, errors, and other "face-palm" moments. My relationship with the framework has been somewhat of a rollercoaster. I enjoyed every bit of it, don't get me wrong, but certain quirks seemed to keep laughing at me...

After some time,  I was able to help with most of our maintenance needs. One concept that I never understood, was the directive, though. We had some in our code base, but I had never had to touch them. They sat there, working away. Until *that* day came: I had to fix one.
I had a new mentor to help me jump in feet first, and understand them.

#### Why are they so confusing?

I think I was not alone. Many beginners in the Angular world ask similar questions: What are directives? How do they help, I've lived without them so far? Why do you need to bring in a new concept? Directives are simple: they are a way to create custom HTML syntax that works for your specific application. The benefit? It groups small portions of your view with common functionality into a unit. Angular compiles your custom HTML and attaches functionality to the DOM node. So in short, it's some custom HTML. It breaks our application into smaller, more maintainable components (definitely not a new concept). So let's get to some code.

Imagine we start with the following `index.html`, which produces a list of animals and counts how many times they speak:

```HTML
<!DOCTYPE html>
<html>
  <head>
    <link data-require="bootstrap-css@3.3.6" data-semver="3.3.6" rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.css" />
    <script data-require="angular.js@*" data-semver="1.4.8" src="https://code.angularjs.org/1.4.8/angular.js"></script>
    <script data-require="jquery@*" data-semver="2.2.0" src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
    <script data-require="bootstrap@*" data-semver="3.3.6" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="style.css" />
    <script src="app.js"></script>
  </head>
  <body>
    <div class="container" ng-app="app">
      <div class="row" ng-controller="appCtrl">
        <div class="col-md-12">
          <h1>Animals</h1>
          <ul class="list-group">
            <li
            ng-repeat="animal in animals"
            class="list-group-item"
            ng-click="speak(animal);">
              <h4 class="list-group-item-heading">{{animal.name}}</h4>
              <p class="list-group-item-text">
                <span class="badge" >{{animal.count}}</span>
                {{animal.voice}}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </body>

</html>
```

And its accompanying `app.js`:

```javascript
(function(){
    angular.module('app', [])
        .controller(function($scope){
            $scope.animals = [
              {name: 'Dog', voice: 'Woof!', count: 0},
              {name: 'Cat', voice: 'Meow!', count: 0},
              {name: 'Horse', voice: 'Neigh!', count: 0}
            ];

            $scope.speak = function (animal) {
              animal.count++;
            }
        });
})
```

That's a lot of fuddled HTML in one file, which makes it hard to understand. Also imagine, this small list we are building is just one small part of our large app. What if we need to use this same type of list on a different page? We'd have to rewrite the HTML from scratch. Let's start refactoring our list of animals into a reusable directive.

First, let's create a new file `animal-list-directive.html`, and pull the following content out of our `index.html`:

```HTML
<h1>Animals</h1>
<ul class="list-group">
  <li
  ng-repeat="animal in animals"
  class="list-group-item"
  ng-click="speak(animal);">
    <h4 class="list-group-item-heading">{{animal.name}}</h4>
    <p class="list-group-item-text">
      <span class="badge" >{{animal.count}}</span>
      {{animal.voice}}
    </p>
  </li>
</ul>
```

In our `app.js`, we can add a directive:

```javascript
...
angular.module('app', [])
  .directive('animalList', function(){
    //We return a configuration object
    return {
      //we tell it where the partial is
      templateUrl: 'animal-list-directive.html',
      //we want to use this like an (E)lement: also available (A)ttribute (C)lass
      restrict: 'E',
      //we'll be able to control this partial from this controller
      controller: function ($scope) {
        //move the speak function into the directive's controller
        $scope.speak = function (animal) {
          animal.count++;
        }
      }
    }
  });
...
```

And back in the body of `index.html`, we replace the HTML with the directive:

*Tip: Notice the name of the directive is camelCase and the element is kebab-case like most HTML elements*

```HTML
...
<div class="container" ng-app="app">
  <div class="row" ng-controller="appCtrl">
    <div class="col-md-12">
      <animal-list></animal-list>
    </div>
  </div>
</div>
...
```


Well this works! And, I must say, our HTML looks small and easy to manage. What's wrong with this code, though? The problem is: we are dependent on the parent `$scope`. We are accessing the animals from the parent controller, inside our directive. Well that stinks, we were supposed to encapsulate our handiwork. What if we were to to declare a variable on `$scope` inside our directive *AND* inside our controller with the same name? Our directive would overwrite whatever was in the controller (since it is compiled and instantiated last). This scope leakage is an easy trap to fall into. There are 3 values you can use to specify scope in the configuration object of your directive:

1. `false` (Equivalent to not specifying a scope): It will use its parent's scope
2. `true` : It will create a new scope that inherits from the parent scope
3. `{}` (Object literal) : An isolate scope, a new scope that doesn't inherit from the parent

We are going to use an isolate scope, which in most cases, gives you the best encapsulation. Adding this to our directive in `app.js`:

```javascript
...
.directive('animalList', function(){
    return {
      scope: {
        listOfAnimals: '='
      },
      restrict: 'E',
      templateUrl: 'animal-list-directive.html',
      controller: function($scope) {
          $scope.speak = function(animal) {
            animal.count++;
          }
      }
    }
  });
...
```

`scope: { listOfAnimals: '=' }` tells Angular we are now expecting data from outside our directive to come into our directive. As you can see, we use an `'='` sign to signify we want 2-way data-binding to a model. Use this prefix and Angular will always expect a model on the other end. You have 2 more options to use:

1. `'@'` : Text data-binding (1-way data-binding). Angular will always expect an expression
2. `'&'` : Method-binding. Angular expects a function on the parent scope to bind to

So, we isolated our scope, but how do we pass in the data we need? We'll need to modify our `index.html`, and pass our animals from our parent scope :

```HTML
...
<div class="container" ng-app="app">
  <div class="row" ng-controller="appCtrl">
    <div class="col-md-12">
      <!-- Notice the kebab-cased attribute, that was camelCase in the directive -->
      <animal-list list-of-animals="animals"></animal-list>
    </div>
  </div>
</div>
...
```

And, quickly fix up our `animal-list-directive.html` to repeat over our new isolated scope variable:

```HTML
<h1>Animals</h1>
<ul class="list-group">
  <li
  ng-repeat="animal in listOfAnimals"
  class="list-group-item"
  ng-click="speak(animal);">
    <h4 class="list-group-item-heading">{{animal.name}}</h4>
    <p class="list-group-item-text">
      <span class="badge" >{{animal.count}}</span>
      {{animal.voice}}
    </p>
  </li>
</ul>
```

And viola! We have successfully refactored our animal list into a directive. We could then pick easily add an `<animal-list>` element anywhere we want!

The Angular Prime Directive? Make prime Angular directives.

*Note: Obviously we could have just declared the animals inside of the directive for our simple use here, but now we can use any list of animals from any other data sets we have, and aren't limited to the declared set in the directive*
