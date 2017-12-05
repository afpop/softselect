(function () {
    'use strict';

    angular.module('softselect.directive', [])
        .directive('softselect', softSelect);

    /** @ngInject */
    function softSelect($filter, $timeout) {

        return {
            restrict: 'E',
            replace: true,
            scope: {
                ssData: "=",
                ssModel: "=",
                ssField: "=",
                ssMany: "<?",
                ssChange: "=",
                ssTabindex: "=tabindex",
                ssDisabled: "=?bind"
            },
            templateUrl: "softselect.html",
            compile: _compileFunction
        };

        function _compileFunction(tElement, tAttributes) {
            return {
                pre: _preLink,
                post: _postLink
            }

            function _preLink(scope, element, attributes) {
                
                // Variaveis
                var _lastScroll = 0;
                scope.ssDisabled = false;
                scope.ssFilter = '';
                scope.selectLimit = 10;
                scope.ssMany = scope.$eval(attributes.ssMany) || false;

                // Method Binding
                scope.getFilteredData = _getFilteredData;
                scope.ss_select = _ssSelect;
                scope.ss_selectAll = _ssSelectAll;
                scope.ss_clearAll = _clearAll;

                init();

                // Watchers
                // scope.$watch('selectLimit', function () {
                //     scope.selectLimit = scope.selectLimit;
                // });

                scope.$watch('ssModel', function () {
                    alterarCampo();
                });

                scope.$watch('ssData', function () {
                    alterarCampo();
                });

                // Metodos Privados
                function init() {
                    hasValue();
                    hookDropDown();
                }

                function hasValue() {

                    if (angular.equals(scope.ssModel, undefined) || angular.equals(scope.ssModel, []) || angular.equals(scope.ssModel, {})) {
                        angular.forEach(scope.ssData, function (item) {
                            if ((!item.selected) || (localStorage.getItem('limparFiltro')))
                                item.selected = false;

                        });

                        scope.displayPlaceHolder = true;
                    }
                    else
                        scope.displayPlaceHolder = false;

                }

                function hookDropDown() {

                    $(".softselect .dropdown").on('click', function () {

                        var _button = $(this);

                        var _dropdown = $(this).find('.dropdown-menu');

                        _dropdown.css('top', (_button.offset().top + _button.height()) - $(window).scrollTop());
                        _dropdown.css('left', _button.offset().left);
                        _dropdown.css("min-width", _button.width());
                        _dropdown.toggleClass("open");
                        _button.toggleClass("btn-open");

                    });

                    $(window).scroll(function () {

                        var _button = $(".softselect .btn-open");

                        if (_button.length > 0) {

                            var _dropdown = $(".softselect .btn-open .open");
                            var _scrollTop = $(this).scrollTop();
                            _dropdown.css('top', (_button.offset().top + _button.height()) - _scrollTop);

                        }
                    });

                    $(".softselect .dropdown .dropdown-menu").scroll(function () {

                        var _scrollTop = $(this).scrollTop();
                        var _scrollHeight = $(this).prop('scrollHeight') - $(this).outerHeight();

                        if (_scrollHeight != _lastScroll) {

                            if (_scrollTop >= _scrollHeight) {

                                if (scope.selectLimit < scope.ssData.length) {

                                    
                                    scope.$apply(function () {
                                        scope.selectLimit = scope.selectLimit + 10;
                                    });

                                    if (_scrollHeight != _lastScroll)
                                        _scrollHeight = _lastScroll;

                                }
                            }
                        }
                    });
                }

                function alterarCampo() {
                    hasValue();

                    if (angular.isArray(scope.ssModel, [])) {

                        angular.forEach(scope.ssModel, function (item) {

                            if (!angular.equals(scope.ssData, undefined)) {
                                var _index = scope.ssData.findIndex(function (x) { return x[scope.ssField.value] === item[scope.ssField.value]; });

                                scope.ssData[_index]['selected'] = true;
                            }
                        });

                        if (scope.ssChange)
                            scope.ssChange(undefined);
                    }
                    else if (scope.ssModel) {

                        if (!angular.equals(scope.ssData, undefined)) {

                            var _index = scope.ssData.findIndex(function (x) {
                                return x[scope.ssField.value] === scope.ssModel[scope.ssField.value];
                            });

                            if (!angular.equals(scope.ssData[_index], undefined))
                                scope.ssData[_index].selected = true;

                            if (scope.ssChange)
                                scope.ssChange(scope.ssData[_index]);
                        }
                    }
                    else {
                        scope.ssModel = {};

                        if (scope.ssChange)
                            scope.ssChange(undefined);
                    }
                }

                // Metodos expostos ao DOM

                function _getFilteredData() {

                    var filtered = scope.ssData;

                    if ((scope.ssFilter && scope.ssMany) || (scope.ssModel[scope.ssField.text] && scope.ssMany == false))
                        filtered = $filter('filter')(filtered, scope.ssMany ? scope.ssFilter : scope.ssModel[scope.ssField.text]);

                    filtered = $filter('limitTo')(filtered, scope.selectLimit);

                    filtered = $filter('orderBy')(filtered, scope.ssField.orderby);

                    return filtered;
                }

                function _ssSelect(item) {

                    scope.displayPlaceHolder = false;

                    if (scope.ssMany) {
                        if (!scope.ssModel)
                            scope.ssModel = [];

                        //check if the item is already selected
                        var selected = scope.ssModel.some(function (array_item) { return item === array_item; });
                        if (item.selected)
                            selected = item.selected;

                        if (!selected) //selecting item
                        {
                            item.selected = true; //bind new property to item showing selected
                            scope.ssModel.push(item);
                        }
                        else //unselecting item
                        {
                            scope.ssModel = scope.ssModel.filter(function (array_item) { return array_item.id !== item.id; });
                            item.selected = false;
                        }
                    }
                    else {
                        _clearAll();
                        item.selected = true;
                        scope.ssModel = angular.copy(item);
                    }

                    if (scope.ssChange)
                        scope.ssChange(item);

                    hasValue();
                    scope.ssFilter = "";
                    _getFilteredData();
                }

                function _ssSelectAll() {

                    scope.displayPlaceHolder = false;

                    angular.forEach(scope.ssData, function (item) {
                        item.selected = true;
                    });

                    scope.ssModel = scope.ssData;
                }

                function _clearAll() {

                    angular.forEach(scope.ssData, function (item) {
                        item.selected = false;
                    });

                    scope.ssModel = [];
                    scope.displayPlaceHolder = true;
                }

                scope.setFocus = function(event){

                    $timeout(function (){

                        if(event.target.value !== '')
                            event.target.select();
                        else
                            event.target.focus();

                        }, 100);
                }

            }

            function _postLink(scope, element, attributes) {
           
            }
        }

    }

})();