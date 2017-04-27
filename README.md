# CReddit
A simple Reddit reader

## About
Credit was made during a 48 hour code challenge.

- __PHP Framework:__ 
	- Slim PHP
- __Front End Frameworks:__
    - Bootstrap
    - AngularJS
- __Front End Scripting:__
    - Twig Template
    - Sass
- __Task Runner:__ 
	- Grunt
- __Dependency Managers:__
    - Bower
    - Node Package Manager

## Dependencies

The following packages and libraries are required to install and run CReddit.

- [Apache2](https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-slim-framework-on-ubuntu-14-04#quick-setup-for-prerequisites)
- [Composer](https://getcomposer.org)
- [Node.js & Node Package Manager](https://nodejs.org/en/download/package-manager/)
- [Bower](https://www.npmjs.com/package/bower)
- [Ruby](https://www.ruby-lang.org/en/documentation/installation/)
	- [Sass](http://sass-lang.com/install)
	- [Grunt](https://gruntjs.com/installing-grunt)
- PHP >= v.5.5
	- Extensions:
		- mb-string *
		- mcrypt
		- php-xml

## Installation

After installing the dependencies, following the below steps to finish installing CReddit.

- Clone into web root parent directory.
- Point web document root to `./public` folder.
- Run `composer install` in project root.
- In `./dev`, run `npm install`, then `bower install && grunt build` to finish loading dependencies and build assets.


## To Run

#### From Browser

- map `./public` folder to web root.
- Go to root url in your browser.
- The default subreddit is `gameofthrones` but you can browse any subreddit by going to the `/{subreddit_name}/`.
