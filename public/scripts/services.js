'use strict';
angular.module('myVault')
    .constant('MODE_OPEN', 0)
    .constant('MODE_EDIT', 1)
    .constant('MODE_NEW', 2)
    .constant('BASE_URL', 'https://vast-citadel-12459.herokuapp.com/')
    //.constant('BASE_URL', 'http://localhost:3000/')
    .factory('actionFac', ['noteModalFac', 'pwordModalFac', 'cardModalFac', 'ops', 'parseService', 'resources', function (noteModalFac, pwordModalFac, cardModalFac, ops, parseService, resources) {
        var fac = {};
        fac.openNote = function (scope, note, mode) {
            var noteModal = noteModalFac.newNote(scope, note, mode);
            var resource = resources.getNoteResource();
            noteModal.result.then(
                //Done
                function (newNote) {
                    switch (mode) {
                        case 2:
                            //Make new;
                            console.log('Making New Note!');
                            ops.save(parseService.parseNote(newNote), resource);
                            break;
                        default:
                            //Update same;
                            console.log('Saving the note!');
                            ops.update(parseService.parseNote(newNote), resource);
                            break;
                    }
                },
                //Cancelled/Dismissed
                function (reason) {
                    console.log('Modal Dismissed');
                }
            );
        };
        fac.openPword = function (scope, pword, mode) {
            var pwordModal = pwordModalFac.newPword(scope, pword, mode);
            var resource = resources.getPwordResource();
            pwordModal.result.then(
                function (newPword) {
                    switch (mode) {
                        case 2:
                            //Make new;
                            console.log('Making New Pword!');
                            console.log(newPword);
                            ops.save(parseService.parsePword(newPword), resource);
                            break;
                        default:
                            //Update same;
                            console.log('Saving the pword!');
                            console.log(newPword);
                            ops.update(parseService.parsePword(newPword), resource);
                            break;
                    }
                },
                function (reason) {
                    console.log('Modal Dismissed');
                }
            );
        };
        fac.openCard = function (scope, card, mode) {
            var cardModal = cardModalFac.newCard(scope, card, mode);
            var resource = resources.getCardResource();
            cardModal.result.then(
                function (newCard) {
                    switch (mode) {
                        case 2:
                            //Make new;
                            console.log('Making New Card!');
                            console.log(newCard);
                            ops.save(parseService.parseCard(newCard), resource);
                            break;
                        default:
                            //Update same;
                            console.log('Saving the card!');
                            console.log(newCard);
                            ops.update(parseService.parseCard(newCard), resource);
                            break;
                    }
                },
                function (reason) {
                    console.log('Modal Dismissed');
                }
            );
        };
        fac.pinIt = function (obj, type) {
            var resource, object;
            object = { _id: obj._id, pinned: obj.pinned };
            switch (type) {
                case 0:
                    resource = resources.getNoteResource();
                    break;
                case 1:
                    resource = resources.getPwordResource();
                    break;
                case 2:
                    resource = resources.getCardResource();
                    break;
            }
            ops.update(object, resource);
        };
        fac.delIt = function (scope, index, type) {
            var id, resource;
            switch (type) {
                default:
                case 0:
                    //Note Resource
                    id = scope.notes[index]._id;
                    resource = resources.getNoteResource();
                    scope.notes.splice(index, 1);
                    break;
                case 1:
                    //Password Resource
                    id = scope.pwords[index]._id;
                    resource = resources.getPwordResource();
                    scope.pwords.splice(index, 1);
                    break;
                case 2:
                    //Cards Resource
                    id = scope.cards[index]._id;
                    resource = resources.getCardResource();
                    scope.cards.splice(index, 1);
                    break;
            }
            ops.remove(id, resource);
        };
        return fac;
    }])
    .factory('noteModalFac', ['$uibModal', 'parseService', function ($uibModal, parseService) {

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
            modalOptions.resolve = { mode: mode };
            modalOptions.resolve.note = parseService.parseNote(note);
            noteModal = $uibModal.open(modalOptions);
            return noteModal;
        };

        return fac;
    }])
    .factory('pwordModalFac', ['$uibModal', 'parseService', function ($uibModal, parseService) {
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
            modalOptions.resolve = { mode: mode };
            modalOptions.resolve.pword = parseService.parsePword(pword);
            pwordModal = $uibModal.open(modalOptions);
            return pwordModal;
        };

        return fac;
    }])
    .factory('cardModalFac', ['$uibModal', 'parseService', function ($uibModal, parseService) {
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
            modalOptions.resolve = { mode: mode };
            modalOptions.resolve.card = parseService.parseCard(card);
            cardModal = $uibModal.open(modalOptions);
            return cardModal;
        };
        return fac;
    }])
    .factory('$localStorage', ['$window', function ($window) {
        return {
            store: function (key, value) {
                $window.localStorage[key] = value;
            },
            fetch: function (key, value) {
                return $window.localStorage[key] || value;
            },
            storeObj: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            fetchObj: function (key, value) {
                return JSON.parse($window.localStorage[key] || value);
            }
        };
    }])
    .factory('resources', ['BASE_URL', '$resource', '$localStorage', function (BASE_URL, $resource, $localStorage) {
        var fac = {};

        fac.getLoginResource = function () {
            return $resource(BASE_URL + 'users/signin', null, {
                save: {
                    method: 'POST'
                }
            });
        };

        fac.getLogoutResource = function () {
            return $resource(BASE_URL + 'users/signout', null, {
                get: {
                    method: 'GET',
                    headers: { 'x-access-token': $localStorage.fetch('token', null) }
                }
            });
        };

        fac.getRegisterResource = function () {
            return $resource(BASE_URL + 'users/register', null, {
                save: {
                    method: 'POST'
                }
            });
        };

        fac.getNoteResource = function () {
            return $resource(BASE_URL + 'notes/:id', null, {
                update: {
                    method: 'PUT',
                    headers: { 'x-access-token': $localStorage.fetch('token', null) }
                },
                get: {
                    method: 'GET',
                    headers: { 'x-access-token': $localStorage.fetch('token', null) }
                },
                save: {
                    method: 'POST',
                    headers: { 'x-access-token': $localStorage.fetch('token', null) }
                },
                query: {
                    method: 'GET',
                    headers: { 'x-access-token': $localStorage.fetch('token', null) },
                    isArray: true
                },
                remove: {
                    method: 'DELETE',
                    headers: { 'x-access-token': $localStorage.fetch('token', null) }
                }
            });
        };

        fac.getPwordResource = function () {
            return $resource(BASE_URL + 'pwords/:id', null, {
                update: {
                    method: 'PUT',
                    headers: { 'x-access-token': $localStorage.fetch('token', null) }
                },
                get: {
                    method: 'GET',
                    headers: { 'x-access-token': $localStorage.fetch('token', null) }
                },
                save: {
                    method: 'POST',
                    headers: { 'x-access-token': $localStorage.fetch('token', null) }
                },
                query: {
                    method: 'GET',
                    headers: { 'x-access-token': $localStorage.fetch('token', null) },
                    isArray: true
                },
                remove: {
                    method: 'DELETE',
                    headers: { 'x-access-token': $localStorage.fetch('token', null) }
                }
            });
        };

        fac.getCardResource = function () {
            return $resource(BASE_URL + 'cards/:id', null, {
                update: {
                    method: 'PUT',
                    headers: { 'x-access-token': $localStorage.fetch('token', null) }
                },
                get: {
                    method: 'GET',
                    headers: { 'x-access-token': $localStorage.fetch('token', null) }
                },
                save: {
                    method: 'POST',
                    headers: { 'x-access-token': $localStorage.fetch('token', null) }
                },
                query: {
                    method: 'GET',
                    headers: { 'x-access-token': $localStorage.fetch('token', null) },
                    isArray: true
                },
                remove: {
                    method: 'DELETE',
                    headers: { 'x-access-token': $localStorage.fetch('token', null) }
                }
            });
        };
        return fac;
    }])
    .factory('ops', [function () {
        var fac = {};
        fac.save = function (object, resource) {
            resource.save(JSON.stringify(object))
                .$promise
                .then(
                function (res) {
                    console.log('Saved!');
                },
                function (reason) {
                    console.log('Error Saving!', reason);
                    //Display msg to user
                }
                );
        };
        fac.remove = function (_id, resource) {
            resource.remove({ id: _id })
                .$promise
                .then(
                function (res) {
                    console.log('Deleted id :', _id);
                },
                function (res) {
                    console.log('Could not Delete id :', _id);
                }
                );
        };
        fac.deleteAll = function (resource) {
            resource.remove()
                .$promise
                .then(
                function (res) {
                    console.log('Deleted all!');
                },
                function (res) {
                    console.log('Deletion of all failed!');
                }
                );
        };
        fac.update = function (object, resource) {
            resource.update({ id: object._id }, JSON.stringify(object))
                .$promise
                .then(
                function (res) {
                    console.log('Updated Note! id: ', object._id);
                },
                function (res) {
                    console.log('Update failed! id: ', object._id);
                }
                );
        };
        return fac;
    }])
    .service('parseService', [function () {
        this.parseNote = function (note) {
            var n = {
                title: note.title,
                note: note.note,
                pinned: note.pinned,
                account: note.account
            };
            if (!angular.isUndefined(note._id))
                n._id = note._id;
            return n;
        };
        this.parsePword = function (pword) {
            var p = {
                title: pword.title,
                username: pword.username,
                password: pword.password,
                pinned: pword.pinned,
                account: pword.account,
                hasCustom: pword.hasCustom,
                customFields: pword.customFields
            };
            if (!angular.isUndefined(pword._id))
                p._id = pword._id;
            return p;
        };
        this.parseCard = function (card) {
            var c = {
                title: card.title,
                cardNo: card.cardNo,
                expMonth: card.expMonth,
                expYear: card.expYear,
                pinned: card.pinned,
                account: card.account,
                hasCustom: card.hasCustom,
                customFields: card.customFields
            };
            if (!angular.isUndefined(card._id))
                c._id = card._id;
            return c;
        };
    }])
    .service('accService', ['$localStorage', function ($localStorage) {
        var acc = true;
        this.getCurrent = function () {
            console.log('getCurrent---', acc);
            return acc;
        };
        this.setCurrent = function (value) {
            console.log('setCurrent---', value);
            acc = value;
        };
    }])
    .service('loginService', ['resources', '$localStorage', '$rootScope', '$state', function (resources, $localStorage, $rootScope, $state) {
        var resource = resources.getLoginResource();
        this.signIn = function (username, password) {
            var body = {
                username: username,
                password: password
            };
            resource.save(JSON.stringify(body))
                .$promise
                .then(
                function (res) {
                    console.log('Login Successful!');
                    console.log(res.token);
                    $localStorage.store('token', res.token);
                    //state transition to welcome
                    $state.transitionTo('welcome');
                },
                function (res) {
                    console.log('Login Failed!');
                    //Show login failed msg to user
                    $rootScope.$broadcast('login-fail', res);
                }
                );
        };
    }])
    .service('logoutService', ['resources', '$state', function (resources, $state) {
        var resource = resources.getLogoutResource();
        this.signOut = function () {
            resource.get().$promise.then(
                function (res) {
                    console.log('User Signed Out');
                },
                function (res) {
                    console.log('Signout failed!');
                }
            )
            $timeout(function () {
                $state.transitionTo('login');
            }, 10);
        };
    }])
    .service('regService', ['resources', '$rootScope', function (resources, $rootScope) {
        var resource = resources.getRegisterResource();
        this.signUp = function (username, password) {
            var body = {
                username: username,
                password: password
            };
            resource.save(JSON.stringify(body))
                .$promise
                .then(
                function (res) {
                    console.log('Registered Successfully!');
                    $rootScope.$broadcast('reg-success', body);
                },
                function (res) {
                    console.log('Registration Failed!');
                    $rootScope.$broadcast('reg-fail', res);
                }
                );
        };
    }])
    ;