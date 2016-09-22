owlMetatagsModule = angular.module('owlMetatags', ['ui.router'])

owlMetatagsModule.provider 'owlMetatags',  ->
  $defaults = {}
  $values = {}

  @setOption = (option, value) ->
    $defaults[option] = value

  @setOptions = (options) ->
    $defaults = angular.copy(options)

  @$get = ['$rootScope', '$interpolate', '$location', '$filter', ($rootScope, $interpolate, $location, $filter) ->
    $interpolateScope = $rootScope

    compareScopes = (scopeA, scopeB) ->
      return scopeA.$id > scopeB.$id if angular.equals(scopeA.$id.length, scopeB.$id.length)
      return scopeA.$id.length > scopeB.$id.length

    updateValues = (event, toState) ->
      $values = angular.copy($defaults)
      if toState.owlMetatags
        angular.extend($values, toState.owlMetatags)
        if toState.owlMetatags.keywords?
          $values.keywords = if $defaults.keywords? then angular.copy($defaults.keywords) else []
          $values.keywords = toState.owlMetatags.keywords.concat($defaults.keywords)

    updateInterpolateScope = (event) ->
      $interpolateScope = event.targetScope if compareScopes(event.targetScope, $interpolateScope)

    {
      getTitle: ->
        return $interpolate($values.title + $values.titleSuffix)($interpolateScope) if $values.titleSuffix? && $values.title?
        return $interpolate($values.title)($interpolateScope) if $values.title?
        return null

      getDescription: ->
        return $interpolate($values.description)($interpolateScope) if $values.description?
        return null

      getKeywords: ->
        return $interpolate($values.keywords.join(', '))($interpolateScope) if $values.keywords?
        return null

      getOgUrl: ->
        return $interpolate($values.ogUrl)($interpolateScope) if $values.ogUrl?
        return $location.absUrl()

      getOgType: ->
        return $interpolate($values.ogType)($interpolateScope) if $values.ogType?
        return null

      getOgTitle: ->
        return $interpolate($values.ogTitle)($interpolateScope) if $values.ogTitle?
        return @getTitle()

      getOgDescription: ->
        return $interpolate($values.ogDescription)($interpolateScope) if $values.ogDescription?
        return @getDescription()

      getOgImage: ->
        return $interpolate($values.ogImage)($interpolateScope) if $values.ogImage?
        return null

      getOgSiteName: ->
        return $interpolate($values.ogSiteName)($interpolateScope) if $values.ogSiteName?
        return null

      getOgUpdatedTime: ->
        return null unless $values.ogUpdatedTime?
        dateString = $interpolate($values.ogUpdatedTime)($interpolateScope)
        $filter('date')(dateString, 'yyyy-MM-ddTHH:mm:ssZ', 'UTC')

      getOgLocale: ->
        return $interpolate($values.ogLocale)($interpolateScope) if $values.ogLocale?
        return null

      getFbAppId: ->
        return $interpolate($values.fbAppId)($interpolateScope) if $values.fbAppId?
        return null

      initialize: ->
        $values = angular.copy($defaults)
        $rootScope.$on '$stateChangeSuccess', updateValues
        $rootScope.$on '$viewContentLoaded', updateInterpolateScope
        return
    }
  ]
  return

owlMetatagsModule.directive 'owlMetatags', ['owlMetatags', (owlMetatags) ->
  tpl = ''
  tpl += '<title>{{ metatags.getTitle() }}</title>'
  tpl += '<meta content="{{ metatags.getDescription() }}" name="description" ng-if="metatags.getDescription()">'
  tpl += '<meta content="{{ metatags.getKeywords() }}" name="keywords" ng-if="metatags.getKeywords()">'
  tpl += '<meta content="{{ metatags.getFbAppId() }}" ng-if="metatags.getFbAppId()" property="fb:app_id">'
  tpl += '<meta content="{{ metatags.getOgUrl() }}" ng-if="metatags.getOgUrl()" property="og:url">'
  tpl += '<meta content="{{ metatags.getOgTitle() }}" ng-if="metatags.getOgTitle()" property="og:title">'
  tpl += '<meta content="{{ metatags.getOgImage() }}" ng-if="metatags.getOgImage()" property="og:image">'
  tpl += '<meta content="{{ metatags.getOgDescription() }}" ng-if="metatags.getOgDescription()" property="og:description">'
  tpl += '<meta content="{{ metatags.getOgSiteName() }}" ng-if="metatags.getOgSiteName()" property="og:site_name">'
  tpl += '<meta content="{{ metatags.getOgType() }}" ng-if="metatags.getOgType()" property="og:type">'
  tpl += '<meta content="{{ metatags.getOgUpdatedTime() }}" ng-if="metatags.getOgUpdatedTime()" property="og:updated_time">'
  tpl += '<meta content="{{ metatags.getOgLocale() }}" ng-if="metatags.getOgLocale()" property="og:locale">'


  {
    restrict: 'E',
    scope: {},
    template: tpl,
    link: (scope) ->
      scope.metatags = owlMetatags

      return
  }
]

owlMetatagsModule.run ['owlMetatags', (owlMetatags) ->
  owlMetatags.initialize()
]
