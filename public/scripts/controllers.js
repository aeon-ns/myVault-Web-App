'use strict';

angular.module('myVault')

    .controller('LoginController', ['$scope', function ($scope) {
        $scope.login = true;
        $scope.setLoginTrue = function () {
            $scope.login = true;
        };
        $scope.setLoginFalse = function () {
            $scope.login = false;
        };
    }])

    .controller('SidebarController', ['$scope', '$state', '$location', function ($scope, $state, $location) {
        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };
    }])

    .controller('NavbarController', ['$scope', '$state','actionFac', function ($scope, $state, actionFac) {
        //Code for NoteModal, PasswordModal, CardsModal
        //Searchbar
        //SignOut 
        $scope.addNote = function() {
            actionFac.editNote($scope, {});
        };
        $scope.addPword = function() {
            actionFac.editPword($scope, {});
        };
        $scope.addCard = function() {
            actionFac.editCard($scope, {});
        };
    }])

    .controller('PinnedController', ['$scope', 'notes', 'pwords', 'cards', 'actionFac','MODE_EDIT','MODE_OPEN', function ($scope, notes, pwords, cards, actionFac, MODE_EDIT, MODE_OPEN) {

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
        $scope.openCard = function(card) {
            actionFac.openCard($scope, card, MODE_OPEN);
        };

        $scope.pinIt = function (obj, type) {
            obj.pinned = !obj.pinned;
            //actionFac.pinIt($scope, obj, type);
            console.log('PINNED: ');
        };

        $scope.delIt = function (index, type) {
            switch (type) {
                default:
                case 0:
                    //Note Resource;
                    $scope.notes.splice(index, 1);
                    break;
                case 1:
                    //Password Resource;
                    $scope.pwords.splice(index, 1);
                    break;
                case 2:
                    //Cards Resource;
                    $scope.cards.splice(index, 1);
                    break;
            }
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
        $ctrl.switchMode = function(){
            $ctrl.mode = 1;
        };
        $ctrl.addField = function () {
            var field = {
                key: '',
                value: '',
                type: 'password'
            };
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