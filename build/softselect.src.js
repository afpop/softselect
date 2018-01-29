(function () {
    'use strict';

    angular.module('softselect.directive', [])
        .directive('softselect', softSelect);

    /** @ngInject */
    function softSelect($filter, $timeout, $document) {

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
                ssDisabled: "="
            },
            templateUrl: "softselect.html",
            link: function(scope, element, attributes){

                // Variaveis
                var _lastScroll = 0;
                scope.ssFilter = '';
                scope.selectLimit = 10;
                scope.ssMany = scope.$eval(attributes.ssMany) || false;
                scope.lastSelected = {};
                scope.isOpen = false;
                scope.filteredData = [];

                // Method Binding
                scope.getFilteredData = _getFilteredData;
                scope.ss_select = _ssSelect;
                scope.ss_selectAll = _ssSelectAll;
                scope.ss_clearAll = _clearAll;

                scope.dropTop = 0;
                scope.dropLeft = 0;
                scope.dropWidth = 0;
                scope.dropHeight = 0;
                scope.inputFilter = null;

                init();


                scope.open = function (event){

                    var dropdown = event.currentTarget;
                    var dropdownMenu = dropdown.querySelector(".softdown-menu");

                    if(scope.ssMany)
                        scope.inputFilter = dropdown.querySelector(".filter");

                    renderDropDownMenu(dropdown, dropdownMenu);

                    if(!scope.isOpen)
                    {
                        scope.isOpen = true;
                    }
                    else if(scope.isOpen && scope.ssMany === false)
                    {
                        scope.isOpen = false;
                    }

                    if(scope.ssMany === false)
                    {
                        if(!scope.ssModel[scope.ssField.text])
                            return;

                        scope.selectedText = scope.ssModel[scope.ssField.text];

                        if(!scope.selecting)
                            scope.ssModel[scope.ssField.text] = '';
                        else
                            scope.selecting = false;
                    }

                };

                function renderDropDownMenu(dropdown, dropdownMenu){

                    var window_height = $(window).height();
                    var window_scroll = $(window).scrollTop();

                    var dropdown_top = $(dropdown).offset().top;
                    var dropdown_left = $(dropdown).offset().left;
                    var dropdown_height = $(dropdown).height();
                    var dropdown_width = $(dropdown).width();

                    var dropdownMenu_height = dropdownMenu.offsetHeight;

                    var dropdownMenu_top = (dropdown_top + dropdown_height ) - window_scroll;

                    if(dropdownMenu_top + dropdownMenu_height > window_height)
                        dropdownMenu_top -=  (dropdown_height + dropdownMenu_height);

                    scope.dropTopFixed = scope.dropTop = (dropdownMenu_top - 4);
                    scope.dropLeftFixed = scope.dropLeft = (dropdown_left + 2);
                    scope.dropWidthFixed = scope.dropWidth = (dropdown_width - 2);

                }

                scope.$watch('ssModel', function () {

                    alterarCampo();

                });

                scope.$watch('ssData', function () {

                    alterarCampo();

                    if(angular.isDefined(scope.ssData) && scope.ssData.length > 0)
                        _getFilteredData();
                });

                scope.$watch('ssModel[ssField.text]', function () {

                    if(angular.isDefined(scope.ssModel) && angular.isDefined(scope.ssField.text))
                        _getFilteredData();

                });

                scope.$watch('ssFilter', function(){

                    if(angular.isDefined(scope.ssFilter))
                        _getFilteredData();
                });

                // Metodos Privados
                function init() {

                    hookDropDown();

                }

                var button;

                function hookDropDown() {

                    $(window).scroll(function () {

                        if(!scope.isOpen)
                            return;

                        var window_scroll = $(this).scrollTop();

                        scope.$apply(function(){
                            scope.dropTopFixed = scope.dropTop - window_scroll;
                        });

                    });

                    $(".softselect .softdown .softdown-menu").scroll(function () {

                        var _scrollTop = $(this).scrollTop();

                        var _scrollHeight = $(this).prop('scrollHeight') - $(this).outerHeight();

                        if (_scrollHeight != _lastScroll) {

                            if (_scrollTop >= _scrollHeight) {

                                if (scope.selectLimit < scope.ssData.length) {


                                    scope.$apply(function () {
                                        scope.selectLimit = scope.selectLimit + 10;

                                        _getFilteredData();
                                    });

                                    if (_scrollHeight != _lastScroll)
                                        _scrollHeight = _lastScroll;

                                }
                            }
                        }
                    });
                }

                function alterarCampo() {

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

                function _getFilteredData() {

                    scope.filteredData = scope.ssData;

                    if ((scope.ssFilter && scope.ssMany) || (scope.ssModel[scope.ssField.text] && !scope.filterControl))
                        scope.filteredData = $filter('filter')(scope.ssData, scope.ssMany ? scope.ssFilter : scope.ssModel[scope.ssField.text], customComparator);

                    scope.filteredData = $filter('limitTo')(scope.filteredData, scope.selectLimit);

                    scope.filteredData = $filter('orderBy')(scope.filteredData, scope.ssField.orderby);
                }

                function customComparator(actual, expected){

                    if(typeof actual !== 'object' || actual === null)
                        return;

                    if(angular.isUndefined(actual[scope.ssField.text]) || actual[scope.ssField.text] === null )
                        return;

                    actual = removeAccents(actual[scope.ssField.text]);
                    expected = removeAccents(expected);

                    return actual.indexOf(expected) > -1;
                }

                function removeAccents(string) {

                    var mapaAcentosHex 	= {
                        a : /[\xE0-\xE6]/g,
                        e : /[\xE8-\xEB]/g,
                        i : /[\xEC-\xEF]/g,
                        o : /[\xF2-\xF6]/g,
                        u : /[\xF9-\xFC]/g,
                        c : /\xE7/g,
                        n : /\xF1/g
                    };

                    var toReplace = [ ["Á", "A"], ["À", "A"], ["Â", "A"], ["Ã", "A"],
                        ["É", "E"], ["È", "E"], ["Ê", "E"],
                        ["Í", "I"], ["Ì", "I"], ["Î", "I"],
                        ["Ó", "O"], ["Ò", "O"], ["Ô", "O"], ["Õ", "O"],
                        ["Ú", "U"], ["Ù", "U"], ["Û", "U"]];

                    for ( var letra in mapaAcentosHex ) {
                        var expressaoRegular = mapaAcentosHex[letra];
                        string = string.replace( expressaoRegular, letra );
                    }

                    var i;

                    for(i = 0; i < toReplace.length; i++){
                        string = string.replace(toReplace[i][0], toReplace[i][1]);
                    }

                    return string.toUpperCase();
                }

                function _ssSelect(item) {

                    scope.selecting = true;

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

                    scope.ssFilter = "";

                    _getFilteredData();

                    if(scope.ssMany)
                        scope.inputFilter.focus();
                }

                function _ssSelectAll() {

                    angular.forEach(scope.ssData, function (item) {
                        item.selected = true;
                    });

                    scope.ssModel = scope.ssData;
                }

                function _clearAll(event) {

                    angular.forEach(scope.ssData, function (item) {
                        item.selected = false;
                    });

                    scope.selectedText = "";
                    scope.ssModel = [];

                    if(angular.isDefined(event))
                        event.stopPropagation();
                }

                var handler = function(event) {

                    if(!scope.isOpen)
                        return;

                    if (!element[0].contains(event.target)) {

                        scope.$apply(function(){

                            if(!scope.isOpen)
                                return;

                            scope.isOpen = false;

                            if(scope.ssModel[scope.ssField.text] !== scope.selectedText)
                                scope.ssModel[scope.ssField.text] = scope.selectedText;

                            if(scope.ssMany === true)
                                scope.ssFilter = '';

                        });
                    }

                };

                $document.on('click', handler);

                scope.$on('$destroy', function() {
                    $document.off('click', handler);
                });

            }
        };
    }

})();