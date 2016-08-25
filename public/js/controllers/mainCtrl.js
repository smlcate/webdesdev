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

    console.log($scope.memory.objects)

    return obj;

  }

  function hexToRgba(clr, opacity) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(clr);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: opacity
    } : null;

  }

  function newObj(type) {

    if ($scope.loc[0] === '#designView') {

      var object = {
        type: type,
        id: $scope.memory.objects.length,
        htmlId: 'demoId' + $scope.memory.count,
        class: '',
        src: '',
        height: 150,
        width: 150,
        backgroundColor: '#ffffff',
        backgroundOpacity: 1,
        color: '#aaaaaa',
        margins: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        },
        paddings: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        },
        borders: {
          left: {
            width: 0,
            style: 'solid',
            color: 'black'
          },
          right: {
            width: 0,
            style: 'solid',
            color: 'black'
          },
          top: {
            width: 0,
            style: 'solid',
            color: 'black'
          },
          bottom: {
            width: 0,
            style: 'solid',
            color: 'black'
          },
          radiis: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }
        },
        shadow: {
          x: 0,
          y: 0,
          blur: 0,
          spread: 0,
          color: 'black'
        },
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
        object.width = 'auto';
        object.height = 100;
      }

    } else {

      var object = {
        type: type,
        id: $scope.memory.objects[$scope.loc[1]].children.length,
        htmlId: 'demoId' + $scope.memory.count,
        class: '',
        src: '',
        height: 100,
        width: 100,
        backgroundColor: '#ffffff',
        backgroundOpacity: 1,
        color: '#aaaaaa',
        margins: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        },
        paddings: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        },
        borders: {
          left: {
            width: 0,
            style: 'solid',
            color: 'black'
          },
          right: {
            width: 0,
            style: 'solid',
            color: 'black'
          },
          top: {
            width: 0,
            style: 'solid',
            color: 'black'
          },
          bottom: {
            width: 0,
            style: 'solid',
            color: 'black'
          },
          radiis: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }
        },
        shadow: {
          x: 0,
          y: 0,
          blur: 0,
          spread: 0,
          color: 'black'
        },
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

  var selections = {
    border: 'all',
    borderRadius: 'all'
  }

  function editSomething(what, type) {

    var value = $("#" + what + "Input").val();

    if(!type) {

      $($scope.loc[0]).css(what, value + 'px');

    } else if(type === 'color'){

      value = $('#background-colorInput').val()
      var opacity = $("#opacityInput").val();

      var rgba = hexToRgba(value, opacity)

      var rgbaString = 'rgba(' + rgba.r + ', ' + rgba.g + ', ' + rgba.b + ', ' + rgba.a + ')'
      //
      $($scope.loc[0]).css('background-color', rgbaString);

    } else if(type === 'border') {

      value = $("#borderWidthInput").val();
      if (what === 'style') { value = $("#borderStyleInput").val(); }
      if (what === 'color') { value = $("#borderColorInput").val(); }
      if (what === 'radius') {
        value = $("#borderRadiusInput").val();


        if (selections.borderRadius != 'all') {

          console.log("border-" + selections.borderRadius + "-radius: " + value )

          $($scope.loc[0]).css("border-" + selections.borderRadius + "-radius", value + "px");

        } else {

            console.log("border-radius: " + value)
            $($scope.loc[0]).css('border-radius', value + "px");
        }
      }

      console.log(value)

      if (selections.border != 'all' && selections.borderRadius != 'all') {

        $($scope.loc[0]).css('border-' + selections.border + '-' + what, value );

      } else {

          $($scope.loc[0]).css('border-' + what, value );
      }

    }


  }

  $scope.submit = function() {
    $scope.user = {
      email: $scope.email
    }
    console.log($scope.user)
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
      $scope.branch = [];
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

    console.log($scope.branch)

    $('#heightInput').val(obj.height);
    $('#widthInput').val(obj.width);
    $('#margin-leftInput').val(obj.margins.left);
    $('#margin-rightInput').val(obj.margins.right);
    $('#margin-topInput').val(obj.margins.top);
    $('#margin-bottomInput').val(obj.margins.bottom);
    $('#padding-leftInput').val(obj.paddings.left);
    $('#padding-rightInput').val(obj.paddings.right);
    $('#padding-topInput').val(obj.paddings.top);
    $('#padding-bottomInput').val(obj.paddings.bottom);
    $('#background-colorInput').val(obj.backgroundColor);
    $('#opacityInput').val(obj.backgroundOpacity);
    $('#widthInput').val(obj.width);
    $('#widthInput').val(obj.width);



  }

  $scope.edit = function(what, how) {
    editSomething(what, how);
  }

  $scope.selectBorder = function(b) {
    if (b === 'radius') {

      selections.borderRadius = $("#borderRadiusSelectInput").val();

    } else {

      selections.border = b;

    }
  }

  $scope.editShadow = function(what) {

    var shadow = {
      y: $('#shadowYInput').val() + 'px',
      x: $('#shadowXInput').val() + 'px',
      blur: $('#shadowBlurInput').val() + 'px',
      radius: $('#shadowRadiusInput').val() + 'px',
      color: hexToRgba($('#shadowColorInput').val(),$('#shadowOpacityInput').val())
    }

    var rgbaString = 'rgba(' + shadow.color.r + ',' + shadow.color.g + ',' + shadow.color.b + ',' + shadow.color.a + ')'

    console.log(rgbaString);

    $($scope.loc[0]).css('box-shadow', shadow.y, shadow.x, shadow.blur, shadow.radius, rgbaString);

  }

}])
