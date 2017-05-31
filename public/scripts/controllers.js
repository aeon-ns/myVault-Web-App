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
    .controller('NavbarController', ['$scope', 'action', 'logoutService', 'MODE_NEW', 'msgModal', function ($scope, action, logoutService, MODE_NEW, msgModal) {
        //Searchbar
        $scope.addNote = function () {
            action.openNote($scope, { account: true, pinned: false }, MODE_NEW);
        };
        $scope.addPword = function () {
            action.openPword($scope, { account: true, pinned: false }, MODE_NEW);
        };
        $scope.addCard = function () {
            action.openCard($scope, { cardNo: [], account: true, pinned: false }, MODE_NEW);
        };
        $scope.signOut = function () {
            logoutService.signOut();
        };
        $scope.$on('new-msg', function (event, msg, callback) {
            var modal = msgModal.open($scope, msg);
            callback(modal);
            event.preventDefault();
        });
    }])
    .controller('WelcomeController', ['notesRepo', 'pwordsRepo', 'cardsRepo', function (notesRepo, pwordsRepo, cardsRepo) {
        notesRepo.startFetching();
        pwordsRepo.startFetching();
        cardsRepo.startFetching();
    }])
    .controller('PinnedController', ['$scope', 'notesRepo', 'pwords', 'cards', 'action', 'MODE_EDIT', 'accService', 'ops', 'resources', function ($scope, notesRepo, pwords, cards, action, MODE_EDIT, accService, ops, resources) {
        $scope.account = accService.getCurrent();
        $scope.setActiveAcc = function (value) {
            $scope.account = value;
            accService.setCurrent(value);
        };
        $scope.notes = notesRepo.get();
        $scope.pwords = pwords;
        $scope.cards = cards;
        $scope.$on('notes-ready', function (event, data) {
            $scope.notes = data;
            event.preventDefault();
        });
        $scope.editNote = function (note) {
            action.openNote($scope, note, MODE_EDIT);
        };
        $scope.editPword = function (pword) {
            action.openPword($scope, pword, MODE_EDIT);
        };
        $scope.editCard = function (card) {
            action.openCard($scope, card, MODE_EDIT);
        };
        $scope.pinIt = function (obj, type) {
            obj.pinned = !obj.pinned;
            console.log('PINNED:');
            action.pinIt(obj, type);
        };
        $scope.delIt = function (index, type) {
            action.delIt($scope, index, type);
            console.log('Deleted: ' + index);
        };
    }])
    .controller('NotesController', ['$scope', 'notes', 'action', 'MODE_EDIT', 'accService', function ($scope, notes, action, MODE_EDIT, accService) {
        $scope.account = accService.getCurrent();
        $scope.setActiveAcc = function (value) {
            $scope.account = value;
            accService.setCurrent(value);
        };
        $scope.notes = notes;
        $scope.editNote = function (note) {
            action.openNote($scope, note, MODE_EDIT);
        };
        $scope.pinIt = function (obj) {
            var type = 0; // Type NOTE
            obj.pinned = !obj.pinned;
            console.log('PINNED:');
            action.pinIt(obj, type);
        };
        $scope.delIt = function (index) {
            var type = 0; // Type NOTE
            action.delIt($scope, index, type);
            console.log('Deleted: ' + index);
        };
    }])
    .controller('PwordsController', ['$scope', 'pwords', 'action', 'MODE_EDIT', 'accService', function ($scope, pwords, action, MODE_EDIT, accService) {
        $scope.account = accService.getCurrent();
        $scope.setActiveAcc = function (value) {
            $scope.account = value;
            accService.setCurrent(value);
        };
        $scope.pwords = pwords;

        $scope.editPword = function (pword) {
            action.openPword($scope, pword, MODE_EDIT);
        };
        $scope.pinIt = function (obj) {
            var type = 1; //Type PWORD
            obj.pinned = !obj.pinned;
            console.log('PINNED:');
            action.pinIt(obj, type);
        };
        $scope.delIt = function (index) {
            var type = 1; //Type PWORD
            action.delIt($scope, index, type);
            console.log('Deleted: ' + index);
        };
    }])
    .controller('CardsController', ['$scope', 'cards', 'action', 'MODE_EDIT', 'accService', function ($scope, cards, action, MODE_EDIT, accService) {
        $scope.account = accService.getCurrent();
        $scope.setActiveAcc = function (value) {
            $scope.account = value;
            accService.setCurrent(value);
        };
        $scope.cards = cards;
        $scope.editCard = function (card) {
            action.openCard($scope, card, MODE_EDIT);
        };
        $scope.pinIt = function (obj) {
            var type = 2; //Type CARD
            obj.pinned = !obj.pinned;
            console.log('PINNED:');
            action.pinIt(obj, type);
        };
        $scope.delIt = function (index) {
            var type = 2; //Type CARD
            action.delIt($scope, index, type);
            console.log('Deleted: ' + index);
        };
    }])
    .controller('ModalController', function ($uibModalInstance, object) {
        var $ctrl = this;
        $ctrl.object = object;
        $ctrl.show = false;
        $ctrl.setAccount = function (value) {
            $ctrl.object.account = value;
        };
        $ctrl.save = function () {
            $uibModalInstance.close($ctrl.object);
        };
        $ctrl.close = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $ctrl.addField = function () {
            var field = { key: '', value: '' };
            if (!$ctrl.object.hasCustom) {
                $ctrl.object.hasCustom = true;
                $ctrl.object.customFields = [];
            }
            $ctrl.object.customFields.push(field);
        };
        $ctrl.delField = function (index) {
            $ctrl.object.customFields.splice(index, 1);
            $ctrl.fieldShow.splice(index, 1);
            if ($ctrl.object.customFields.length == 0)
                $ctrl.object.hasCustom = false;
        };
    })
    .controller('MsgModalController', function ($uibModalInstance, msg) {
        var $ctrl = this;
        $ctrl.msg = msg.msg;
        $ctrl.close = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })
    ;