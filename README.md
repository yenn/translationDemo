translationDemo
===============

Translation Demo App


Prerequisites
-------------
NPM, Grunt-cli (sudo npm install -g grunt-cli)

Install
-------------
> npm install

> grunt

Technologies
-------------
* HTML5 boilerplate (Structure, HTML5)
* Twitter bootstrap (UI)
* Grunt - js based build tool
* Mocha - unit testing
* JsLint - check code guidelines

Architecture
-------------
I have followed the HTML5 boiler plate file structure and placed the code into the js directory
The communication on the page is done via triggering and handling corresponding events. That gives me nice separation of components that are also nicely testable

Functionality
-------------
* LocalStorage - items are sorted by the seach time, clicking item on the right (from the recent search panel) will display the search item in the main form.
* Selecting source language will automatically load only those languages in to the target select, that are supported as a translatable pair, by the API
* Selects are automatically loaded only with those languages that are supported through the API

Build process
-------------
Build process consists of 4 tasks : running tests, running jsLint tool, concatenation and js minification.


Tests
-------------
To run tests : grunt test

Only two sample tests are provided to illustrate the architecture and approach.
