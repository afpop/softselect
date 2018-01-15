angular.module('todoApp', ['softselect.directive','ngSanitize'])
    .controller('TodoListController', function() {

        var vm = this;

        function _gerarSelect() {

            vm.data = [
                {id: 1, nome: "Jack", cargo: "Programador", contato: {tipo: "residencial", telefone: "12 90101-0202"}},
                {id: 2, nome: "Nunes", cargo: "Programador", contato: {tipo: "residencial", telefone: "12 90101-0303"}},
                {id: 3, nome: "Miranda", cargo: "Programador", contato: {tipo: "residencial", telefone: "12 90101-0404"}},
                {id: 4, nome: "Carvalho", cargo: "Programador", contato: {tipo: "residencial", telefone: "12 90101-0404"}},
                {id: 5, nome: "Walláce", cargo: "Programador", contato: {tipo: "residencial", telefone: "12 90101-0404"}},
                {id: 6, nome: "Fontes", cargo: "Programador", contato: {tipo: "residencial", telefone: "12 90101-0404"}},
                {id: 7, nome: "Pinto", cargo: "Programador", contato: {tipo: "residencial", telefone: "12 90101-0404"}},
                {id: 8, nome: "Rosemberg", cargo: "Programador", contato: {tipo: "residencial", telefone: "12 90101-0404"}},
                {id: 9, nome: "Barros", cargo: "Programador", contato: {tipo: "residencial", telefone: "12 90101-0404"}},
                {id: 10, nome: "Oliveira", cargo: "Programador", contato: {tipo: "residencial", telefone: "12 90101-0404"}},
                {id: 11, nome: "Roberto", cargo: "Programador", contato: {tipo: "residencial", telefone: "12 90101-0404"}},
                {id: 12, nome: "Olivio", cargo: "Programador", contato: {tipo: "residencial", telefone: "12 90101-0404"}},
                {id: 13, nome: "Vicente", cargo: "Programador", contato: {tipo: "residencial", telefone: "12 90101-0404"}},
                {id: 14, nome: "Rafael", cargo: "Programador", contato: {tipo: "residencial", telefone: "12 90101-0404"}},
                {id: 15, nome: "Fernando", cargo: "Programador", contato: {tipo: "residencial", telefone: "12 90101-0404"}},
                {id: 16, nome: "André", cargo: "Programador", contato: {tipo: "residencial", telefone: "12 90101-0404"}},
                {id: 17, nome: "Cavalo dourado", cargo: "Programador", contato: {tipo: "residencial", telefone: "12 90101-0404"}}
            ];

            vm.field = { value: 'id', text: 'nome', orderby: 'nome' };

            vm.funcionario = {};
            vm.funcionarios = [];
        }

        _gerarSelect();

    });