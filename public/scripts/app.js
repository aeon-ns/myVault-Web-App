'use strict';

angular.module('myVault', ['ui.router', 'ngResource', 'ui.bootstrap'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {
                url: '/',
                templateUrl: '../views/login.html'
            })
            .state('appCommon', {
                templateUrl: '../views/app_main.html',
                abstract: true
            })
            .state('welcome', {
                url: '/welcome',
                parent: 'appCommon',
                views: {
                    'sidebar@appCommon': {
                        templateUrl: '../views/sidebar.html',
                        controller: 'SidebarController'
                    },
                    'header@appCommon': {
                        templateUrl: '../views/header.html',
                        controller: 'NavbarController'
                    },
                    'content@appCommon': {
                        templateUrl: '../views/welcome.html',
                        controller: 'WelcomeController'
                    }
                }
            })
            .state('pinned', {
                url: '/pinned',
                parent: 'appCommon',
                views: {
                    'sidebar@appCommon': {
                        templateUrl: '../views/sidebar.html',
                        controller: 'SidebarController'
                    },
                    'header@appCommon': {
                        templateUrl: '../views/header.html',
                        controller: 'NavbarController'
                    },
                    'content@appCommon': {
                        templateUrl: '../views/pinned.html',
                        controller: 'PinnedController'
                    }
                },
                resolve: {
                    pwords: ['resources', function (resources) {
                        return resources.getPwordResource().query();
                    }],
                    cards: ['resources', function (resources) {
                        return resources.getCardResource().query();
                    }],
                    account: ['accService', function (accService) {
                        return accService.getCurrent();
                    }]
                }
            })
            .state('notes', {
                url: '/notes',
                parent: 'appCommon',
                views: {
                    'sidebar@appCommon': {
                        templateUrl: '../views/sidebar.html',
                        controller: 'SidebarController'
                    },
                    'header@appCommon': {
                        templateUrl: '../views/header.html',
                        controller: 'NavbarController'
                    },
                    'content@appCommon': {
                        templateUrl: '../views/notes.html',
                        controller: 'NotesController'
                    }
                },
                resolve: {
                    notes: ['resources', function (resources) {
                        return resources.getNoteResource().query();
                    }],
                    account: ['accService', function (accService) {
                        return accService.getCurrent();
                    }]
                }
            })
            .state('passwords', {
                url: '/passwords',
                parent: 'appCommon',
                views: {
                    'sidebar@appCommon': {
                        templateUrl: '../views/sidebar.html',
                        controller: 'SidebarController'
                    },
                    'header@appCommon': {
                        templateUrl: '../views/header.html',
                        controller: 'NavbarController'
                    },
                    'content@appCommon': {
                        templateUrl: '../views/passwords.html',
                        controller: 'PwordsController'
                    }
                },
                resolve: {
                    pwords: ['resources', function (resources) {
                        return resources.getPwordResource().query();
                    }],
                    account: ['accService', function (accService) {
                        return accService.getCurrent();
                    }]
                }
            })
            .state('cards', {
                url: '/cards',
                parent: 'appCommon',
                params: {
                    acc: {
                        value: true,
                        squash: false
                    }
                },
                views: {
                    'sidebar@appCommon': {
                        templateUrl: '../views/sidebar.html',
                        controller: 'SidebarController'
                    },
                    'header@appCommon': {
                        templateUrl: '../views/header.html',
                        controller: 'NavbarController'
                    },
                    'content@appCommon': {
                        templateUrl: '../views/cards.html',
                        controller: 'CardsController'
                    }
                },
                resolve: {
                    cards: ['resources', function (resources) {
                        return resources.getCardResource().query();
                    }],
                    account: ['accService', function (accService) {
                        return accService.getCurrent();
                    }]
                }
            })
        $urlRouterProvider.otherwise('/');
    })
    ;