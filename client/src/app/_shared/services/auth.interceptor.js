;(function() {

  'use strict';

  /**
   * Auth interceptor
   *
   * @desc intercept every request, response, error etc.
   */

  angular
    .module('boilerplate')
    .factory('authInterceptor', authInterceptor);

  authInterceptor.$inject = ['$q', '$injector'];

  function authInterceptor($q, $injector) {

    var interceptor = {
      request: request,
      response: response,
      responseError: responseError
    };

    return interceptor;

    /// definitions

    /**
     * intercept every request call
     */
    function request(config) {

      config.headers = config.headers || {};

      var storage = $injector.get('localStorage');
      // console.log(localStorage)
      var user = storage.get('user');
      // console.log(user)
      if (user)
        config.headers['Authorization'] = user.token;
        // else config.headers['Authorization'] = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjdiODAyNDE4LWQxN2EtNGQ3Ni1iZGQyLTNhMzUzMWJhZTdjYiIsImlhdCI6MTU2MzUzMTM2Nywic3ViIjoiZGV2ZWxvcGVyLzJjOTg4MjcxLTMwYzktZmQ1ZS03YWQyLTQ1Yzg3YTYxZWIwNiIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIyMTMuNTcuMjQ2LjQ0Il0sInR5cGUiOiJjbGllbnQifV19.eBzA0OArr0ag9xGuDZVkhId5X7m44gIPI67gL5xDRjF4O86lWwn2IPWpLqH54nAvIxeKq4hvC6u29TFyeKpi-A';
      return config;
    }

    /**
     * intercept every response
     */
    function response(config) {
      config.headers = config.headers || {};
      return config;
    }


    /**
     * handle API response status errors
     */
    function responseError(error) {
      console.log(error)
      var log = $injector.get('$log');
      log.error('error', error);

      if (error.status == 401) {
        var rootScope = $injector.get('$rootScope');
        rootScope.$broadcast('user:logout');
      }

      return $q.reject(error);
    }

  }
})();
