'use strict';

angular.module('myVault')

    .constant('MODE_EDIT', 1)
    .constant('MODE_OPEN', 0)
    .constant('BASE_URL', '')
    .service('loginService', ['$resource'])

    .factory('actionFac', ['noteModalFac', 'pwordModalFac', 'cardModalFac', function (noteModalFac, pwordModalFac, cardModalFac) {
        var fac = {};

        function modalRejectionHandler(reason) {
            console.log(reason);
            console.log('Modal Dismissed');
        }

        fac.openNote = function (scope, note, mode) {
            var noteModal = noteModalFac.newNote(scope, note, mode);
            noteModal.result.then(
                //Done
                function (newNote) {
                    
                    //Update Note in db
                    console.log('Note Pushed!');
                },
                //Cancelled/Dismissed
                modalRejectionHandler(reason)
            );
        };
        fac.openPword = function (scope, pword, mode) {
            var pwordModal = pwordModalFac.newPword(scope, pword, mode);
            pwordModal.result.then(
                function (newPword) {
                    newPword._id = scope.pwords.length;
                    scope.pwords.push(newPword);
                    console.log('Pword Pushed!');
                    //TODO
                },
                modalRejectionHandler(reason)
            );
        };
        fac.openCard = function (scope, card, mode) {
            var cardModal = cardModalFac.newCard(scope, card, mode);
            cardModal.result.then(
                function (newCard) {
                    scope.cards.push(newCard);
                    //TODO
                },
                modalRejectionHandler(reason)
            );
        };

        return fac;
    }])

    .factory('noteModalFac', ['$uibModal', function ($uibModal) {

        var fac = {};

        var modalOptions = {
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            size: 'md',
            controllerAs: '$ctrl',
            templateUrl: '../views/modals/note.html',
            controller: 'NoteModalController'
        };

        fac.newNote = function (scope, note, mode) {
            var noteModal = {};
            modalOptions.scope = scope;
            modalOptions.resolve = {
                note: {
                    _id: note._id,
                    title: note.title,
                    note: note.note,
                    pinned: note.pinned,
                    forUser: note.forUser
                },
                mode: mode
            };
            noteModal = $uibModal.open(modalOptions);
            return noteModal;
        };

        return fac;
    }])

    .factory('pwordModalFac', ['$uibModal', function ($uibModal) {
        var fac = {};

        var modalOptions = {
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            size: 'md',
            controllerAs: '$ctrl',
            templateUrl: '../views/modals/pword.html',
            controller: 'PwordModalController'
        };

        fac.newPword = function (scope, pword, mode) {
            var pwordModal = {};
            modalOptions.scope = scope;
            modalOptions.resolve = {
                pword: {
                    _id: pword._id,
                    title: pword.title,
                    username: pword.username,
                    password: pword.password,
                    pinned: pword.pinned,
                    hasCustom: pword.hasCustom,
                    customFields: pword.customFields,
                    forUser: pword.forUser
                },
                mode: mode
            };
            pwordModal = $uibModal.open(modalOptions);
            return pwordModal;
        };

        return fac;
    }])

    .factory('cardModalFac', ['$uibModal', function ($uibModal) {
        var fac = {};

        var modalOptions = {
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            size: 'md',
            controllerAs: '$ctrl',
            templateUrl: '../views/modals/card.html',
            controller: 'CardModalController'
        };

        fac.newCard = function (scope, card, mode) {
            var cardModal = {};
            modalOptions.scope = scope;
            modalOptions.resolve = {
                card: {
                    _id: card._id,
                    title: card.title,
                    cardNo: card.cardNo,
                    expMonth: card.expMonth,
                    expYear: card.expYear,
                    pinned: card.pinned,
                    hasCustom: card.hasCustom,
                    customFields: card.customFields,
                    forUser: card.forUser
                },
                mode: mode
            };
            cardModal = $uibModal.open(modalOptions);
            return cardModal;
        };
        return fac;
    }])
    ;