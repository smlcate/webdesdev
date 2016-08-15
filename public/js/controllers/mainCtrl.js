app.controller("mainCtrl", ["$scope", '$q', '$http', function($scope, $q, $http) {

  $scope.loc = ['#designView', null];
  $scope.memory = {
    objects: []
  };
  $scope.projects = [];

  function newObj(type) {
    var object = {
      type: type,
      id: $scope.memory.objects.length,
      htmlId: '#demoId' + $scope.memory.objects.length,
      class: '',
      height: 150,
      width: 150,
      parents: [],
      children: []
    }

    if (type === 'header') {
      object.width = 600;
      object.height = 100;
    }
    if (type === 'text') {
      object.width = 100;
      object.height = 20;
    }
    if (type === 'image') {
      object.width = 'auto';
      object.height = 100;
    }


    if ($scope.loc[0] === '#designView') {
      $scope.memory.objects.push(object);
    } else {
      object.width = object.width/2
      object.height = object.height/2
      object.parents.push($scope.memory.objects[$scope.loc[1]].id);
      object.id = $scope.memory.objects[$scope.loc[1]].children.length;
      $scope.memory.objects[$scope.loc[1]].children.push(object);
    }
    return object;
  }

  $scope.pivotal = function(){

    var config = {headers:{
      'X-trackerToken': '29650c021950fdcccf14db0415bb1251'
      }
    }

    $http.get("https://www.pivotaltracker.com/services/v5/me", config)
    .then(function(data){
      for (var i = 0; i < data.data.projects.length; i++) {
        $scope.projects.push(data.data.projects[i].project_name)
      }
      console.log($scope.projects)
    })
    .catch(function(err){
      console.log(JSON.stringify(err.data))
    })

  }

  $scope.add = function(s) {

    var object = newObj(s);

    var items = {
      header: "<header class='demoHeaders' id='" + object.htmlId + "'></header>",
      div: "<div class='demoDivs' id='" + object.htmlId + "'></div>",
      text: "<p class='demoTexts' id='" + object.htmlId + "'>New Text</p>",
      image: "<img class='demoImages' id='" + object.htmlId + "' src='https://upload.wikimedia.org/wikipedia/commons/c/cd/Panda_Cub_from_Wolong,_Sichuan,_China.JPG'></img>"
    }

    if(s == 'header') {var addWhat = items.header}
    if(s == 'div') {var addWhat = items.div}
    if(s == 'text') {var addWhat = items.text}
    if(s == 'image') {var addWhat = items.image}

    $($scope.loc[0]).append(addWhat);

  }

  $scope.select = function(obj) {
    $scope.loc[0] = obj.htmlId;
    $scope.loc[1] = obj.id;
    $('#heightInput').val(obj.height);
  }

}])
