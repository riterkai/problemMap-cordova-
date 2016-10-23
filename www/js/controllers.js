angular.module('starter.controllers', ['ionic.closePopup'])

.controller('MapCtrl', function($rootScope,$scope,$http,$timeout,$ionicPopup,IonicClosePopupService,$ionicPlatform,$compile) {

  $scope.calldata; //server data(raw)
  $scope.filterdata = []; //data after the condition filter
  $scope.mylocation;
  $scope.mymarker;
  $scope.allmarkers;
  $scope.allcircles;
  $scope.posstate ; //switch between visualization and marker 
  $scope.posstatatext ;
  $scope.markerCluster;
  $scope.conditionstat = 0;// saving the condition stat

  

  var mapOptions = {
        center: {
            lat: -34.397,
            lng: 150.644
        },
        zoom: 17,
        disableDefaultUI: true
    };

$rootScope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);



$scope.addYourLocationButton = function(map, marker) {

    var controlDiv = document.createElement('div');

    var firstChild = document.createElement('button');
    firstChild.style.backgroundColor = '#fff';
    firstChild.style.border = 'none';
    firstChild.style.outline = 'none';
    firstChild.style.width = '40px';
    firstChild.style.height = '40px';
    firstChild.style.borderRadius = '50px';
    firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
    firstChild.style.cursor = 'pointer';
    firstChild.style.marginRight = '10px';
    firstChild.style.marginBottom = '200px';
    firstChild.style.padding = '0px';
    firstChild.title = 'Your Location';
    controlDiv.appendChild(firstChild);

    var secondChild = document.createElement('div');
    secondChild.style.margin = '5px';
    secondChild.style.marginLeft = '11px';
    secondChild.style.width = '18px';
    secondChild.style.height = '18px';
    secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png)';
    secondChild.style.backgroundSize = '180px 18px';
    secondChild.style.backgroundPosition = '0px 0px';
    secondChild.style.backgroundRepeat = 'no-repeat';
    secondChild.id = 'you_location_img';
    firstChild.appendChild(secondChild);

    google.maps.event.addListener(map, 'dragend', function() {
        $('#you_location_img').css('background-position', '0px 0px');
    });

    firstChild.addEventListener('click', function() {
         
       
        if(navigator.geolocation) {

                marker.setPosition(mylocation);
                map.setCenter(mylocation);
                $('#you_location_img').css('background-position', '-144px 0px');
        }
        else{
            clearInterval(animationInterval);
            $('#you_location_img').css('background-position', '0px 0px');
        }
    });

    controlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
     
      
 };

 $scope.caculateDis = function(lat1,lon1,lat2,lon2){

       var R = 6371; // Radius of the earth in km
       var dLat = $scope.deg2rad(lat2-lat1);  // deg2rad below
       var dLon = $scope.deg2rad(lon2-lon1); 
       var a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos($scope.deg2rad(lat1)) * Math.cos($scope.deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2)
       ; 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c; // Distance in km
      
    return d;
  }

  

 $scope.classFilter = function(classid) {

      var a = [];
     a[0] = [];
     
     for(var i = 0; i < calldata[0].length ; i++){

 
      var actclass = calldata[0][i].actclass;

      if(actclass == classid){
         a[0].push(calldata[0][i]);
         
      }

     }
     
     filterdata = a ;

  };

 

 $scope.delMarker = function() {
   
      markerCluster.clearMarkers();
      for(var i=0;i<allmarkers.length;i++){
        allmarkers[i].setMap(null);
      }
      allmarkers = [];
      
  }; 
  $scope.delCircle = function() {
     
      for(var i=0;i<allcircles.length;i++){
        allcircles[i].setMap(null);
      }
      allcircles = [];
      
  }; 

  $scope.deg2rad = function(deg) {
       return deg * (Math.PI/180)
  };

  $scope.disFilter = function(){
     var a = [];
     a[0] = [];
     
     for(var i = 0; i < calldata[0].length ; i++){

      var mylat = mylocation.lat();
      var mylon = mylocation.lng();
      var datalat = calldata[0][i].actlat;
      var datalon = calldata[0][i].actlon;
      var distance = 5 ;//5km

      

      if($scope.caculateDis(datalat,datalon,mylat,mylon) < distance){
         a[0].push(calldata[0][i]);
      
      }

     }
     
     filterdata = a ;


 };





$scope.findClass = function(classid) {
      
       if(classid == 1){
          $scope.conditionstat = 3;
       }else if (classid == 2){
          $scope.conditionstat = 4;
       }else{
          $scope.conditionstat = 5;
       }


      if($scope.posstate == 1){
        $scope.delMarker();
        $scope.classFilter(classid);
        $scope.setMarker(filterdata);
       }else if($scope.posstate == 2){

        $scope.delCircle();
        $scope.classFilter(classid);
        $scope.setCircle(filterdata);

       }
     
      
 };


