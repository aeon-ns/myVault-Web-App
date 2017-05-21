'use strict';

angular.module('myVault', ['ui.router', 'ngResource', 'ui.bootstrap'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            // route for the home page
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
                        templateUrl: '../views/welcome.html'
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
                    notes: function () {
                        return [{
                            _id: 0,
                            title: 'NOTETITLE',
                            note: 'Sample Note!!!!',
                            pinned: false
                        }];
                    },
                    pwords: function () {
                        return [{
                            _id: 0,
                            title: 'Password1',
                            username: 'ns',
                            password: 'sds',
                            pinned: false,
                            hasCustom: false,
                            customFields: [],
                            forUser: ''
                        },
                        {
                            _id: 1,
                            title: 'Password2',
                            username: 'ns',
                            password: 'sds',
                            pinned: false,
                            hasCustom: true,
                            customFields: [{
                                key: 'Note',
                                value: 'Notessssss',
                                type: 'text'
                            }, {
                                key: 'Pass',
                                value: 'abjbjj',
                                type: 'password'
                            }],
                            forUser: ''
                        }];
                    },
                    cards: function () {
                        return [{
                            _id: 0,
                            title: 'Card1',
                            cardNo: [
                                '1234',
                                '5678',
                                '8765',
                                '4321'
                            ],
                            expMonth: 9,
                            expYear: 17,
                            pinned: true,
                            hasCustom: false,
                            customFields: []
                        }, {
                            _id: 1,
                            title: 'Card2',
                            cardNo: ['4321','8765','5678','1234',],
                            expMonth: 10,
                            expYear: 20,
                            pinned: false,
                            hasCustom: true,
                            customFields: [{
                                key: 'Note',
                                value: 'Notessssss',
                                type: 'text'
                            }, {
                                key: 'Pass',
                                value: 'abjbjj',
                                type: 'password'
                            }]
                        }];
                    }
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
                        controller: 'NoteController'
                    }
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
                        controller: 'PasswordController'
                    }
                }
            })

            .state('cards', {
                url: '/cards',
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
                        templateUrl: '../views/cards.html',
                        controller: 'CardController'
                    }
                }
            })

        $urlRouterProvider.otherwise('/');
    })
;