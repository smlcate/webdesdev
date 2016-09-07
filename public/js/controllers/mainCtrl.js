app.controller("mainCtrl", ["$scope", '$q', '$http', '$location', function($scope, $q, $http, User, $route) {

  $scope.loc = ['#designView', null];
  $scope.memory = {
    objects: [],
    count: 0,
    projectId: localStorage.projectId,
    project: localStorage.project,
    projects: localStorage.projects
  };
  $scope.branch = [];
  $scope.projects = [];
  $scope.files = [
    {
      type: 'html',
      file_data: [
      '<html>',
      '<head>',
      '<link rel="stylesheet" href="main.css">',
      '</head>',
      '<body>',
      '</body>',
      '</html>'
      ]
    },
    {
      type: 'css',
      file_data: [
        'main {}'
      ]
    }
  ]

  $scope.styleData = [];

  $scope.github = {};

  $scope.user = {
    email: localStorage.email,
    id: localStorage.userId
  };


  function ancestry(e) {

    if (!$scope.branch.length) {
      return
    }

    obj = $scope.memory.objects[$scope.branch[0]]
    count = 0;

    for (var i = 1; i < $scope.branch.length; i++) {
      obj = obj.children[$scope.branch[i]]
      count++;
    }
    obj.children.push(e)

    console.log($scope.memory.objects)

    return data = {
      obj: obj,
      count: count
    };

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

    console.log($scope.memory.projectId)

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
        html:['<' + type + ' id="' + 'demoId' + $scope.memory.count + '"' + '>','</' + type + '>'],
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
        id: '',
        htmlId: 'demoId' + $scope.memory.count,
        class: '',
        src: '',
        height: 100,
        width: 100,
        backgroundColor: '#ffffff',
        backgroundOpacity: 1,
        color: '#aaaaaa',
        html:['<' + type + ' id="' + 'demoId' + $scope.memory.count + '"' + '>','</' + type + '>'],
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
      console.log($scope.memory.objects)
    } else {
      object.width = object.width/2
      object.height = object.height/2
      object.parents.push($scope.memory.objects[$scope.loc[1]].id);

      var data = ancestry(object);

      object.id = data.count;

      // return data.obj;
      // $scope.memory.objects[$scope.loc[1]].children.push(object);
    }
    return object;
  }

  function writeCss(key,value) {

    var style = {
      selector: $scope.loc[0],
      data: []
    };



    var data = {
      key: key,
      value: value,
      code: key + ': ' + value + ';'
    }

    for (var i = 0; i < $scope.styleData.length; i++) {
      if ($scope.styleData[i].selector === $scope.loc[0]) {
        style = $scope.styleData[i];
        for (var j = 0; j < style.data.length; j++) {
          if (style.data[j].key === data.key) {
            style.data[j] = data;
            $scope.styleData[i] = style;
            return;
          }
        }
        style.data.push(data)
        $scope.styleData[i] = (style);
        return;
      }
    }

    style.data.push(data);
    $scope.styleData.push(style);

    console.log($scope.styleData);

  }

  var selections = {
    border: 'all',
    borderRadius: 'all'
  }

  function editSomething(what, type) {

    if (what == 'text') {
      console.log($('#valueInput').val())
      $($scope.loc[0]).text($('#valueInput').val());
    }

    var value = $("#" + what + "Input").val();

    writeCss(what, value);

    // console.log($scope.loc[0])

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

          // console.log("border-" + selections.borderRadius + "-radius: " + value )

          $($scope.loc[0]).css("border-" + selections.borderRadius + "-radius", value + "px");

        } else {

            // console.log("border-radius: " + value)
            $($scope.loc[0]).css('border-radius', value + "px");
        }
      }

      // console.log(value)

      if (selections.border != 'all' && selections.borderRadius != 'all') {

        $($scope.loc[0]).css('border-' + selections.border + '-' + what, value );

      } else {

          $($scope.loc[0]).css('border-' + what, value );
      }

    }


  }

  $scope.getProjects = function($params) {

    console.log($scope.memory.projects);

    $http.get('/getProjects/:' + localStorage.userId)
    .then(function(res) {
      // console.log(res.data);

      localStorage.projects = res.data;

      console.log($scope.memory.projects)

    })

  }

  $scope.save = function($params) {

    var data = $scope.memory;

    console.log(data);

    $http.post('/saveProject', data)
    .then(function(res) {
      console.log(res);
    })

  }

  //Temporary placement/method for returning pivotal data

  $scope.$watch('memory.objects', function(){
    // console.log('change');
  })
  $scope.$watch('memory.projectId', function(){
    // console.log('change');
  })

  $scope.$watch('projects', function() {
    console.log($scope.projects)
  })


  app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('jwtInterceptor');
  })
  .service('jwtInterceptor', function jwtInterceptor(){
    //TODO: Attach the token to every request.
    return {
      request: function(config) {
        if (localStorage.jwt) {
          config.headers.Authorization = 'Bearer ' + localStorage.jwt;
          // console.log('hello')
        }
        return config;
      }
    }
  })

