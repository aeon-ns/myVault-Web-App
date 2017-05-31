'use strict';
angular.module('myVault')
    .constant('MODE_EDIT', 0)
    .constant('MODE_NEW', 1)
    //.constant('BASE_URL', 'https://vast-citadel-12459.herokuapp.com/')
    .constant('BASE_URL', 'http://localhost:3000/')
    .factory('action', ['noteModal', 'pwordModal', 'cardModal', 'ops', 'parse', 'resources', function (noteModal, pwordModal, cardModal, ops, parse, resources) {
        var fac = {};
        fac.openNote = function (scope, note, mode) {
            var modal = noteModal.newNote(scope, note);
            var resource = resources.getNoteResource();
            modal.result.then(
                function (newNote) {
                    if (mode) {
                        //Make new;
                        console.log('Making New Note!');
                        ops.save(parse.note(newNote), resource);
                    } else {
                        //Update same;
                        console.log('Saving the note!');
                        ops.update(parse.note(newNote), resource);
                    }
                },
                //Cancelled/Dismissed
                function (reason) {
                    console.log('Modal Dismissed');
                }
            );
        };
        fac.openPword = function (scope, pword, mode) {
            var modal = pwordModal.newPword(scope, pword);
            var resource = resources.getPwordResource();
            modal.result.then(
                function (newPword) {
                    if (mode) {
                        //Make new;
                        console.log('Making New Pword!');
                        console.log(newPword);
                        ops.save(parse.pword(newPword), resource);
                    } else {
                        //Update same;
                        console.log('Saving the pword!');
                        console.log(newPword);
                        ops.update(parse.pword(newPword), resource);
                    }
                },
                function (reason) {
                    console.log('Modal Dismissed');
                }
            );
        };
        fac.openCard = function (scope, card, mode) {
            var modal = cardModal.newCard(scope, card);
            var resource = resources.getCardResource();
            modal.result.then(
                function (newCard) {
                    if (mode) {
                        //Make new;
                        console.log('Making New Card!');
                        console.log(newCard);
                        ops.save(parse.card(newCard), resource);
                    } else {
                        //Update same;
                        console.log('Saving the card!');
                        console.log(newCard);
                        ops.update(parse.card(newCard), resource);
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
                case 0://Note Resource
                    id = scope.notes[index]._id;
                    resource = resources.getNoteResource();
                    scope.notes.splice(index, 1);
                    break;
                case 1://Password Resource
                    id = scope.pwords[index]._id;
                    resource = resources.getPwordResource();
                    scope.pwords.splice(index, 1);
                    break;
                case 2://Cards Resource
                    id = scope.cards[index]._id;
                    resource = resources.getCardResource();
                    scope.cards.splice(index, 1);
                    break;
            }
            ops.remove(id, resource);
        };
        return fac;
    }])
    .factory('modalOpts', [function () {
        return {
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            size: 'md',
            controllerAs: '$ctrl',
            controller: 'ModalController'
        };
    }])
    .factory('msgModal', ['$uibModal', 'modalOpts', function ($uibModal, modalOpts) {
        var fac = {};
        var modalOptions = modalOpts;
        modalOptions.size = 'sm';
        modalOptions.templateUrl = '../views/modals/msg.html';
        modalOptions.controller = 'MsgModalController';
        fac.open = function (scope, msg) {
            var modal = {};
            modalOptions.scope = scope;
            modalOptions.resolve = { msg: msg };
            modal = $uibModal.open(modalOptions);
            return modal;
        };
        return fac;
    }])
    .factory('noteModal', ['$uibModal', 'parse', 'modalOpts', function ($uibModal, parse, modalOpts) {
        var fac = {};
        var modalOptions = modalOpts;
        fac.newNote = function (scope, note) {
            var noteModal = {};
            modalOptions.templateUrl = '../views/modals/note.html',
                modalOptions.scope = scope;
            modalOptions.resolve = {};
            modalOptions.resolve.object = parse.note(note);
            noteModal = $uibModal.open(modalOptions);
            return noteModal;
        };
        return fac;
    }])
    .factory('pwordModal', ['$uibModal', 'parse', 'modalOpts', function ($uibModal, parse, modalOpts) {
        var fac = {};
        var modalOptions = modalOpts;
        fac.newPword = function (scope, pword) {
            var pwordModal = {};
            modalOptions.templateUrl = '../views/modals/pword.html';
            modalOptions.scope = scope;
            modalOptions.resolve = {};
            modalOptions.resolve.object = parse.pword(pword);
            pwordModal = $uibModal.open(modalOptions);
            return pwordModal;
        };
        return fac;
    }])
    .factory('cardModal', ['$uibModal', 'parse', 'modalOpts', function ($uibModal, parse, modalOpts) {
        var fac = {};
        var modalOptions = modalOpts;
        fac.newCard = function (scope, card) {
            var cardModal = {};
            modalOptions.templateUrl = '../views/modals/card.html';
            modalOptions.scope = scope;
            modalOptions.resolve = {};
            modalOptions.resolve.object = parse.card(card);
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
                save: { method: 'POST' }
            });
        };
        fac.getLogoutResource = function () {
            return $resource(BASE_URL + 'users/signout', null, {
                get: { method: 'GET', headers: { 'x-access-token': $localStorage.fetch('token', null) } }
            });
        };
        fac.getRegisterResource = function () {
            return $resource(BASE_URL + 'users/register', null, {
                save: { method: 'POST' }
            });
        };
        fac.getNoteResource = function () {
            return $resource(BASE_URL + 'notes/:id', null, {
                update: { method: 'PUT', headers: { 'x-access-token': $localStorage.fetch('token', null) } },
                get: { method: 'GET', headers: { 'x-access-token': $localStorage.fetch('token', null) } },
                save: { method: 'POST', headers: { 'x-access-token': $localStorage.fetch('token', null) } },
                query: { method: 'GET', headers: { 'x-access-token': $localStorage.fetch('token', null) }, isArray: true },
                remove: { method: 'DELETE', headers: { 'x-access-token': $localStorage.fetch('token', null) } }
            });
        };
        fac.getPwordResource = function () {
            return $resource(BASE_URL + 'pwords/:id', null, {
                update: { method: 'PUT', headers: { 'x-access-token': $localStorage.fetch('token', null) } },
                get: { method: 'GET', headers: { 'x-access-token': $localStorage.fetch('token', null) } },
                save: { method: 'POST', headers: { 'x-access-token': $localStorage.fetch('token', null) } },
                query: { method: 'GET', headers: { 'x-access-token': $localStorage.fetch('token', null) }, isArray: true },
                remove: { method: 'DELETE', headers: { 'x-access-token': $localStorage.fetch('token', null) } }
            });
        };
        fac.getCardResource = function () {
            return $resource(BASE_URL + 'cards/:id', null, {
                update: { method: 'PUT', headers: { 'x-access-token': $localStorage.fetch('token', null) } },
                get: { method: 'GET', headers: { 'x-access-token': $localStorage.fetch('token', null) } },
                save: { method: 'POST', headers: { 'x-access-token': $localStorage.fetch('token', null) } },
                query: { method: 'GET', headers: { 'x-access-token': $localStorage.fetch('token', null) }, isArray: true },
                remove: { method: 'DELETE', headers: { 'x-access-token': $localStorage.fetch('token', null) } }
            });
        };
        return fac;
    }])
    .factory('notesRepo', ['$rootScope', 'resources', 'handle', '$state', function ($rootScope, resources, handle, $state) {
        var resource = resources.getNoteResource();
        var notes = [];
        var fac = {};
        fac.get = function () {
            return notes;
        };
        fac.startFetching = function () {
            resource.query().$promise.then(
                function (res) {
                    notes = res;
                    console.log('<-----notes ready broadcasting now----->')
                    $rootScope.$broadcast('notes-ready', notes);
                },
                function (res) {
                    handle('fetch notes', res);
                }
            );
        };
        return fac;
    }])
    .factory('pwordsRepo', ['$rootScope', 'resources', 'handle', function ($rootScope, resources, handle) {
        var resource = resources.getPwordResource();
        var pwords = [];
        var fac = {};
        fac.get = function () {
            return pwords;
        };
        fac.startFetching = function () {
            resource.query().$promise.then(
                function (res) {
                    pwords = res;
                    console.log('<-----pwords ready broadcasting now----->')
                    $rootScope.$broadcast('pwords-ready', pwords);
                },
                function (res) {
                    handle('fetch passwords', res);
                }
            );
        };
        return fac;
    }])
    .factory('cardsRepo', ['$rootScope', 'resources', 'handle', function ($rootScope, resources, handle) {
        var resource = resources.getCardResource();
        var cards = [];
        var fac = {};
        fac.get = function () {
            return cards;
        };
        fac.startFetching = function () {
            resource.query().$promise.then(
                function (res) {
                    cards = res;
                    console.log('<-----cards ready broadcasting now----->')
                    $rootScope.$broadcast('cards-ready', cards);
                },
                function (res) {
                    handle('fetch cards', res);
                }
            );
        };
        return fac;
    }])
    .factory('handle', ['$localStorage', '$state', function ($localStorage, $state) {
        return function (op, res) {
            var modal = {};
            var msg = '';
            if (res.status == 401) {
                if ($localStorage.fetch('token', null) == null)
                    msg = 'Unauthorized Access! Please Login/Register!';
                else {
                    msg = 'Session timedout! Please login again!';
                    //Try to renew it! TODO
                }
            } else {
                msg = 'Sorry! Couldn\'t ' + op + '! Please try again!';
            }
            $rootScope.$broadcast('new-msg', { msg: msg }, function (modal) {
                modal.result.then(function (res) { }, function (result) { if (res.status == 401) $state.transitionTo('login'); });
            });
        };
    }])
    .factory('ops', ['$state', 'handle', function ($state, handle) {
        var fac = {};
        fac.save = function (object, resource) {
            resource.save(JSON.stringify(object))
                .$promise
                .then(
                function (res) {
                    console.log('Saved!');
                },
                function (res) {
                    console.log(res);
                    console.log('Error Saving!');
                    handle('save', res);
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
                    handle('delete', res);
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
                    handle('delete', res);
                }
                );
        };
        fac.update = function (object, resource) {
            resource.update({ id: object._id }, JSON.stringify(object))
                .$promise
                .then(
                function (res) {
                    console.log('Updated! id: ', object._id);
                },
                function (res) {
                    console.log('Update failed! id: ', object._id);
                    handle('update', res);
                }
                );
        };
        return fac;
    }])
    .service('parse', [function () {
        this.note = function (note) {
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
        this.pword = function (pword) {
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
        this.card = function (card) {
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
    .service('logoutService', ['resources', '$state', '$timeout', '$localStorage', function (resources, $state, $timeout, $localStorage) {
        this.signOut = function () {
            resources.getLogoutResource().get();
            $localStorage.store('token', null);
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