'use strict';
angular.module('myVault')
    .controller('LoginController', ['$scope', 'loginService', 'regService', function ($scope, loginService, regService) {
        $scope.login = true;
        $scope.regSuccess = $scope.regFail = $scope.loginFail = false;
        $scope.user = {};
        $scope.setLogin = function (value) {
            $scope.login = value;
        };
        $scope.signIn = function () {
            $scope.regSuccess = $scope.regFail = $scope.loginFail = false;
            loginService.signIn($scope.user.username, $scope.user.password);
        };
        $scope.signUp = function () {
            $scope.regSuccess = $scope.regFail = $scope.loginFail = false;
            regService.signUp($scope.user.username, $scope.user.password);
        };
        //Events reg-success reg-fail login-fail
        $scope.$on('reg-success', function (event, res) {
            console.log('reg-success---->');
            $scope.regSuccess = true;
            $scope.login = true;
            event.preventDefault();
        });
        $scope.$on('reg-fail', function (event, res) {
            console.log('reg-fail---->');
            $scope.regFail = true;
            event.preventDefault();
        });
        $scope.$on('login-fail', function (event, res) {
            console.log('login-fail---->');
            $scope.loginFail = true;
            event.preventDefault();
        });
    }])
    .controller('SidebarController', ['$scope', '$location', function ($scope, $location) {
        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };
    }])
    .controller('NavbarController', ['$scope', '$state', 'actionFac', 'logoutService', 'MODE_NEW', function ($scope, $state, actionFac, logoutService, MODE_NEW) {
        //Code for NoteModal, PasswordModal, CardsModal
        //Searchbar
        //SignOut 
        $scope.addNote = function () {
            actionFac.openNote($scope, {}, MODE_NEW);
        };
        $scope.addPword = function () {
            actionFac.openPword($scope, {}, MODE_NEW);
        };
        $scope.addCard = function () {
            actionFac.openCard($scope, {cardNo:[]}, MODE_NEW);
        };
        $scope.signOut = function () {
            logoutService.signOut();
        };
    }])
    .controller('PinnedController', ['$scope', 'notes', 'pwords', 'cards', 'actionFac', 'MODE_EDIT', 'MODE_OPEN', 'accService', 'ops', 'resources', 'parseService', function ($scope, notes, pwords, cards, actionFac, MODE_EDIT, MODE_OPEN, accService, ops, resources, parseService) {
        $scope.account = accService.getCurrent();
        $scope.setActiveAcc = function (value) {
            $scope.account = value;
            accService.setCurrent(value);
        };
        $scope.notes = notes;
        $scope.pwords = pwords;
        $scope.cards = cards;
        $scope.editNote = function (note) {
            actionFac.openNote($scope, note, MODE_EDIT);
        };
        $scope.editPword = function (pword) {
            actionFac.openPword($scope, pword, MODE_EDIT);
        };
        $scope.editCard = function (card) {
            actionFac.openCard($scope, card, MODE_EDIT);
        };
        $scope.openNote = function (note) {
            actionFac.openNote($scope, note, MODE_OPEN);
        };
        $scope.openPword = function (pword) {
            actionFac.openPword($scope, pword, MODE_OPEN);
        };
        $scope.openCard = function (card) {
            actionFac.openCard($scope, card, MODE_OPEN);
        };
        $scope.pinIt = function (obj, type) {
            obj.pinned = !obj.pinned;
            console.log('PINNED:');
            actionFac.pinIt(obj, type);
        };
        $scope.delIt = function (index, type) {
            actionFac.delIt($scope, index, type);
            console.log('Deleted: ' + index);
        };
    }])
    .controller('NotesController', ['$scope', 'notes', 'actionFac', 'MODE_EDIT', 'MODE_OPEN', 'accService', function ($scope, notes, actionFac, MODE_EDIT, MODE_OPEN, accService) {
        $scope.account = accService.getCurrent();
        $scope.setActiveAcc = function (value) {
            $scope.account = value;
            accService.setCurrent(value);
        };
        $scope.notes = notes;
        $scope.editNote = function (note) {
            actionFac.openNote($scope, note, MODE_EDIT);
        };
        $scope.openNote = function (note) {
            actionFac.openNote($scope, note, MODE_OPEN);
        };
        $scope.pinIt = function (obj) {
            var type = 0; // Type NOTE
            obj.pinned = !obj.pinned;
            console.log('PINNED:');
            actionFac.pinIt(obj, type);
        };
        $scope.delIt = function (index) {
            var type = 0; // Type NOTE
            actionFac.delIt($scope, index, type);
            console.log('Deleted: ' + index);
        };
    }])
    .controller('PwordsController', ['$scope', 'pwords', 'actionFac', 'MODE_EDIT', 'MODE_OPEN', 'accService', function ($scope, pwords, actionFac, MODE_EDIT, MODE_OPEN, accService) {
        $scope.account = accService.getCurrent();
        $scope.setActiveAcc = function (value) {
            $scope.account = value;
            accService.setCurrent(value);
        };
        $scope.pwords = pwords;

        $scope.editPword = function (pword) {
            actionFac.openPword($scope, pword, MODE_EDIT);
        };
        $scope.openPword = function (pword) {
            actionFac.openPword($scope, pword, MODE_OPEN);
        };
        $scope.pinIt = function (obj) {
            var type = 1; //Type PWORD
            obj.pinned = !obj.pinned;
            console.log('PINNED:');
            actionFac.pinIt(obj, type);
        };
        $scope.delIt = function (index) {
            var type = 1; //Type PWORD
            actionFac.delIt($scope, index, type);
            console.log('Deleted: ' + index);
        };
    }])
    .controller('CardsController', ['$scope', 'cards', 'actionFac', 'MODE_EDIT', 'MODE_OPEN', 'accService', function ($scope, cards, actionFac, MODE_EDIT, MODE_OPEN, accService) {
        $scope.account = accService.getCurrent();
        $scope.setActiveAcc = function (value) {
            $scope.account = value;
            accService.setCurrent(value);
        };
        $scope.cards = cards;
        $scope.editCard = function (card) {
            actionFac.openCard($scope, card, MODE_EDIT);
        };
        $scope.openCard = function (card) {
            actionFac.openCard($scope, card, MODE_OPEN);
        };
        $scope.pinIt = function (obj) {
            var type = 2; //Type CARD
            obj.pinned = !obj.pinned;
            console.log('PINNED:');
            actionFac.pinIt(obj, type);
        };
        $scope.delIt = function (index) {
            var type = 2; //Type CARD
            actionFac.delIt($scope, index, type);
            console.log('Deleted: ' + index);
        };
    }])
    .controller('NoteModalController', function ($uibModalInstance, note) {
        var $ctrl = this;
        $ctrl.note = note;
        $ctrl.save = function () {
            $uibModalInstance.close($ctrl.note);
        };
        $ctrl.close = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })
    .controller('PwordModalController', function ($uibModalInstance, pword) {
        var $ctrl = this;
        $ctrl.pword = pword;
        $ctrl.save = function () {
            $uibModalInstance.close($ctrl.pword);
        };

        $ctrl.close = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $ctrl.addField = function () {
            var field = {
                key: '',
                value: '',
                type: 'password'
            };
            if (angular.isUndefined($ctrl.pword.customFields)) $ctrl.pword.customFields = [];
            $ctrl.pword.customFields.push(field);
            if (!$ctrl.pword.hasCustom)
                $ctrl.pword.hasCustom = true;
        };

        $ctrl.delField = function (index) {
            $ctrl.pword.customFields.splice(index, 1);
            if ($ctrl.pword.customFields.length == 0)
                $ctrl.pword.hasCustom = false;
        };
    })
    .controller('CardModalController', function ($uibModalInstance, card, mode) {
        var $ctrl = this;
        $ctrl.card = card;
        $ctrl.mode = mode;
        $ctrl.save = function () {
            $uibModalInstance.close($ctrl.card);
        };
        $ctrl.close = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $ctrl.switchMode = function () {
            $ctrl.mode = 1;
        };
        $ctrl.addField = function () {
            var field = {
                key: '',
                value: '',
                type: 'password'
            };
            if (angular.isUndefined($ctrl.card.customFields)) $ctrl.card.customFields = [];
            $ctrl.card.customFields.push(field);
            if (!$ctrl.card.hasCustom)
                $ctrl.card.hasCustom = false;
        };
        $ctrl.delField = function (index) {
            $ctrl.card.customFields.splice(index, 1);
            if ($ctrl.card.customFields.length == 0)
                $ctrl.card.hasCustom = false;
        };
    })
    ;