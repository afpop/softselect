(function () {
    'use strict';

    angular.module('softselect.directive', [])
        .directive('softselect', softSelect);

    /** @ngInject */
    function softSelect($filter, $timeout, $document, $window, $compile) {

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
                scope.scrollParent = null;
                scope.first = true;
                scope.orderedData = [];

                // Method Binding
                scope.getFilteredData = _getFilteredData;
                scope.ss_selectAll = _ssSelectAll;
                scope.ss_clearAll = _clearAll;

                scope.dropdown = element[0];
                scope.dropdownMenu = null;
                scope.dropTop = 0;
                scope.dropLeft = 0;
                scope.dropWidth = 0;
                scope.dropHeight = 0;
                scope.inputFilter = null;
                scope.scrollParent = null;

                scope.open = function (event){

                    if(scope.first)
                    {
                        scope.dropdown = event.currentTarget;
                        scope.dropdownMenu = scope.dropdown.querySelector(".softdown-menu");
                        scope.scrollParent = getScrollParent(scope.dropdown, true);
                        scope.dropdownList = scope.dropdownMenu.querySelector(".softdown-list");

                        hookDropDown();

                        if(scope.ssMany)
                            scope.inputFilter = scope.dropdown.querySelector(".filter");
                        else
                            scope.inputFilter = scope.dropdown.querySelector(".form-control");

                        scope.first = false;
                    }

                    if(scope.ssMany)
                    {
                        if (angular.isUndefined(scope.ssModel) || scope.ssModel === null)
                            scope.ssModel = [];
                    }
                    else
                    {
                        if(angular.isUndefined(scope.ssModel) || scope.ssModel === null)
                            scope.ssModel = {};
                    }

                    renderDropDownMenu( scope.dropdown, scope.dropdownMenu);


                    if(!scope.isOpen)
                    {
                        scope.isOpen = true;
                        scope.ssFilter = "";
                        _getFilteredData();
                    }
                    else if(scope.isOpen && scope.ssMany === false)
                    {
                        scope.isOpen = false;
                        scope.ssFilter = scope.ssModel[scope.ssField.text];
                    }

                    if(scope.ssMany === false)
                    {
                        if(angular.isDefined(scope.ssModel) && angular.isDefined(scope.ssField))
                        {
                            if(!scope.ssModel[scope.ssField.text])
                                return;
                        }
                    }

                    _redimensionarFiltro();

                    scope.inputFilter.focus();
                };

                function _redimensionarFiltro(){

                    if(angular.isDefined(scope.ssModel) && scope.ssModel !== null && scope.ssMany)
                    {
                        var width = ($(scope.dropdown).width()) - ( (scope.ssModel.length > 2 ? 1.66 : scope.ssModel.length) * 60 + 33);

                        $(scope.dropdown.querySelector(".selected-input")).css("width", width + "px");
                    }
                }

                function renderDropDownMenu(dropdown, dropdownMenu){

                    var window_height = $(window).height();
                    var window_scroll = $(window).scrollTop();

                    var dropdown_top = $(dropdown).offset().top;
                    var dropdown_left = $(dropdown).offset().left;
                    var dropdown_height = $(dropdown).height();
                    var dropdown_width = $(dropdown).width();

                    var dropdownMenu_height = $(dropdownMenu).height() < 0 ? 150 : $(dropdownMenu).height();

                    var dropdownMenu_top = (dropdown_top + dropdown_height ) - window_scroll;

                    if(dropdownMenu_top + dropdownMenu_height > window_height)
                        dropdownMenu_top -=  (dropdown_height + dropdownMenu_height);

                    scope.dropTopFixed = scope.dropTop = (dropdownMenu_top - 4);
                    scope.dropLeftFixed = scope.dropLeft = (dropdown_left + 2);
                    scope.dropWidthFixed = scope.dropWidth = (dropdown_width - 2);

                }

                scope.$watch('ssModel', function () {

                    _applyChange();

                    if(angular.isDefined(scope.ssChange))
                    {
                        if(angular.equals(scope.ssModel, {}))
                            scope.ssChange(false);
                        else
                            scope.ssChange(scope.ssModel);
                    }

                    _redimensionarFiltro();
                });

                scope.$watch('ssData', function () {

                    if(angular.isDefined(scope.ssData))
                    {
                        scope.orderedData = $filter('orderBy')(scope.ssData, scope.ssField.orderby);

                        _applyChange();

                        _getFilteredData();
                    }

                });

                scope.$watch('ssFilter', function(){

                    if(angular.isDefined(scope.ssFilter))
                        _getFilteredData();
                });

                function _applyChange(){

                    angular.forEach(scope.orderedData, function(item) {
                        item.selected = false;
                    });

                    if(scope.ssMany)
                    {
                        if(angular.isUndefined(scope.ssModel) || scope.ssModel === null)
                            return;

                        if(scope.ssModel.length === scope.orderedData.length)
                        {
                            scope.allSelected = true;
                        }
                        else
                        {
                            scope.allSelected = false;

                            angular.forEach(scope.ssModel, function(item){

                                var itemIndex = scope.orderedData.findIndex(function (array_item) { return array_item[scope.ssField.value] === item[scope.ssField.value] });

                                if(itemIndex > -1   )
                                    scope.orderedData[itemIndex].selected = true;
                            });
                        }
                    }
                    else
                    {
                        if(angular.isUndefined(scope.ssModel) && scope.ssModel !== null)
                            return;

                        var dataItem = scope.orderedData.filter(function (array_item) {

                            if(array_item === null || scope.ssModel === null)
                                return false;

                            return array_item[scope.ssField.value] === scope.ssModel[scope.ssField.value];

                        });

                        if(dataItem)
                            dataItem.selected = true;

                        if(angular.isDefined(scope.ssModel) && angular.isDefined(scope.ssField) && scope.ssModel !== null)
                            scope.ssFilter = scope.ssModel[scope.ssField.text];
                    }
                }

                function hookDropDown() {

                    angular.element(scope.scrollParent).bind("scroll", function() {

                        if(!scope.isOpen)
                            return;

                        scope.dropTopFixed = scope.dropTop - this.scrollTop;

                        scope.$apply();
                    });

                    $(".softselect .softdown .softdown-menu").scroll(function () {

                        var _scrollTop = $(this).scrollTop();

                        var _scrollHeight = $(this).prop('scrollHeight') - $(this).outerHeight();

                        if (_scrollHeight != _lastScroll) {

                            if (_scrollTop >= _scrollHeight) {

                                if (scope.selectLimit < scope.orderedData.length) {


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

                function _getFilteredData() {

                    angular.element(scope.dropdownList).empty();

                    scope.filteredData = scope.orderedData;

                    if(scope.ssFilter)
                    {
                        scope.filteredData = $filter('filter')(scope.orderedData, scope.ssFilter, customComparator);
                    }

                    scope.filteredData = $filter('limitTo')(scope.filteredData, scope.selectLimit);

                    angular.forEach(scope.filteredData, function(item){

                        var _selected = _isSelected(item) || scope.allSelected ? "<span class='fa fa-check'></span>" : "";
                        var _html = "<li class='item' ng-click='ss_select(\"" + item[scope.ssField.value] + "\")'>" + item[scope.ssField.text] + _selected + "</li>";

                        angular.element( scope.dropdownList).append( $compile(_html)(scope) );

                    });
                }

                scope.ss_select = function(value){

                    value = String(value);

                    var item = scope.orderedData.filter(function (array_item) { return String(array_item[scope.ssField.value]) === value })[0];

                    if(scope.ssMany)
                    {
                        var selected = scope.ssModel.some(function (array_item) { return String(array_item[scope.ssField.value]) === value });

                        if(selected)
                            scope.ssModel = scope.ssModel.filter(function (array_item) { return String(array_item[scope.ssField.value]) !== value });
                        else
                            scope.ssModel.push(item);

                        if(angular.isDefined(scope.ssChange))
                            scope.ssChange(scope.ssModel);
                    }
                    else
                    {
                        if(String(scope.ssModel[scope.ssField.value]) === value)
                            scope.ssModel = {};
                        else
                            scope.ssModel = item;
                    }

                    _getFilteredData();

                    if(scope.ssMany)
                    {
                        scope.ssFilter = "";
                        scope.inputFilter.focus();
                    }
                    else
                        scope.isOpen = false;

                    _redimensionarFiltro();
                };

                function _isSelected(item)
                {
                    if(angular.isUndefined(scope.ssModel) || angular.isUndefined(scope.ssField) || scope.ssModel === null || scope.ssField === null)
                        return false;

                    if(scope.ssMany)
                    {
                        return scope.ssModel.some(function (array_item) { return array_item[scope.ssField.value] === item[scope.ssField.value] });
                    }
                    else
                    {
                        return scope.ssModel[scope.ssField.text] === item[scope.ssField.text];
                    }
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

                function _ssSelectAll() {

                    scope.ssModel = scope.orderedData;

                    event.stopPropagation();

                    _getFilteredData();
                }

                function _clearAll(event) {

                    if(scope.ssMany)
                        scope.ssModel = [];
                    else
                        scope.ssModel = {};

                    scope.selectedText = "";

                    if(angular.isDefined(event))
                    {
                        scope.isOpen = false;
                        scope.selecting = false;
                        event.stopPropagation();
                    }

                    _getFilteredData();
                }

                var handler = function(event) {

                    if(!scope.isOpen)
                        return;

                    if (element[0].contains(event.target))
                        return;

                    scope.$apply(function(){

                        scope.isOpen = false;

                        if(angular.isDefined(scope.ssModel) && angular.isDefined(scope.ssField) && angular.isDefined(scope.ssFilter))
                        {
                            if(scope.ssModel[scope.ssField.text] !== scope.ssFilter)
                                scope.ssFilter = scope.ssModel[scope.ssField.text];
                        }

                        if(scope.ssMany === true)
                            scope.ssFilter = '';
                    });

                };

                $document.on('click', handler);

                scope.$on('$destroy', function() {
                    $document.off('click', handler);
                });

                function getScrollParent(element, includeHidden) {
                    var style = getComputedStyle(element);
                    var excludeStaticParent = style.position === "absolute";
                    var overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;

                    //if (style.position === "fixed") return document.body;

                    for (var parent = element; (parent = parent.parentElement);) {
                        style = getComputedStyle(parent);
                        if (excludeStaticParent && style.position === "static") {
                            continue;
                        }
                        if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) return parent;
                    }

                    return $window;
                }
            }
        };
    }

})();