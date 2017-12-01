angular.module('todoApp', ['softselect.directive','ngSanitize'])
    .controller('TodoListController', function() {

        var vm = this;

        function _gerarSelect() {

            vm.data = [
                {id: 1, nome: "Jack", cargo: "Programador", contato: {tipo: "residencial", telefone: "12 90101-0202"}},
                {id: 2, nome: "Nunes", cargo: "Programador", contato: {tipo: "residencial", telefone: "12 90101-0303"}},
                {id: 3, nome: "Peixoto", cargo: "Programador", contato: {tipo: "residencial", telefone: "12 90101-0404"}}
            ];

            vm.field = { value: 'id', text: 'nome', orderby: 'nome' };

            vm.funcionario = {};
            vm.funcionarios = [];
        }

        _gerarSelect();

    });