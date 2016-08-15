app.controller("mainCtrl", ["$scope", '$q', '$http', function($scope, $q, $http) {

  $scope.loc = ['#designView', null];
  $scope.memory = {
    objects: [],
    count: 0
  };
  $scope.branch = [];
  $scope.projects = [];

  function ancestry(e) {

    if (!$scope.branch.length) {
      return
    }

    obj = $scope.memory.objects[$scope.branch[0]]

    for (var i = 1; i < $scope.branch.length; i++) {
      obj = obj.children[$scope.branch[i]]
    }
    obj.children.push(e)

    return obj;

  }

  function newObj(type) {

    if ($scope.loc[0] === '#designView') {

      var object = {
        type: type,
        id: $scope.memory.objects.length,
        htmlId: 'demoId' + $scope.memory.count,
        class: '',
        height: 150,
        width: 150,
        parents: [],
        children: [],
        level: 1
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

    } else {

      var object = {
        type: type,
        id: $scope.memory.objects[$scope.loc[1]].children.length,
        htmlId: 'demoId' + $scope.memory.count,
        class: '',
        height: 100,
        width: 100,
        parents: [],
        children: [],
        level: $scope.branch.length + 1
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
        object.width = 150;
        object.height = 100;
      }

    }

    $scope.memory.count ++;

    if ($scope.loc[0] === '#designView') {
      $scope.memory.objects.push(object);
    } else {
      object.width = object.width/2
      object.height = object.height/2
      object.parents.push($scope.memory.objects[$scope.loc[1]].id);
      // $scope.memory.objects[$scope.loc[1]].children.push(object);
    }
    return object;
  }

  //Temporary placement/method for returning pivotal data
  $scope.pivotal = function(){

    var config = {headers:{
      'X-trackerToken': '29650c021950fdcccf14db0415bb1251' //This will be the users secret token
      }
    }

    $http.get("https://www.pivotaltracker.com/services/v5/me", config)
    .then(function(data){
      for (var i = 0; i < data.data.projects.length; i++) {
        $scope.projects.push(data.data.projects[i].project_name)
      }
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

    if (s == 'header') {

      $($scope.loc[0]).prepend(addWhat);

    } else {

      $($scope.loc[0]).append(addWhat);

    }

    ancestry(object);

  }

  $scope.select = function(obj) {

    if (obj === 'root') {
      $scope.loc[0] = '#designView';
      $('.numberInputs').val(0);
      $('#colorInpit').val('#ffffff');
      return;
    }

    if (!obj.parents.length) {
      $scope.branch = [];
      $scope.branch.push(obj.id);
    } else if("#" + obj.htmlId != $scope.loc[0] && obj.level != $scope.branch.length){
      $scope.branch.push(obj.id);
    } else if ("#" + obj.htmlId != $scope.loc[0] && obj.level === $scope.branch.length) {
      $scope.branch[$scope.branch.length - 1] = obj.id;
    }

    $scope.loc[0] = "#" + obj.htmlId;
    $scope.loc[1] = obj.id;

    $('#heightInput').val(obj.height);
    $('#widthInput').val(obj.width);

  }

}])
