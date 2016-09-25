var owlMetatagsModule;

owlMetatagsModule = angular.module('owlMetatags', ['ui.router']);

owlMetatagsModule.provider('owlMetatags', function() {
  var $defaults, $values;
  $defaults = {};
  $values = {};
  this.setOption = function(option, value) {
    return $defaults[option] = value;
  };
  this.setOptions = function(options) {
    return $defaults = angular.copy(options);
  };
  this.$get = [
    '$rootScope', '$interpolate', '$location', '$filter', function($rootScope, $interpolate, $location, $filter) {
      var $interpolateScope, compareScopes, updateInterpolateScope, updateValues;
      $interpolateScope = $rootScope;
      compareScopes = function(scopeA, scopeB) {
        if (angular.equals(scopeA.$id.length, scopeB.$id.length)) {
          return scopeA.$id > scopeB.$id;
        }
        return scopeA.$id.length > scopeB.$id.length;
      };
      updateValues = function(event, toState) {
        $values = angular.copy($defaults);
        if (toState.owlMetatags) {
          angular.extend($values, toState.owlMetatags);
          if (toState.owlMetatags.keywords != null) {
            $values.keywords = $defaults.keywords != null ? angular.copy($defaults.keywords) : [];
            return $values.keywords = toState.owlMetatags.keywords.concat($defaults.keywords);
          }
        }
      };
      updateInterpolateScope = function(event) {
        if (compareScopes(event.targetScope, $interpolateScope)) {
          return $interpolateScope = event.targetScope;
        }
      };
      return {
        getTitle: function() {
          if (($values.titleSuffix != null) && ($values.title != null)) {
            return $interpolate($values.title + $values.titleSuffix)($interpolateScope);
          }
          if ($values.title != null) {
            return $interpolate($values.title)($interpolateScope);
          }
          return null;
        },
        getDescription: function() {
          if ($values.description != null) {
            return $interpolate($values.description)($interpolateScope);
          }
          return null;
        },
        getKeywords: function() {
          if ($values.keywords != null) {
            return $interpolate($values.keywords.join(', '))($interpolateScope);
          }
          return null;
        },
        getOgUrl: function() {
          if ($values.ogUrl != null) {
            return $interpolate($values.ogUrl)($interpolateScope);
          }
          return $location.absUrl();
        },
        getOgType: function() {
          if ($values.ogType != null) {
            return $interpolate($values.ogType)($interpolateScope);
          }
          return null;
        },
        getOgTitle: function() {
          if ($values.ogTitle != null) {
            return $interpolate($values.ogTitle)($interpolateScope);
          }
          return this.getTitle();
        },
        getOgDescription: function() {
          if ($values.ogDescription != null) {
            return $interpolate($values.ogDescription)($interpolateScope);
          }
          return this.getDescription();
        },
        getOgImage: function() {
          if ($values.ogImage != null) {
            return $interpolate($values.ogImage)($interpolateScope);
          }
          return null;
        },
        getOgSiteName: function() {
          if ($values.ogSiteName != null) {
            return $interpolate($values.ogSiteName)($interpolateScope);
          }
          return null;
        },
        getOgUpdatedTime: function() {
          var dateString;
          if ($values.ogUpdatedTime == null) {
            return null;
          }
          dateString = $interpolate($values.ogUpdatedTime)($interpolateScope);
          return $filter('date')(dateString, 'yyyy-MM-ddTHH:mm:ssZ', 'UTC');
        },
        getOgLocale: function() {
          if ($values.ogLocale != null) {
            return $interpolate($values.ogLocale)($interpolateScope);
          }
          return null;
        },
        getFbAppId: function() {
          if ($values.fbAppId != null) {
            return $interpolate($values.fbAppId)($interpolateScope);
          }
          return null;
        },
        initialize: function() {
          $values = angular.copy($defaults);
          $rootScope.$on('$stateChangeSuccess', updateValues);
          $rootScope.$on('$viewContentLoaded', updateInterpolateScope);
        }
      };
    }
  ];
});

owlMetatagsModule.directive('owlMetatags', [
  'owlMetatags', function(owlMetatags) {
    var tpl;
    tpl = '';
    tpl += '<title>{{ metatags.getTitle() }}</title>';
    tpl += '<meta content="{{ metatags.getDescription() }}" name="description" ng-if="metatags.getDescription()">';
    tpl += '<meta content="{{ metatags.getKeywords() }}" name="keywords" ng-if="metatags.getKeywords()">';
    tpl += '<meta content="{{ metatags.getFbAppId() }}" ng-if="metatags.getFbAppId()" property="fb:app_id">';
    tpl += '<meta content="{{ metatags.getOgUrl() }}" ng-if="metatags.getOgUrl()" property="og:url">';
    tpl += '<meta content="{{ metatags.getOgTitle() }}" ng-if="metatags.getOgTitle()" property="og:title">';
    tpl += '<meta content="{{ metatags.getOgImage() }}" ng-if="metatags.getOgImage()" property="og:image">';
    tpl += '<meta content="{{ metatags.getOgDescription() }}" ng-if="metatags.getOgDescription()" property="og:description">';
    tpl += '<meta content="{{ metatags.getOgSiteName() }}" ng-if="metatags.getOgSiteName()" property="og:site_name">';
    tpl += '<meta content="{{ metatags.getOgType() }}" ng-if="metatags.getOgType()" property="og:type">';
    tpl += '<meta content="{{ metatags.getOgUpdatedTime() }}" ng-if="metatags.getOgUpdatedTime()" property="og:updated_time">';
    tpl += '<meta content="{{ metatags.getOgLocale() }}" ng-if="metatags.getOgLocale()" property="og:locale">';
    return {
      restrict: 'E',
      scope: {},
      template: tpl,
      link: function(scope) {
        scope.metatags = owlMetatags;
      }
    };
  }
]);

owlMetatagsModule.run([
  'owlMetatags', function(owlMetatags) {
    return owlMetatags.initialize();
  }
]);
