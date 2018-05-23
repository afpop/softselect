angular.module('softselect.directive').run(['$templateCache', function($templateCache) {$templateCache.put('softselect.html','\r\n<div class="softselect" ng-class="{\'disabled\': ssDisabled}">\r\n\r\n    <div class="softdown" ng-click="open($event)" ng-keypress="$event.stopPropagation()">\r\n\r\n        <div tabindex="{{ssTabindex}}"  class="selected-box" placeholder="" aria-describedby="basic-addon2" >\r\n\r\n                <div class="full-h" ng-hide="ssMany">\r\n\r\n                    <div class="form-group has-feedback">\r\n\r\n                        <input class="form-control" style="padding-left: 7px !important;" ng-model="ssFilter" placeholder="Selecionar...">\r\n\r\n                        <span class="fa fa-caret-down form-control-feedback" ng-hide="ssModel[ssField.value]" aria-hidden="true"></span>\r\n\r\n                    </div>\r\n\r\n                </div>\r\n\r\n                <div class="full-h" ng-show="ssMany">\r\n\r\n                    <div class="form-group has-feedback">\r\n\r\n                        <div class="form-control">\r\n\r\n                        <ul style="margin-left: {{ssModel.length > 0 ? \'2px\' : \'7px\'}}">\r\n\r\n                            <li ng-show="ssModel.length > 2" class="selected-item" style="max-width: 100px;" ng-click="ss_clearAll($event)">\r\n\r\n                               <span class="fa fa-times"></span> {{ssModel.length === orderedData.length ? "Todos" : ssModel.length}} selecionados\r\n\r\n                            </li>\r\n\r\n                            <li ng-show="ssModel.length > 0 && ssModel.length <= 2" class="selected-item" ng-repeat="item in ssModel | limitTo: 2 track by $index" ng-click="ss_select(item[ssField.value])">\r\n\r\n                                <span class="fa fa-times"></span> {{item[ssField.text]}}\r\n\r\n                            </li>\r\n\r\n                            <li class="selected-input" style="margin-left: 2px;">\r\n\r\n                                <input class="filter" ng-model="ssFilter" placeholder="{{ssModel.length > 0 ? \'\' : \'Selecionar...\'}}">\r\n\r\n                            </li>&nbsp;\r\n\r\n                        </ul>\r\n\r\n                    </div>\r\n\r\n                    </div>\r\n\r\n                </div>\r\n\r\n        </div>\r\n\r\n        <div class="softselect-loading" ng-show="ssData.length <= 0">\r\n\r\n            <div class="sk-fading-circle">\r\n                <div class="sk-circle1 sk-circle"></div>\r\n                <div class="sk-circle2 sk-circle"></div>\r\n                <div class="sk-circle3 sk-circle"></div>\r\n                <div class="sk-circle4 sk-circle"></div>\r\n                <div class="sk-circle5 sk-circle"></div>\r\n                <div class="sk-circle6 sk-circle"></div>\r\n                <div class="sk-circle7 sk-circle"></div>\r\n                <div class="sk-circle8 sk-circle"></div>\r\n                <div class="sk-circle9 sk-circle"></div>\r\n                <div class="sk-circle10 sk-circle"></div>\r\n                <div class="sk-circle11 sk-circle"></div>\r\n                <div class="sk-circle12 sk-circle"></div>\r\n            </div>\r\n\r\n        </div>\r\n\r\n        <span class="fa fa-times selected-clear" style="cursor:pointer" ng-show="ssModel[ssField.value]" ng-click="ss_clearAll($event)" title="Limpar"></span>\r\n\r\n        <span ng-show="ssMany" class="fa fa-reply-all selected-clear all" style="cursor:pointer" ng-click="ss_selectAll($event)" title="Selecionar Todos"></span>\r\n\r\n        <div ng-show="isOpen" class="softdown-menu scroll-4" ng-style="{top: dropTopFixed + \'px\', left: dropLeftFixed + \'px\', minWidth: dropWidthFixed + \'px\'}">\r\n\r\n                <ul class="softdown-list" ng-click="$event.stopPropagation()">\r\n\r\n\r\n                </ul>\r\n\r\n            </div>\r\n\r\n    </div>\r\n\r\n</div>\r\n');}]);