$scope.findPopular = function(){
       $scope.conditionstat = 2;
       if($scope.posstate == 1){
        $scope.delMarker();
        $scope.popFilter();
        $scope.setMarker(filterdata);
       }else if($scope.posstate == 2){

        $scope.delCircle();
        $scope.popFilter();
        $scope.setCircle(filterdata);

       }

  
 }



$scope.findNearby = function(){
       $scope.conditionstat = 1;
       if($scope.posstate == 1){
        $scope.delMarker();
        $scope.disFilter();
        $scope.setMarker(filterdata);
       }else if($scope.posstate == 2){

        $scope.delCircle();
        $scope.disFilter();
        $scope.setCircle(filterdata);

       }
       $rootScope.map.setZoom(15); 
       $rootScope.map.setCenter(mylocation);
      
  
 }


 $scope.findAll = function(){
       $scope.conditionstat = 0;
       if($scope.posstate == 1){
        $scope.delMarker();
        filterdata = calldata;
        $scope.setMarker(filterdata);
       }else if($scope.posstate == 2){

        $scope.delCircle();
        filterdata = calldata;
        $scope.setCircle(filterdata);

       }

  
      
  
 }

  
  $scope.getData = function() {
       return $http.jsonp("http://linedb.mybluemix.net/getData.php?callback=JSON_CALLBACK")
       .success(function (data, status, headers,config) {
           calldata = data;

    

           if($scope.conditionstat == 0){
              $scope.findAll();
           }else if($scope.conditionstat == 1){
              $scope.findNearby();
           }else if($scope.conditionstat == 2){
              $scope.findPopular();
           }else if($scope.conditionstat == 3){
              $scope.findClass(1);
           }else if($scope.conditionstat == 4){
              $scope.findClass(2);
           }else {
              $scope.findClass(3);
           }
           
              
         })
       .error(function (data, status, headers, config) {
           
        });
  }; 



  $scope.initailData = function() {
       return $http.jsonp("http://linedb.mybluemix.net/getData.php?callback=JSON_CALLBACK")
       .success(function (data, status, headers,config) {
           calldata = data;
           filterdata =calldata;
          
           $scope.startMap();
         })
       .error(function (data, status, headers, config) {
           
        });
  }; 


  

 
  

  $scope.setMarker = function(setdata) {

    var tempmap = $rootScope.map;
    var data = [];
    var markers = [];
    var infoWindow = new google.maps.InfoWindow();
              for (i = 0; i < setdata[0].length ; i++) {
                var id = setdata[0][i].ID;
                var name = setdata[0][i].actsubclassname;
                var lat =  setdata[0][i].actlat;
                var lon =  setdata[0][i].actlon;
                if(name != "水質混濁"){
                  var address = setdata[0][i].actaddress.substr(5);
                }else{
                  var address = setdata[0][i].actaddress;
                }

                
                var aclass = setdata[0][i].actclass;
                var asubclass = setdata[0][i].actsubclass;
                var actime = setdata[0][i].createtime;
                var actcontent = setdata[0][i].actcontent;
                var actbrief = actcontent.slice(0,10);
                var img = setdata[0][i].actImg;
                var color="";
               
                if(img == "無圖片"){
                    
                    
                      switch (aclass+''+asubclass) {
                       case '11':
                       img = "img/car.jpg";
                       break;

                       case '12':
                       img = "img/air.jpg";
                       break; 
                  
                       case '13':
                       img = "img/fire.jpg";
                       break; 

                       case '21':
                       img = "img/stone.jpg";
                       break;

                       case '22':
                       img = "img/flood.jpg";
                       break;

                       case '23':
                       img = "img/typhoon.jpg";
                       break;

                       case '31':
                       img = "img/water.jpg";
                       break;

                       case '32':
                       img = "img/gabage.jpg";
                       break;

                       case '33':
                       img = "img/airpollution.jpg";
                       break;
                       
                       
                     }
                }
             
                switch (aclass) {
                  case 1:
                  color = "../img/blue-dot.png";
                  break;

                  case 2:
                  color = "../img/red-dot.png";
                  break; 
                  
                  case 3:
                  color = "../img/yellow-dot.png";
                  break; 

                  default: 
                  color = "red";
                }
                
                

                var detail = {'actid':id,'title':name,'address':address,'time':actime,'actcontent':actcontent,'actbrief':actbrief,'img':img} ;
                
     
                  var marker = new google.maps.Marker({
                    position:new google.maps.LatLng(lat,lon),
                    map: tempmap,
                    icon: color,
                    detail: detail,
                    animation: google.maps.Animation.DROP
                    

                  });

                  

                  
                  markers.push(marker);


                  (function (marker, detail) {
                    
                   function toggleBounce() {
                    if (marker.getAnimation() !== null) {
                     marker.setAnimation(null);
                    } else {
                     marker.setAnimation(google.maps.Animation.BOUNCE);
                     setTimeout(function(){ marker.setAnimation(null); }, 750);
                    }
                  }

                    marker.addListener('click', toggleBounce);

                    

                    var contentString = '<div ng-click = "showPopup('+id+','+'\''+name+'\''+','+'\''+address+'\''+','+'\''+actime+'\''+','+'\''+actcontent+'\''+','+'\''+img+'\''+',1)" style = "width:250px;">'
                                        +'<p style = "margin:0px;">'
                                        +'<b>'
                                        + detail.title
                                        +':'
                                        + detail.actbrief
                                        +'</b>' 
                                        +'</p>'
                                        +'<p style = "margin:0px;">'
                                        +'Address:'+detail.address
                                        +'</p>'
                                        + '</div>';


                    google.maps.event.addListener(marker, "click", function (e) {
                    
                   
                    
                    var compiled = $compile(contentString)($scope);
                    
                    infoWindow.setContent(compiled[0]);
                    infoWindow.open($rootScope.map, marker);

                     

                     });
                 })(marker, detail);
             
              }

        var options = {
            imagePath: 'img/m'
        };

         var mcluster = new MarkerClusterer($rootScope.map, markers, options);
         markerCluster = mcluster;
         allmarkers = markers;  
         

   };
   
 

  

  $scope.setCircle = function(setdata) {
       var data =[];
       var infoWindow  = new google.maps.InfoWindow();
       for (i = 0; i < setdata[0].length ; i++) {
         
          var lat =  setdata[0][i].actlat;
          var lon =  setdata[0][i].actlon;
               
          var aclass = setdata[0][i].actclass;
          var color="";
          var actcount =setdata[0][i].actclickcount;
          var radiusparm = 1;

          if(actcount >= 0 && actcount <=10){
            radiusparm = 1;
          }else if(actcount >10 && actcount <=20){
            radiusparm = 1.5;
          }else if(actcount >20 && actcount <=30){
            radiusparm = 2;
          }else if(actcount >30 && actcount <=40){
            radiusparm = 2.5;
          }else if(actcount >40){
            radiusparm = 3;
          }

   
          switch (aclass) {
                  case 1:
                  color = "#6FB7B7";
                  break;

                  case 2:
                  color = "#FF0000";
                  break; 
                  
                  case 3:
                  color = "#FFFF6F";
                  break; 

                  default: 
                  color = "#880000";
           }

       
          var circlecenter = new google.maps.LatLng(lat,lon);

          var circle = new google.maps.Circle({
              strokeColor: color,
              strokeOpacity: 0,
              strokeWeight: 2,
              fillColor: color,
              fillOpacity: 0.5,
              map: $rootScope.map,
              center: circlecenter,
              radius: radiusparm*600
      
           });

            data.push(circle);

            google.maps.event.addListener(circle, 'click', function(ev){
                    
             });
            
      }

      allcircles = data;
 
   };

