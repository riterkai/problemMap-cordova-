/**
 * Created by Vidailhet on 17/11/15.
 */

(function (ionic) {
    angular.module('ionic.closePopup', ['ionic'])
        .service('IonicClosePopupService', [
            function () {
                var currentPopup;
                var currentmap;
                var htmlEl = angular.element(document.querySelector('html'));
                htmlEl.on('click', function (event) {
                    if (event.target.nodeName === 'HTML') {
                        if (currentPopup && currentmap!= 0 ) {
                            
                            currentPopup.close();
                        }else{
                           currentPopup.close(); 
                        }
                    }
                });

                this.register = function (popup) {
                    currentPopup = popup;
                    //currentmap = map;
                }
            }
        ]);
})(window.ionic);