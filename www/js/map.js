    document.addEventListener("deviceready", function () {

           


            var element = angular.element(document.getElementById("mapctrl"));
                    
            var controller = element.controller();
                   
            var scope = element.scope();
            
            scope.initailData();
            
            
        });
    
    function onMapReady() {
      var button = document.getElementById("button");
      button.addEventListener("click", onBtnClicked, false);
    }

    function onBtnClicked() {
      map.showDialog();
    }
    
    