$scope.startLine = function() {
    
    
    startApp.set({ /* params */
      "action": "ACTION_VIEW",
      "uri": "http://line.me/ti/p/%40scl0159q"
    }).start();

};



$scope.showPopup = function(id,name,address,actime,actcontent,img,mode) {
 var actprocess =Math.floor((Math.random() * 100));
 var transdata = {'actid':id,'title':name,'address':address,'time':actime,'actcontent':actcontent,'img':img,'actprocess':actprocess} ;

 
 if (mode == 1) {
  
  $scope.data = transdata;
  $scope.postCount($scope.data.actid);
  
  var myPopup = $ionicPopup.show({
     
    templateUrl: 'templates/popup-detail-template.html',
    scope: $scope,
    
   });
  
   
 }else if(mode == 2){

  var myPopup = $ionicPopup.show({
    templateUrl: 'templates/popup-class-template.html',
    scope: $scope,
  });

 }

  IonicClosePopupService.register(myPopup);
  $ionicPlatform.registerBackButtonAction(function(){
    //$rootScope.map.setClickable(true);
    myPopup.close();
  }, 401);


  $scope.popClose = function(classid){
    
    myPopup.close();

    $scope.findClass(classid);

    
       
   }



}

   $scope.startMap = function() {
      
    
         
          
           navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 30000 });
           function onSuccess(position) {
              var lat=position.coords.latitude;
              var lang=position.coords.longitude;

               var myLatlng = new google.maps.LatLng(lat,lang);
               var mapOptions = {zoom: 10,center: myLatlng}
               
               $rootScope.map.setCenter(myLatlng);
               

               var marker = new google.maps.Marker({
                position: myLatlng,
                map: $rootScope.map,
                icon: "../img/mapPinOver2.gif",
                optimized: false
                

              });
               mymarker = marker;
               $scope.addYourLocationButton($rootScope.map, mymarker);
            }
              function onError(error) {
               
           }
           

                $scope.watchLocation();
                $scope.setMarker(filterdata);
                setInterval(function(){ $scope.getData(); }, 20000);

      };

    
  $scope.postCount = function(id) {


      return $http.get("http://linedb.mybluemix.net/updateClickcount.php?ID="+id)
       .success(function (data, status, headers,config) {
          

         })
       .error(function (data, status, headers, config) {
           alert ("remain your internet connection");
        });
  w}; 



  $scope.popFilter = function(){
    
   var a = [];
     a[0] = [];
     
     for(var i = 0; i < calldata[0].length ; i++){

 
      var dataclick = calldata[0][i].actclickcount;
      var clicktime = 10 ;

      

      if(dataclick > clicktime){
         a[0].push(calldata[0][i]);
         
      }

     }
     
     filterdata = a ;

  }
  

  
