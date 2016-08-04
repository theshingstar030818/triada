var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var currDate = new Date();
var date = currDate.getDate();
var month = months[currDate.getMonth()];
var day = weekdays[currDate.getDay()];

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

// need to move to services.js
.service('ParseService', function() {
 return {
    fetchDataForSpecificDate: function(queryDate) {
      var Orders = Parse.Object.extend("Orders");
      var OrdersQuery = new Parse.Query(Orders);
      OrdersQuery.equalTo("deliveryDate", queryDate);

      if(!Parse.User.current().get("isAdmin") && Parse.User.current().get("driverInfo") != undefined){
        //driver user
        OrdersQuery.equalTo("driverId", Parse.User.current().get("driverInfo"));
      }

      OrdersQuery.include("pharmacyID");
      OrdersQuery.include("patientId");
      OrdersQuery.include("pharmacyID.pharmacyInfo");
      OrdersQuery.include("driverId");
      return OrdersQuery.find().then(function (response) {
         return response;
      });
    },
    fetchDataForSpecificDatePharmacy: function(queryDate,pharmacyIDObject) {
      var Orders = Parse.Object.extend("Orders");
      var OrdersQuery = new Parse.Query(Orders);
      OrdersQuery.equalTo("deliveryDate", queryDate);
      OrdersQuery.equalTo("pharmacyID", pharmacyIDObject);

      if(!Parse.User.current().get("isAdmin") && Parse.User.current().get("driverInfo") != undefined){
        //driver user
        OrdersQuery.equalTo("driverId", Parse.User.current().get("driverInfo"));
      }

      OrdersQuery.include("pharmacyID");
      OrdersQuery.include("patientId");
      OrdersQuery.include("pharmacyID.pharmacyInfo");
      OrdersQuery.include("driverId");
      return OrdersQuery.find().then(function (response) {
         return response;
      });
    },
    fetchDrivers: function(){
      var Drivers = Parse.Object.extend("Drivers");
      var DriversQuery = new Parse.Query(Drivers);
      return DriversQuery.find().then(function (response) {
         return response;
      });
    },
    fetchClients: function(){
      var Clients = Parse.Object.extend("Pharmacies");
      var ClientsQuery = new Parse.Query(Clients);
      return ClientsQuery.find().then(function (response) {
         return response;
      });
    }


 };
})

.service('scopeService', function() {
 return {
   currentPharmacy: null,
   currDate: null,
   currentOrders: null,
   currDriver: null,
   allDriversArray: null,
   allDriversMap: null,
   allClientsArray: null,
   allClientsMap: null,
   allDeliveriesForTodayMap: null,
   currPharmacyOrdersDetailArray: null,
   clientToEdit: null,
   employeeToEdit: null,
   ordersCounter: null,

   getOrdersCounter: function(){
    return this.ordersCounter;
   },
   setOrdersCounter: function(counterValue){
    this.ordersCounter = counterValue;
   },

   getClientToEdit: function() {
     return this.clientToEdit;
   },
   getEmployeeToEdit: function() {
     return this.employeeToEdit;
   },

   getCurrentPharmacy: function() {
     return this.currentPharmacy;
   },
   getCurrDate: function() {
     return this.currDate;
   },
   getCurrentOrders: function() {
    return this.currentOrders;
   },
   getCurrDriver: function(){
    return this.currDriver;
   },
   getAllDriversArray: function(){
    return this.allDriversArray;
   },
   getAllDriversMap: function(){
    return this.allDriversMap;
   },
   getAllClientsArray: function(){
    return this.allClientsArray;
   },
   getAllClientsMap: function(){
    return this.allClientsMap;
   },
   getAllDeliveriesForTodayMap: function(){
    return this.allDeliveriesForTodayMap;
   },
   getCurrPharmacyOrdersDetailArray: function(){
    return this.currPharmacyOrdersDetailArray;
   },

   updateClientToEdit: function(clientToEdit) {
     this.clientToEdit = clientToEdit;
   },
   updateEmployeeToEdit: function(employeeToEdit) {
     this.employeeToEdit = employeeToEdit;
   },
   
   updatecurrentPharmacy: function(currentPharmacy) {
     this.currentPharmacy = currentPharmacy;
   },
   updateCurrDate: function(currDate) {
     this.currDate = currDate;
   },
   updateCurrentOrders:function(currentOrders) {
     this.currentOrders = currentOrders;
   },
   updateCurrDriver: function(currDriver) {
     this.currDriver = currDriver;
   },
   updateAlldriversArray: function(allDriversArray){
     this.allDriversArray = allDriversArray;
   },
   updateAllDriversMap: function(allDriversMap){
     this.allDriversMap = allDriversMap;
   },
   updateAllClientsArray: function(allClientsArray){
     this.allClientsArray = allClientsArray;
   },
   updateAllClientsMap: function(allClientsMap){
     this.allClientsMap = allClientsMap;
   },
   updateAllDeliveriesForTodayMap: function(allDeliveriesForTodayMap){
    this.allDeliveriesForTodayMap = allDeliveriesForTodayMap;
   },
   updateCurrPharmacyOrdersDetailArray: function(currPharmacyOrdersDetailArray){
    this.currPharmacyOrdersDetailArray = currPharmacyOrdersDetailArray;
   }

 }
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.stats', {
    url: '/stats',
    views: {
      'menuContent': {
        templateUrl: 'templates/stats.html',
        controller: 'statsCtrl'
      }
    }
  })

  .state('app.clients', {
   url: "/clients",
   views: {
     'menuContent': {
       templateUrl: "templates/clients.html",
       controller: 'clientsCtrl'
     }
   }
 })

  .state('app.employees', {
   url: "/employees",
   views: {
     'menuContent': {
       templateUrl: "templates/employees.html",
       controller: 'employeesCtrl'
     }
   }
 })

  .state('app.addEditPharmacy', {
   url: "/addEditPharmacy",
   views: {
     'menuContent': {
       templateUrl: "templates/addPharmacy.html",
       controller: 'addEditClientCtrl'
     }
   }
 })
 .state('app.assignDriver', {
   url: "/assignDriver",
   views: {
     'menuContent': {
       templateUrl: "templates/assignDriver.html",
       controller: 'assignDriverCtrl'
     }
   }
 })
 .state('app.viewPharmacy', {
   url: "/viewPharmacy",
   views: {
     'menuContent': {
       templateUrl: "templates/viewPharmacy.html",
       controller: 'viewPharmacyCtrl'
     }
   }
 })
 .state('app.viewSingleDelivery', {
   url: "/viewSingleDelivery",
   views: {
     'menuContent': {
       templateUrl: "templates/viewSingleDelivery.html",
       controller: 'viewSingleDeliveryCtrl'
     }
   }
 })
 .state('app.submitDelivery', {
   url: "/submitDelivery",
   views: {
     'menuContent': {
       templateUrl: "templates/submitDelivery.html",
       controller: 'submitDeliveryCtrl'
     }
   }
 })
 .state('app.addEditEmployee', {
     url: "/addEditEmployee",
     views: {
       'menuContent': {
         templateUrl: "templates/addDriver.html",
         controller: 'addEditEmployeeCtrl'
       }
     }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/stats');
});





