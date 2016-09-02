app.controller('projectsCtrl', ["$scope", '$q', '$http', function($scope, $q, $http, User) {

  $scope.user = User.getUser();

  $scope.init = function(User) {

    console.log(User);

  }

}])
