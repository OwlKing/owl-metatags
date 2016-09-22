# **Owl Metatags**

Module to manage meta tags and [Open Graph](http://ogp.me/) data based on [ui-router](https://ui-router.github.io/) states. Its goal is to make building search engine and social platform friendly sites easier.

## Compatibility and dependencies

Library has been tested with Angular 1.5.x and ui-router 0.2.x.

## Installation

### 1. Download
```bash
bower install owl-metatags
```

### 2. Include in your app
Make sure the file `owl-metatags.js` is being loaded in your app.

Declare the dependency in your Angular module:
```js
angular.module('myApp', ['ui.router', 'owlMetatags']);
```

Include owl-metatags directive in your html template:

```html
<head>
  <owl-metatags></owl-metatags>
</head>
```

## Configuration and usage

### Available options

Option        | Type            | Description                | Example
------------- |:---------------:| -------------------------- | -------
title         | `string`        | value of `<title>`. | `Welcome to My App`
titleSuffix   | `string`        | string appended to every title. | ` | My App`
description   | `string`        | value of `<meta name="description">`. | `My app description`
keywords      | `array`         | value of `<meta name="keywords">`. Must be array of strings. Keywords specified for state are added to default ones. | `['keyword', 'another']`
ogLocale      | `string`        | value of `<meta property="og:locale">`. Must be in `language_TERRITORY` format. | `en_US`
ogUrl         | `string`        | value of `<meta property="og:url">`. If not specified current absolute url will be used. | `http://example.com`
ogType        | `string`        | value of `<meta property="og:type">`. See [Open Graph documentation for types](http://ogp.me/#types) for available options. | `website`
ogUpdatedTime | `string`/`Date` | value of `<meta property="og:updated_time">`. Must be date expression recognizable by [angular date filter](https://docs.angularjs.org/api/ng/filter/date). | `2016-09-12 15:54:29`
ogSiteName    | `string`        | value of `<meta property="og:site_name">`. | `My App`
ogTitle       | `string`        | value of `<meta property="og:title">`. If not specified value of `title` will be used. | `Welcome to My App`
ogDescription | `string`        | value of `<meta property="og:description">`. If not specified value of `description` will be used. | `My app description`
ogImage       | `string`        | value of `<meta property="og:image">`. Must be absolute URL to an image. | `http://example.com/image.jpg`
fbAppId       | `string`        | value of `<meta property="fb:app_id">`. | `111111111`

### Setting default values

You can set default values calling `setOptions` method on provider.

```js
angular.module('myApp').config(['owlMetatagsProvider', function (owlMetatagsProvider) {
  owlMetatagsProvider.setOptions({
    title: 'Welcome to My App',
    titleSuffix: ' | My App',
    description: 'My app description',
    keywords: ['super', 'cool', 'keywords', 'list'],
    ogSiteName: 'My App',
    ogType: 'website',
    ogUrl: 'http://example.com'
  })
}]);
```

## Configuring states

You can configure each of the options per state passing them to `owlMetatags` object:
```js
angular.module('myApp').config(['$stateProvider', function ($stateProvider) {
  $stateProvider
    .state('players', {
      abstract: true,
      url: '/players',
      template: '<ui-view/>'
    })
    .state('players.list', {
      url: '',
      templateUrl: 'players.html',
      controller: 'PlayersController',
      owlMetatags: {
        title: 'Players list'
      }
    })
    .state('players.show', {
      url: '/:slug',
      templateUrl: 'player.html',
      controller: 'PlayerController',
      owlMetatags: {
        title: '{{ player.firstName }} {{ player.lastName }}',
        description: '{{ player.shortDescription }}',
        keywords: ['{{ player.firstName }} {{ player.lastName }}', 'player'],
        ogType: 'profile',
        ogUpdatedTime: '{{ player.updatedAt }}'
      }
    });
}]);
```

## Bugs

Please report them on the [Github issue tracker](https://github.com/OwlKing/owl-metatags/issues) for this project.

If you have a bug to report, please include the following information:

* **Version information for owl-metatags, angular and ui-router.**
* Full stack trace and error message (if you have them).
* Any snippets of relevant model, view or controller code that shows how you are using owl-metatags.

For more info on how to report bugs, please see this [article](http://yourbugreportneedsmore.info/).

## License

The MIT License

Copyright (c) 2016 OwlKing

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