$scope.posStateChange = function(state){
       if(state == 1){
          
          var styles =[{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}];
          $rootScope.map.setOptions({styles: styles});
          mymarker.setIcon('../img/redself.png')
          $scope.delMarker();
          $scope.setCircle(filterdata);
          $scope.posstate = 2;
          $scope.posstatatext = "marker";

       }
       else if(state == 2){
         
          var styles =[];
          $rootScope.map.setOptions({styles: styles});
          mymarker.setIcon('../img/mapPinOver2.gif')
          $scope.delCircle();
          $scope.setMarker(filterdata);
          $scope.posstate = 1;
          $scope.posstatatext = "visualize";
       }
       
 }
  $scope.watchLocation=function(){

        function onSuccess(position) {
        mylocation = new google.maps.LatLng(
                    position.coords.latitude,
                    position.coords.longitude
                ),
        

        mymarker.setMap(null);

        var marker = new google.maps.Marker({
          position: mylocation,
          map: $rootScope.map,
          icon: "../img/mapPinOver2.gif",
          optimized: false

        });
        mymarker = marker;
       
    }

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        //alert('code: '    + error.code    + '\n' +
              //'message: ' + error.message + '\n');
    }

    // Options: throw an error if no update is received every 30 seconds.
    //
    var watchID = navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 30000 });
  

  }

})

 

//SearchCtrl base on Search.html


.controller('SearchCtrl', function($rootScope,$scope, $timeout, $ionicFilterBar,$http,$ionicPopup,IonicClosePopupService,$ionicPlatform,$location,$compile) {

    var filterBarInstance;
    
    
    $scope.filterdata = [];     
    $scope.getData = function() {
       return $http.jsonp("http://linedb.mybluemix.net/getData.php?callback=JSON_CALLBACK")
       .success(function (data, status, headers,config) {
           filterdata = data;
           
           for(i = 0;i<filterdata[0].length;i++){
            if(filterdata[0][i].actsubclassname != "水質混濁"){
               filterdata[0][i].actaddress = filterdata[0][i].actaddress.substr(5);
            }
           }
           $scope.items = filterdata ;
           
         })
       .error(function (data, status, headers, config) {
           
        });
    }; 


    $scope.getData();

    function getItems () {
      var items = [];
      


      for (var i = 0; i < filterdata[0].length; i++) {
         var id = filterdata[0][i].ID;
         var name = filterdata[0][i].actsubclassname;
         var lat =  filterdata[0][i].actlat;
         var lon =  filterdata[0][i].actlon;
         var address = filterdata[0][i].actaddress;
         var aclass = filterdata[0][i].actclass;
         var actime = filterdata[0][i].createtime;
         var actcontent = filterdata[0][i].actcontent;
         
        items.push({'actid':id,'title':name,'address':address,'time':actime,'actcontent':actcontent});
       
      }
      $scope.items = items;
    }    

    $scope.showFilterBar = function () {
      filterBarInstance = $ionicFilterBar.show({
        items: $scope.items[0],
        update: function (filteredItems, filterText) {
          $scope.items[0] = filteredItems;
          if (filterText) {
         
          }
        }
      });
    };

    $scope.refreshItems = function () {
      if (filterBarInstance) {
        filterBarInstance();
        filterBarInstance = null;
      }

      $timeout(function () {
        //getItems();
        $scope.getData();
        $scope.$broadcast('scroll.refreshComplete');
      }, 1000);
    };

   
   $scope.go = function ( path , data ) {
       poslocation = new google.maps.LatLng(data.actlat,data.actlon);
       $rootScope.map.setCenter(poslocation);
       $rootScope.map.setZoom(18); 
      
       $location.path( path );
  
   };

  })