// var tempProjects = [];
//
// function getPivotal($params, what) {
//
//   var config = {headers:{
//     'X-trackerToken': $scope.frm.pivotalKey //This will be the users secret token
//     }
//   }
//   var projects = [];
//
//   $http.get("https://www.pivotaltracker.com/services/v5/me", config)
//   .then(function(data){
//
//     projects = data.data.projects;
//
    // $http.post('/' + what, {'email':$params.email, 'password':$params.password, 'pivotalAPI':$params.pivotalKey, 'projects':data})
    // .then(function(res) {
    //
    //   console.log()
    //
    //   localStorage.jwt = res.data.token;
    //   localStorage.email = res.data.email;
    //   localStorage.pivotalAPI = res.data.pivotalAPI;
    //   $scope.session = false;
    //
    //   return projects;
    //
    // })
//
//     return projects;
//
//   })
//
//   return projects;
//
// }

  $scope.newProject = function(frm) {

    // var config = {headers:{
    //   'Accept': application/vnd.github.v3+json
    //   }
    // }

    // $http.get('https://login/oauth/authorize/63f94c97b5cefc3def23')
    // .then(function(res) {
    //   console.log(res.data);
    // })


    // $http.get('https://api.github.com/repos/smlcate/webdesdev')
    // .then(function(res) {
    //   console.log(res.data);
    // })
    //
    // $http.get('https://api.github.com/repos/smlcate/wddTestRepo/README')
    // .then(function(res) {
    //   console.log(res.data);
    // })

    var data = {
      frm: $scope.frm,
      user: $scope.user
    }

    $http.post('/newProject', data)
    .then(function(res) {
      $scope.projects.push(res.data.data);

      return $http.post('/makeFiles', res.data.data)
      .then(function(res) {
        // console.log(res.data)
      })

    })

  }


  $scope.selectProject = function(project) {

    function set$scope(data) {

      console.log(data.project)

      localStorage.files = data.files;
      $scope.files = data.files;
      $scope.memory.objects = data;
      localStorage.projectId = data.files[0].projectId;
      localStorage.project = data.project;

      // console.log(data);

    }

    $http.post('/selectProject', project)
    .then(function(res) {


      set$scope(res.data);

      console.log($scope.memory.projectId)


    })
    .then(function() {

      console.log($scope.files)

    })

    // $location.path = '/#/design';
  }



  // $scope.$watch('frm.githubUsername',function(newGithubUsername) {
  //   if(newGithubUsername) console.log(newGithubUsername)
  // })

  // $http.get('/callback')
  // .then(function(res) {
  //
  //   $http.post('https://github.com/login/oauth/access_token', config)
  //   .then(function(res) {
  //     console.log(res.data);
  //   })
  //
  // })


  $scope.submit = function($params, type) {



    // var config = {headers:{
    //   'client_id': '63f94c97b5cefc3def23',
    //    'client_secret': 'c12db9485c65cfaf0265839952b605f1e7bcb870'
    //   }
    // }
    // GithubActivityService.events({
    //   user:'gigablox',
    //   params:{
    //     access_token:'n0t4r34l4cc3sst0k3n123',
    //     callback:'JSON_CALLBACK'
    //   }
    // }).get().$promise.then(function(events){
    //   $scope.activity = events.data;
    // });

    $scope.config = {
      limit: 4
    }

    $scope.github = {
      username: $params.githubUsername
    }


    if(type === 'signup') {

      $http.post('/' + type, {'email':$params.email, 'password':$params.password, 'pivotalAPI':$params.pivotalKey, 'githubUsername':$params.githubUsername})
      .then(function(res) {

        // console.log(res.data.id)

        localStorage.jwt = res.data.token;
        localStorage.email = res.data.email;
        localStorage.pivotalAPI = res.data.pivotalAPI;
        localStorage.userId = res.data.id;
        $scope.session = false;

        // return projects;

      })

    }

    if(type === 'login') getPivotal('login');

  }

  $scope.logout = function() {

    localStorage.jwt = '';
    localStorage.email = '';
    localStorage.pivotalAPI = '';

    // $scope.user.email = '';
    // $scope.user.pivotalAPI = '';

    $scope.session = true;

  }



  $scope.add = function(s) {

    var object = newObj(s);

    console.log(object);

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

    // ancestry(object);

  }

  $scope.select = function(obj) {

    console.log(obj);

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

    // console.log($scope.branch)

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

    // console.log(rgbaString);

    $($scope.loc[0]).css('box-shadow', shadow.y, shadow.x, shadow.blur, shadow.radius, rgbaString);

  }

}])
