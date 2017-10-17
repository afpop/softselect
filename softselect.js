(function () {
    'use strict';

    angular.module('softselect.directive', [])
        .directive('softselect', softSelect);

    /** @ngInject */
    function softSelect($filter){

    return {
        restrict: 'E',
        replace: true,
        scope:{
            data: "=",
            selected: "=",
            object: "="
        },
        template: _template,//"app/components/softselect/softselect.html",
        link: function(scope, element, attrs){

            //array to store selected items
            scope.selected = [];

            //function triggered when user selects an item
            scope.ss_select = function(item){

                //check if the item is already selected
                var selected = scope.selected.some(function (array_item) { return item === array_item; });

                //selecting item
                if(!selected)
                {
                    //bind new property to item showing selected
                    item.selected = true;
                    scope.selected.push(item);
                }
                else //unselecting item
                {
                    scope.selected = scope.selected.filter(function(array_item) { return array_item !== item ; });
                    item.selected = false;
                }
            }

            //function to select all items
            scope.ss_selectAll = function(){

                angular.forEach(scope.data, function(item) {
                    item.selected = true;
                });

                scope.selected = scope.data;
            }

            //function to clear all items selected
            scope.ss_clearAll = _clearAll;

            function _clearAll(){

                angular.forEach(scope.data, function(item) {
                    item.selected = false;
                });

                scope.selected = [];
            }


            function _hookDropDown(){

                $(".softselect .dropdown").on('click', function() {
                    $(this).find('.dropdown-menu').css('top',$(this).offset().top + 28);
                    $(this).find('.dropdown-menu').css('left',$(this).offset().left);
                });
            }

            _hookDropDown();
        }
    };

    }

})();


var _template = '\n' +
    '<div class="softselect">\n' +
    '\n' +
    '    <div class="dropdown">\n' +
    '\n' +
    '\n' +
    '            <div class="form-control selected-box " placeholder="" aria-describedby="basic-addon2" data-toggle="dropdown">\n' +
    '\n' +
    '                <label ng-if="selected.length > 2" class="selected-count">\n' +
    '\n' +
    '                    {{selected.length === data.length ? "Todos" : selected.length}} selecionados\n' +
    '\n' +
    '                </label>\n' +
    '\n' +
    '                <label ng-if="selected.length <= 0" class="selected-placeholder">Selecionar...</label>\n' +
    '\n' +
    '                <ul ng-if="selected.length > 0 && selected.length <= 2">\n' +
    '\n' +
    '                    <li ng-repeat="item in selected">\n' +
    '\n' +
    '                        {{item[object.text]}}\n' +
    '\n' +
    '                    </li>\n' +
    '\n' +
    '                    &nbsp;\n' +
    '\n' +
    '                </ul>\n' +
    '\n' +
    '            </div>\n' +
    '\n' +
    '            <div class="dropdown-menu dropdown-menu-left">\n' +
    '\n' +
    '                <div class="controls" ng-show="data.length > 5 || selected >= 5">\n' +
    '\n' +
    '                    <span ng-click="ss_selectAll()">Selecionar todos</span> | <span ng-click="ss_clearAll()">Limpar</span>\n' +
    '\n' +
    '                </div>\n' +
    '\n' +
    '                <ul>\n' +
    '\n' +
    '                    <li class="item" ng-repeat="item in data" ng-click="ss_select(item)">\n' +
    '\n' +
    '                        {{("00" + $index).slice(-2)}} - {{item[object.text]}} <span class="fa fa-check" ng-if="item.selected" style="color: #2ecc71" ></span>\n' +
    '\n' +
    '                    </li>\n' +
    '\n' +
    '                </ul>\n' +
    '\n' +
    '            </div>\n' +
    '\n' +
    '    </div>\n' +
    '\n' +
    '</div>\n';