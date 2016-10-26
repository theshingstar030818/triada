var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var currDate = new Date();

var date = currDate.getDate();
var month = months[currDate.getMonth()];
var day = weekdays[currDate.getDay()];


currDate = new Date(currDate.getYear()+1900, currDate.getMonth(), currDate.getDate(), 0, 0, 0, 0);

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $state, $ionicActionSheet, ParseService, $ionicLoading, scopeService, $ionicPopup, $ionicModal, $timeout) {

  if(Parse.User.current() == null){
    window.location.replace("index.html");
  }
  //current user
  $scope.currentUser = JSON.parse(localStorage.getItem('currentPaceUser'));;

  // Date stuff

  //this is temporary for testing ---> must return 41 deliveries for this date
  //var tmpDate = new Date(2016, 3, 13, 0, 0, 0, 0);
  //$scope.currDate = tmpDate;
  $scope.currDate = currDate;
  scopeService.updateCurrDate($scope.currDate);

  $scope.weekday = weekdays;
  $scope.monthNames = months;
  $scope.currDate = currDate;
  $scope.currDate.date = date;
  $scope.currDate.month = month;
  $scope.day = day;

  $scope.showAddPharmacy = false;
  $scope.showAddDriver = false;
  
  if(Parse.User.current().get("isAdmin")){
    $scope.showAddPharmacy = true;
    $scope.showAddDriver = true;
  }
  
  $ionicLoading.show({
    template: 'Loading...'
  });
  ParseService.fetchDrivers()
  .then(function(response) {
     $scope.drivers = response;
     scopeService.updateAlldriversArray(response);
     var allDriversMap = new Map();
     for (var i = 0; i < response.length; i++) { 
      allDriversMap.set(response[i].id,response[i]);
     }
     scopeService.updateAllDriversMap(allDriversMap);
     $ionicLoading.hide();
  });

  $ionicLoading.show({
    template: 'Loading...'
  });
  ParseService.fetchClients()
  .then(function(response) {
     $scope.clients = response;
     scopeService.updateAllClientsArray(response);
     var allClientsMap = new Map();
     for (var i = 0; i < response.length; i++) { 
      allClientsMap.set(response[i].id,response[i]);
     }
     scopeService.updateAllClientsMap(allClientsMap);
     $ionicLoading.hide();
  });

  $scope.viewPharmacy = function(pharmacy, currPharmacyOrdersDetailArray) {
    $scope.currentPharmacy = pharmacy;
    $scope.currPharmacyOrdersDetailArray = currPharmacyOrdersDetailArray;
    scopeService.updatecurrentPharmacy(pharmacy);
    scopeService.updateCurrPharmacyOrdersDetailArray(currPharmacyOrdersDetailArray);
    $state.go("app.viewPharmacy");
  };

  $scope.logout = function (){
    Parse.User.logOut();
    $scope.currentUser = Parse.User.current();
    window.location.replace("index.html");
  }

})

.controller('statsCtrl', function($scope, $state, $ionicActionSheet, $ionicLoading, ParseService, scopeService, $ionicPopup) {
  
  if(Parse.User.current() == null){
    window.location.replace("index.html");
  }

  $scope.title = "Daily Stats";

  $ionicLoading.show({
    template: 'Loading...'
  });
  ParseService.fetchDataForSpecificDate(scopeService.getCurrDate())
  .then(function(response) {
    $scope.deliveries = response;
    var allDeliveriesForTodayMap = new Map();
    for (var i = 0; i < response.length; i++) { 
      allDeliveriesForTodayMap.set(response[i].id,response[i]);
    }
    scopeService.updateAllDeliveriesForTodayMap(allDeliveriesForTodayMap);
    $scope = loadMaps($scope);
    $ionicLoading.hide();
  });

  $scope.isAdmin = Parse.User.current().get("isAdmin");
  if(!$scope.isAdmin){
    //driver user logged in
  }

})

.controller('employeesCtrl', function($scope, $state, $ionicActionSheet, ParseService, scopeService, $ionicPopup, $ionicLoading) {
  if(Parse.User.current() == null){
    window.location.replace("index.html");
  }

  $scope.title = "Employees";
  scopeService.updateEmployeeToEdit(null);
  $scope.allDriversArray = scopeService.getAllDriversArray();
  $scope.allDriversMap = scopeService.getAllDriversMap();

  if($scope.allDriversArray == null || $scope.allDriversMap == null){
    $ionicLoading.show({
      template: 'Loading...'
    });
    ParseService.fetchDrivers()
    .then(function(response) {
       $scope.drivers = response;
       scopeService.updateAlldriversArray(response);
       $scope.allDriversArray = response;
       var allDriversMap = new Map();
       for (var i = 0; i < response.length; i++) { 
        allDriversMap.set(response[i].id,response[i]);
       }
       scopeService.updateAllDriversMap(allDriversMap);
       $scope.allDriversMap = allDriversMap;
       $ionicLoading.hide();
    });
  }

  $scope.addEmployee = function(){
    scopeService.updateClientToEdit(null);
    $state.go("app.addEditEmployee");
  }

  $scope.editEmployee = function(employeeToEdit){
    scopeService.updateEmployeeToEdit(employeeToEdit);
    $state.go("app.addEditEmployee");
  }

})

.controller('clientsCtrl', function($scope, $state, $ionicActionSheet, ParseService, scopeService, $ionicPopup, $ionicLoading) {
  
  if(Parse.User.current() == null){
    window.location.replace("index.html");
  }

  scopeService.updateClientToEdit(null);

  $scope.allClientsArray = scopeService.getAllClientsArray();
  $scope.allClientsMap = scopeService.getAllClientsMap();

  if($scope.allClientsArray == null || $scope.allClientsMap == null){
    $ionicLoading.show({
      template: 'Loading...'
    });
    ParseService.fetchClients()
    .then(function(response) {
       $scope.clients = response;
       scopeService.updateAllClientsArray(response);
       $scope.allClientsArray = response;
       var allClientsMap = new Map();
       for (var i = 0; i < response.length; i++) { 
        allClientsMap.set(response[i].id,response[i]);
       }
       scopeService.updateAllClientsMap(allClientsMap);
       $scope.allClientsMap = allClientsMap;
       $ionicLoading.hide();
    });
  }

  $scope.title = "Clients";

  $scope.addPharmacy = function(){
    scopeService.updateClientToEdit(null);
    $state.go("app.addEditPharmacy");
  }

  $scope.editPharmacy = function(pharmacyToEdit){
    scopeService.updateClientToEdit(pharmacyToEdit);
    $state.go("app.addEditPharmacy");
  }

})


.controller('viewPharmacyCtrl', function($scope, $state, $ionicActionSheet, $ionicLoading, ParseService, scopeService, $ionicPopup) {
  $scope.currentPharmacy = scopeService.getCurrentPharmacy();
  
  $scope.isAdmin = Parse.User.current().get("isAdmin");
  if(!$scope.isAdmin){
    //driver user logged in
  }

  //set UI ng-show flags
  $scope.showPending = false;
  $scope.showInProgress = false;
  $scope.showPickupInProgress = false;
  $scope.showCompleted = false;
  $scope.noPendingOrdersCard = false;
  $scope.noInProgressOrdersCard = false;
  $scope.noPickupInProgressOrdersCard = false;
  $scope.noCompletedOrdersCard = false;
  $scope.details = false;
  $scope.showAssignAllButton = false;

  $scope.loadData = function(){
    $scope.currPharmacyOrdersDetailArray = scopeService.getCurrPharmacyOrdersDetailArray();
    $scope.currDate = scopeService.getCurrDate();
    if($scope.currentPharmacy != null){
      $scope.title = $scope.currentPharmacy.get("pharmacyInfo").get("businessName");
      $ionicLoading.show({template: 'Loading...'});
      ParseService.fetchDataForSpecificDatePharmacy($scope.currDate, $scope.currentPharmacy)
      .then(function(response) {
        $scope.deliveries = response;
        $scope = loadMaps($scope);
        $scope.drivers = scopeService.getAllDriversArray();
        $ionicLoading.hide();
        $scope.title = $scope.pharmacyInfoArray[0].object.get("businessName");
        if($scope.currPharmacyOrdersDetailArray.pending.length > 0){
          $scope.showAssignAllButton = true;
        }             
      });
    }else{
      window.location.replace("home.html");
    }
  }
  $scope.loadData();

  $scope.assignDriver = function(ordersArray){
    scopeService.updateCurrentOrders(ordersArray);
    $state.go("app.assignDriver");
  };

  $scope.assignDriverSingleDelivery = function(order){
    var allDeliveriesForTodayMap = scopeService.getAllDeliveriesForTodayMap();
    var tmpArray = [allDeliveriesForTodayMap.get(order.objectId)];
    scopeService.updateCurrentOrders(tmpArray);
    $state.go("app.viewSingleDelivery");
  }

  $scope.flipShowPending = function(){
    if($scope.currPharmacyOrdersDetailArray.pending.length == 0){
      $scope.noPendingOrdersCard = !$scope.noPendingOrdersCard;
    }else{
      $scope.showPending = !$scope.showPending;
    }
  }

  $scope.flipShowInProgress = function(){
    
    if($scope.currPharmacyOrdersDetailArray.inProgress.length == 0){
      $scope.noInProgressOrdersCard = !$scope.noInProgressOrdersCard;
    }else{
      $scope.showInProgress = !$scope.showInProgress;
    }
  }

  $scope.flipShowPickupInProgress = function(){
    if($scope.currPharmacyOrdersDetailArray.pickupInProgress.length == 0){
      $scope.noPickupInProgressOrdersCard = !$scope.noPickupInProgressOrdersCard;
    }else{
      $scope.showPickupInProgress = !$scope.showPickupInProgress;
    }
  }

  $scope.flipShowCompleted = function(){
    
    if($scope.currPharmacyOrdersDetailArray.completed.length == 0){
      $scope.noCompletedOrdersCard = !$scope.noCompletedOrdersCard;
    }else{
      $scope.showCompleted = !$scope.showCompleted;
    }
  }
  $scope.flipDetails = function(){
    $scope.details = !$scope.details;
  }

  $scope.markAllPicked = function(){
    var customPopup = $ionicPopup.show({
      
      title: 'Confirm Pickup',
      //template: '<input type="password" ng-model="data.wifi">',
      templateUrl: '',
      subTitle: $scope.pharmacyOrdersArray[0].inProgress.length + ' Order(s) picked?',
      scope: $scope,
      
      buttons: [
        { text: 'Cancel',
          type: 'button-assertive'},
        { text: 'Yes', 
          type: 'button-balanced',
          onTap: function(e) {
            scopeService.setOrdersCounter(0);
            $ionicLoading.show({
              template: 'Loading...'
            });
            for(var i=0; i<$scope.pharmacyOrdersArray[0].inProgress.length; i++){
              $scope.pharmacyOrdersArray[0].inProgress[i].set("pickup",true);
              $scope.pharmacyOrdersArray[0].inProgress[i].save(null, {
                success: function(order) {
                  scopeService.setOrdersCounter(scopeService.getOrdersCounter()+1);
                  order.save();
                  if(scopeService.getOrdersCounter() == $scope.pharmacyOrdersArray[0].inProgress.length){
                    $ionicLoading.hide();
                    window.location.replace("home.html");
                  }
                },
                error: function(myObject, error) {
                  alert("error saving the object");
                }
              });
            }
            
          }
        },
      ]
    });
  }

})

.controller('assignDriverCtrl', function($scope, $state, $ionicActionSheet, ParseService, scopeService, $ionicPopup, $ionicLoading) {  

  if(Parse.User.current() == null){
    window.location.replace("index.html");
  }

  $scope.title = "Assign Driver";
  $scope.currentOrders = scopeService.getCurrentOrders();
  $scope.currentPharmacy = scopeService.getCurrentPharmacy();

  if($scope.currentOrders != null){ 
    $ionicLoading.show({template: 'Loading...'});
    ParseService.fetchDrivers()
    .then(function(response) {
      $scope.drivers = response;
      $scope.filterDriverCondition={
        driverSelected: ''
      }
      $scope.showDriverCardDiv = false;
      $ionicLoading.hide();
    });
  }else{
    window.location.replace("home.html");
  }
  $scope.driverSelected = function(){
    $scope.showDriverCardDiv = true;
    $scope.currentDriverSelected = JSON.parse($scope.filterDriverCondition.driverSelected);
    scopeService.updateCurrDriver($scope.currentDriverSelected);
  }

  $scope.assigneDriverFinalize = function(){
    var driver = scopeService.getAllDriversMap().get(scopeService.getCurrDriver().objectId);
    var orders = scopeService.getCurrentOrders();
    scopeService.setOrdersCounter(0);
    $ionicLoading.show({
      template: 'Loading...'
    });
    for(var i=0; i<orders.length; i++){
      
      orders[i].set('driverId',driver);
      orders[i].set('deliveryStatus','In progress');
      orders[i].save(null, {
        success: function(order) {
          order.save();
          scopeService.setOrdersCounter(scopeService.getOrdersCounter()+1);
          if(scopeService.getOrdersCounter() == scopeService.getCurrentOrders().length){
            //send notification here
            notification = {};
            
            notification.type = "notifyDriver";
            notification.params = {};
            notification.params.driver = scopeService.getAllDriversMap().get(scopeService.getCurrDriver().objectId);
            notification.params.orders = scopeService.getCurrentOrders();
            sendNotification(notification, $ionicLoading);
          }
          console.log("save successful");
        },
        error: function(myObject, error) {
          console.log("error saving the object");
        }
      });
    }
    
  }
})

.controller('submitDeliveryCtrl', function($window, $scope, $state, $ionicActionSheet, ParseService, scopeService, $ionicPopup, $ionicLoading) { 
  
  if(Parse.User.current() == null){
    window.location.replace("index.html");
  }

  $scope.title = "Submit Order";
  $scope.currentOrders = scopeService.getCurrentOrders();
  $scope.currentPharmacy = scopeService.getCurrentPharmacy();

  $scope.submitData = {};

  $scope.window = {};
  $scope.window.height = $window.innerHeight*(0.7);
  $scope.window.width = $window.innerWidth;
  
  $scope.showComments = false;

  //signature pad stuff
  var canvas = document.getElementById('signatureCanvas');
  var signaturePad = new SignaturePad(canvas);

  $scope.clearCanvas = function() {
      signaturePad.clear();
  }

  $scope.saveCanvas = function() {
      var sigImg = signaturePad.toDataURL();
      $scope.signature = sigImg;
      if(signaturePad.isEmpty()){
        alert("please collect signature before submission");
      }else{
        var timeStamp = new Date();
        $scope.currentOrders[0].set("deliveryStatus", "Completed");
        $scope.currentOrders[0].set("patientSignature", $scope.signature);
        $scope.currentOrders[0].set("patientSignatureTimeStamp",timeStamp);
        $scope.currentOrders[0].set("driverComment", $scope.submitData.comment);
        $scope.currentOrders[0].save(null, {
          success: function(order) {
            console.log("save successful");
            window.location.replace("home.html");
          },
          error: function(myObject, error) {
            alert("error saving the object");
            window.location.replace("home.html");
          }
        });
      }
  }

  $scope.flipShowComments = function(){
    $scope.showComments = !$scope.showComments;
  }

  if($scope.currentOrders == null){
     window.location.replace("home.html");
  }

})


.controller('viewSingleDeliveryCtrl', function($window, $scope, $state, $ionicActionSheet, ParseService, scopeService, $ionicPopup, $ionicLoading) { 
  
  if(Parse.User.current() == null){
    window.location.replace("index.html");
  }

  $scope.isAdmin = Parse.User.current().get("isAdmin");

  $scope.title = "Order Details";
  $scope.currentAvatar = "img/blackwidow.jpg";
  $scope.currentOrders = scopeService.getCurrentOrders();
  $scope.currentPharmacy = scopeService.getCurrentPharmacy();

  $scope.filterDriverCondition={
    driverSelected: ''
  }
  $scope.showDriverCardDiv = false;
  $scope.showPharmacyInfo = false;

  $scope.showDriver = false;
  $scope.showSignature = false;
  $scope.isCompleted = false;
  $scope.isInProgress = false;
  $scope.isPending = false;
  $scope.showDriverSelector = false;
  $scope.deliveryStatusColor = "assertive"
  $scope.completeDeliveryButton = false;
  $scope.showPatientInfo = false;

  $scope.submitDelivery = function(){
    $state.go("app.submitDelivery");
  }

  $scope.flipShowPatientInfo = function(){
    $scope.showPatientInfo = !$scope.showPatientInfo;
  }

  $scope.flipShowPharmacyInfo = function(){
    $scope.showPharmacyInfo = !$scope.showPharmacyInfo;
  }

  $scope.flipShowDriverInfo = function(){
    $scope.showDriverInfo = !$scope.showDriverInfo;
  }

  if($scope.currentOrders != null){ 
    $scope.cost = $scope.currentOrders[0].get("cost");

    var deliveryDate = new Date($scope.currentOrders[0].get("deliveryDate"));
    var deliveryDateYear = deliveryDate.getYear()+1900;

    $scope.deliveryDate = deliveryDate.getDate() + " " + months[deliveryDate.getMonth()] + " " + deliveryDateYear;

    $scope.noShow = $scope.currentOrders[0].get("noShow");
    $scope.patient = $scope.currentOrders[0].get("patientId");
    $scope.distanceFromPharmacy = $scope.patient.get("distanceFromPharmacy");
    $scope.pharmacyInfo = $scope.currentOrders[0].get("pharmacyID").get("pharmacyInfo");

    if($scope.cost == undefined){
      checkCost($scope.currentOrders[0]);
    }

    if($scope.currentOrders[0].get("driverId") != undefined){
      $scope.showDriver = true;
    }

    if($scope.currentOrders[0].get("deliveryStatus") == "pending"){
      $scope.deliveryStatusColor = "assertive"
      $scope.isPending = true;
      $scope.showSignature = false;
      $scope.showDriverSelector = true;;
    } 

    if($scope.currentOrders[0].get("deliveryStatus") == "In progress"){
      $scope.deliveryStatusColor = "energized"
      $scope.isInProgress = true;
      $scope.showSignature = false;
      $scope.showDriverSelector = false;
      $scope.completeDeliveryButton = true;
    }

    if($scope.currentOrders[0].get("deliveryStatus") == "Completed"){
      $scope.deliveryStatusColor = "balanced"
      $scope.isCompleted = true;
      $scope.showSignature = true;
      $scope.signatureImage = $scope.currentOrders[0].get("patientSignature");
      $scope.signatureTimeStamp = $scope.currentOrders[0].get("patientSignatureTimeStamp");
      $scope.showDriverSelector = false;
    }

  }else{
    window.location.replace("home.html");
  }

  $scope.driverSelected = function(){
    $scope.showDriverCardDiv = true;
    $scope.currentDriverSelected = JSON.parse($scope.filterDriverCondition.driverSelected);
    scopeService.updateCurrDriver($scope.currentDriverSelected); 
  }
  $scope.assigneDriverFinalize = function(){
    var driver = scopeService.getAllDriversMap().get(scopeService.getCurrDriver().objectId);
    var orders = scopeService.getCurrentOrders();
    
    $ionicLoading.show({
      template: 'Loading...'
    });
    scopeService.setOrdersCounter(0);
    for(var i=0; i<orders.length; i++){
      
      scopeService.getCurrentOrders()[i].set('driverId',driver);
      scopeService.getCurrentOrders()[i].set('deliveryStatus','In progress');
      scopeService.getCurrentOrders()[i].save(null, {
        success: function(order) {
          scopeService.setOrdersCounter(scopeService.getOrdersCounter()+1);
          order.save();
          if(scopeService.getOrdersCounter() == scopeService.getCurrentOrders().length){
            //send notification here
            notification = {};
            notification.type = "notifyDriver";
            notification.params = {};
            notification.params.driver = scopeService.getAllDriversMap().get(scopeService.getCurrDriver().objectId);
            notification.params.orders = scopeService.getCurrentOrders();
            sendNotification(notification, $ionicLoading);
          }
        },
        error: function(myObject, error) {
          alert("error saving the object");
        }
      });
    }    
  }

  $scope.editPatient = function(){
    $scope.currentOrders[0].get("patientId");
    $scope.data = {};
    $scope.data.phone =  $scope.currentOrders[0].get("patientId").get("telephone");
    $scope.data.address =  $scope.currentOrders[0].get("patientId").get("address");
    $scope.data.cost =  $scope.currentOrders[0].get("patientId").get("cost");
    $scope.data.distance =  $scope.currentOrders[0].get("patientId").get("distanceFromPharmacy");

    var customPopup = $ionicPopup.show({
      
      title: 'Edit Patient Information',
      //template: '<input type="password" ng-model="data.wifi">',
      templateUrl: 'templates/editPatientPopup.html',
      subTitle: 'Please tap save when done',
      scope: $scope,
      
      buttons: [
        { text: 'Cancel',
          type: 'button-assertive'},
        { text: 'Save', 
          type: 'button-balanced',
          onTap: function(e) {
            if (!$scope.data.phone || !$scope.data.address || !$scope.data.cost || !$scope.data.distance) {
              // Don't allow the user to close unless they enter all fields.
              e.preventDefault();
            } else {
              $scope.currentOrders[0].get("patientId").set("telephone",$scope.data.phone);
              $scope.currentOrders[0].get("patientId").set("address",$scope.data.address);
              $scope.currentOrders[0].get("patientId").set("cost",$scope.data.cost);
              $scope.currentOrders[0].get("patientId").set("distanceFromPharmacy",$scope.data.distance);
              $scope.currentOrders[0].save(null, {
                success: function(order) {
                  console.log("save successful");
                  //also update the cost of this order accordingly
                  $scope.currentOrders[0].set("cost",$scope.data.cost);
                  $scope.currentOrders[0].save(null, {
                    success: function(order) {
                      console.log("save successful");
                      return true;
                    },
                    error: function(myObject, error) {
                      alert("error saving the object");
                    }
                  });
                },
                error: function(myObject, error) {
                  alert("error saving the object");
                }
              });
            }
          }
        },
      ]
      
    });
      
      customPopup.then(function(res) {
        //console.log('Tapped!', res);
      });
  }

})
  
.controller('addEditClientCtrl', function($scope, $state, $ionicActionSheet, ParseService, scopeService, $ionicPopup, $ionicLoading) {
  
  if(Parse.User.current() == null){
    window.location.replace("index.html");
  }
  $scope.title = "Add pharmacy";
  $scope.editMode = false;

  if(scopeService.getClientToEdit() != null){
    $scope.title = "Edit ";
    $scope.editMode = true;
    var clientId = scopeService.getClientToEdit().objectId;
    scopeService.updateClientToEdit( scopeService.getAllClientsMap().get(clientId));
    $scope.clientToEdit = scopeService.getAllClientsMap().get(clientId);
  }
  

  //set UI ng-show flags
  $scope.showClientInfo = false;
  $scope.showPickupTimes = false;
  $scope.showContactDetails = false;
  $scope.showCities = false;
  $scope.showLoginInfo = false;

  $scope.values=  ["0500","0515","0530","0545","0600","0615","0630","0645","0700","0715","0730","0745","0800","0815","0830","0845","0900","0915","0930","0945","1000","1015","1030","1045","1100","1115","1130","1145","1200","1215","1230","1245","1300","1315","1330","1345","1400","1415","1430","1445","1500","1515","1530","1545","1600","1615","1630","1645","1700","1715","1730","1745","1800","1815","1830","1845","1900","1915","1930","1945","2000","2015","2030","2045","2100","2115","2130","2145","2200","2215","2230","2245"];
  $scope.cities = ["Ajax","Aurora","Brampton","Brock","Burlington","Caledon","Clarington","East Gwillimbury","Etobicoke","Georgina","Georgetown","Halton Hills","King","Markham","Milton","Mississauga","Newmarket", "North York", "Oakville","Oshawa","Pickering","Richmond","Richmond Hill","Scarborough","Scugog","Toronto","Uxbridge","Vaughan","Whitby","Whitchurch-Stouffville","Woodbridge"];

  $scope.itemName = "";
  $scope.itemAmount = {};
  $scope.name="";
  $scope.priceRates = [];
  
  $scope.submitData = {};

  if($scope.editMode){
    if(!($scope.clientToEdit.get("businessName") == undefined || $scope.clientToEdit.get("businessName") == "undefined")){
      $scope.submitData.bName = $scope.clientToEdit.get("businessName");
    }
    
    if(!($scope.clientToEdit.get("ownerName") == undefined || $scope.clientToEdit.get("ownerName") == "undefined")){
      $scope.submitData.oName = $scope.clientToEdit.get("ownerName");
    }
    
    if(!($scope.clientToEdit.get("businessAddress") == undefined || $scope.clientToEdit.get("businessAddress") == "undefined")){
      $scope.submitData.bAddress = $scope.clientToEdit.get("businessAddress");
    }
    
    if(!($scope.clientToEdit.get("businessNumber") == undefined || $scope.clientToEdit.get("businessNumber") == "undefined")){
      $scope.submitData.bNumber = Number($scope.clientToEdit.get("businessNumber"));
    }

    if(!($scope.clientToEdit.get("otherNumber") == undefined || $scope.clientToEdit.get("otherNumber") == "undefined")){
      $scope.submitData.oNumber = Number($scope.clientToEdit.get("otherNumber"));
    }

    if(!($scope.clientToEdit.get("fax") == undefined || $scope.clientToEdit.get("fax") == "undefined")){
      $scope.submitData.fax = Number($scope.clientToEdit.get("fax"));
    }

    if(!($scope.clientToEdit.get("email") == undefined || $scope.clientToEdit.get("email") == "undefined")){
      $scope.submitData.email = $scope.clientToEdit.get("email");
    }

    if(!($scope.clientToEdit.get("userName") == undefined || $scope.clientToEdit.get("userName") == "undefined")){
      $scope.submitData.username = $scope.clientToEdit.get("userName");
    }

    if(!($scope.clientToEdit.get("password") == undefined || $scope.clientToEdit.get("password") == "undefined")){
      $scope.submitData.password = $scope.clientToEdit.get("password");
      $scope.submitData.rePassword = $scope.clientToEdit.get("password");
    }

    if(!($scope.clientToEdit.get("pickupTimes") == undefined || $scope.clientToEdit.get("pickupTimes") == "undefined")){
      $scope.submitData.selectedValues = $scope.clientToEdit.get("pickupTimes");
    }

    if(!($scope.clientToEdit.get("pricing") == undefined || $scope.clientToEdit.get("pricing") == "undefined")){
      for(var i=0; i< JSON.parse($scope.clientToEdit.get("pricing")).cities.length; i++){
        JSON.parse($scope.clientToEdit.get("pricing")).cities[i];
        $scope.priceRates.push({
          under10Km: JSON.parse($scope.clientToEdit.get("pricing")).cities[i].rates[0],
          over10Km: JSON.parse($scope.clientToEdit.get("pricing")).cities[i].rates[1],
          over20Km: JSON.parse($scope.clientToEdit.get("pricing")).cities[i].rates[2],
          name: JSON.parse($scope.clientToEdit.get("pricing")).cities[i].name
        });
      }
      
    }
    
  }

  $scope.savePharmacy = function(){
    $scope.clientToEdit.set("businessName",$scope.submitData.bName);
    $scope.clientToEdit.set("ownerName",$scope.submitData.oName);
    $scope.clientToEdit.set("businessAddress",$scope.submitData.bAddress);
    $scope.clientToEdit.set("businessNumber",String($scope.submitData.bNumber));
    $scope.clientToEdit.set("otherNumber",String($scope.submitData.oNumber));
    $scope.clientToEdit.set("fax",String($scope.submitData.fax));
    $scope.clientToEdit.set("email",$scope.submitData.email);;
    $scope.clientToEdit.set("userName",$scope.submitData.username);
    $scope.clientToEdit.set("password",$scope.submitData.password);
    $scope.clientToEdit.set("pickupTimes",$scope.submitData.selectedValues);
    
    var pricing = '{ "cities" : [ ';
    
    for(var i=0; i < $scope.priceRates.length; i++){
      var city = $scope.priceRates[i].name;
      var under10 = $scope.priceRates[i].under10Km;
      var over10 = $scope.priceRates[i].over10Km;
      var over20 = $scope.priceRates[i].over20Km;
      pricing += '{"name" : "'+city+'", "rates" : ['+under10+','+over10+','+over20+']},';
    }
    
    pricing = pricing.substring(0, pricing.length-1);
    pricing += ']}';

    $scope.clientToEdit.set("pricing",pricing);
    $scope.clientToEdit.save(null, {
      success: function(order) {
        console.log("save successful");
        $state.go("app.clients");
      },
      error: function(myObject, error) {
        alert("error saving the object");
      }
    });
    
  }

  $scope.flipShowClientInfo = function(){
    $scope.showClientInfo = !$scope.showClientInfo;
  }

  $scope.flipShowPickupTimes = function(){
    $scope.showPickupTimes = !$scope.showPickupTimes;
  }

  $scope.flipShowContactDetails = function(){
    $scope.showContactDetails = !$scope.showContactDetails;
  }

  $scope.flipShowCities = function(){
    $scope.showCities = !$scope.showCities;
  }

  $scope.flipShowLoginInfo = function(){
    $scope.showLoginInfo = !$scope.showLoginInfo;
  }

  $scope.removeItem = function (index) {
    $scope.priceRates.splice(index, 1);
  };

  $scope.addItem = function (itemAmount, itemName) {
    if(itemAmount.under10Km == undefined || itemAmount.over10Km == undefined || itemAmount.over20Km == undefined || itemName == ""){
      alert("Please enter the amount/city and then press add.");
    }else{
     $scope.priceRates.push({
        under10Km: itemAmount.under10Km,
        over10Km: itemAmount.over10Km,
        over20Km: itemAmount.over20Km,
        name: itemName
      });
      $scope.itemAmount = '';
      itemAmount = '';
    }
  };

  $scope.signUpPharmacy =function (){
    var pricing = '{ "cities" : [ ';
    
    for(var i=0; i < $scope.priceRates.length; i++){
      var city = $scope.priceRates[i].name;
      var under10 = $scope.priceRates[i].under10Km;
      var over10 = $scope.priceRates[i].over10Km;
      pricing += '{"name" : "'+city+'", "rates" : ['+under10+','+over10+','+over20+']},';
    }
    
    pricing = pricing.substring(0, pricing.length-1);
    pricing += ']}';

    var pickupTimesArray = $scope.submitData.selectedValues;      
    $ionicLoading.show({
      template: 'Loading...'
    });
    Parse.Cloud.run('createNewPharmacyAccount', { businessName: $scope.submitData.bName, ownerName: $scope.submitData.oName, businessAddress: $scope.submitData.bAddress, businessNumber: String($scope.submitData.bNumber), otherNumber: String($scope.submitData.oNumber), fax: String($scope.submitData.fax), email: $scope.submitData.email, contactMode: "phone", employee1: "employee1", employee2: "employee2", employee3: "employee3", userName: $scope.submitData.username, password: $scope.submitData.password, priceRate: pricing, pickupTimesArray: pickupTimesArray }, {
      success: function(result) {
        $scope.submitData = {};
        $scope.priceRates = [];
        $scope.showSuccessAlert();
        $ionicLoading.hide();
        window.location.replace("home.html");
      },
      error: function(error) {
        $scope.showFailAlert(error);
        $ionicLoading.hide();
      }
    });
   
  }

  $scope.showSuccessAlert = function() {
    var alertPopup = $ionicPopup.alert({
        title: "Success!",
        template: "Pharmacy SignUp Successful",
        okText: "Ok",
        okType: "button-assertive"
    });  
  };

  $scope.showFailAlert = function(error) {
    var alertPopup = $ionicPopup.alert({
        title: "Fail!",
        template: error.message.message,
        okText: "Ok",
        okType: "button-assertive"
    });  
  };

})

.controller('addEditEmployeeCtrl', function($scope, $state, $ionicActionSheet, ParseService, scopeService, $ionicPopup, $ionicLoading) {
  
  if(Parse.User.current() == null){
    window.location.replace("index.html");
  }

  $scope.title = "Add Employee";

  $scope.editMode = false;

  if(scopeService.getEmployeeToEdit() != null){
    $scope.title = "Edit ";
    $scope.editMode = true;
    var employeeId = scopeService.getEmployeeToEdit().objectId;
    scopeService.updateEmployeeToEdit( scopeService.getAllDriversMap().get(employeeId));
    $scope.employeeToEdit = scopeService.getAllDriversMap().get(employeeId);
  }

  //set UI ng-show flags
  $scope.showPersonalInfo = false;
  $scope.showContactInfo = false;
  $scope.showAddressInfo = false;
  $scope.showLoginInfo = false;

  $scope.submitData = {};

  if($scope.editMode){
    if(!($scope.employeeToEdit.get("firstName") == undefined || $scope.employeeToEdit.get("firstName") == "undefined")){
      $scope.submitData.fName = $scope.employeeToEdit.get("firstName");
    }
    if(!($scope.employeeToEdit.get("lastName") == undefined || $scope.employeeToEdit.get("lastName") == "undefined")){
      $scope.submitData.lName = $scope.employeeToEdit.get("lastName");
    }
    if(!($scope.employeeToEdit.get("DOB") == undefined || $scope.employeeToEdit.get("DOB") == "undefined")){
      $scope.submitData.dob = $scope.employeeToEdit.get("DOB");
    }
    if(!($scope.employeeToEdit.get("driverSIN") == undefined || $scope.employeeToEdit.get("driverSIN") == "undefined")){
      $scope.submitData.sin = Number($scope.employeeToEdit.get("driverSIN"));
    }
    if(!($scope.employeeToEdit.get("driverLicense") == undefined || $scope.employeeToEdit.get("driverLicense") == "undefined")){
      $scope.submitData.license = $scope.employeeToEdit.get("driverLicense");
    }
    if(!($scope.employeeToEdit.get("email") == undefined || $scope.employeeToEdit.get("email") == "undefined")){
      $scope.submitData.email = $scope.employeeToEdit.get("email");
    }
    if(!($scope.employeeToEdit.get("driverMobile") == undefined || $scope.employeeToEdit.get("driverMobile") == "undefined")){
      $scope.submitData.phone = Number($scope.employeeToEdit.get("driverMobile"));
    }
    if(!($scope.employeeToEdit.get("driverAddressUnit") == undefined || $scope.employeeToEdit.get("driverAddressUnit") == "undefined")){
      $scope.submitData.unit = $scope.employeeToEdit.get("driverAddressUnit");
    }
    if(!($scope.employeeToEdit.get("driverStreetAddress") == undefined || $scope.employeeToEdit.get("driverStreetAddress") == "undefined")){
      $scope.submitData.streetAddress = $scope.employeeToEdit.get("driverStreetAddress");
    }
    if(!($scope.employeeToEdit.get("driverAddressCity") == undefined || $scope.employeeToEdit.get("driverAddressCity") == "undefined")){
      $scope.submitData.city = $scope.employeeToEdit.get("driverAddressCity");
    }
    if(!($scope.employeeToEdit.get("driverAddressState") == undefined || $scope.employeeToEdit.get("driverAddressState") == "undefined")){
      $scope.submitData.state = $scope.employeeToEdit.get("driverAddressState");
    }
    if(!($scope.employeeToEdit.get("driverAddressPostalCode") == undefined || $scope.employeeToEdit.get("driverAddressPostalCode") == "undefined")){
      $scope.submitData.postalCode = $scope.employeeToEdit.get("driverAddressPostalCode");
    }

    if(!($scope.employeeToEdit.get("username") == undefined || $scope.employeeToEdit.get("username") == "undefined")){
      $scope.submitData.username = $scope.employeeToEdit.get("username");
    }
    if(!($scope.employeeToEdit.get("password") == undefined || $scope.employeeToEdit.get("password") == "undefined")){
      $scope.submitData.password = $scope.employeeToEdit.get("password");
      $scope.submitData.rePassword = $scope.employeeToEdit.get("password");
    }
  }

  $scope.saveEmployee = function(){
    $scope.employeeToEdit.set("firstName",$scope.submitData.fName);
    $scope.employeeToEdit.set("lastName",$scope.submitData.lName);
    $scope.employeeToEdit.set("DOB",$scope.submitData.dob);
    $scope.employeeToEdit.set("driverSIN",String($scope.submitData.sin));
    $scope.employeeToEdit.set("driverLicense",$scope.submitData.license);
    $scope.employeeToEdit.set("email",$scope.submitData.email);
    $scope.employeeToEdit.set("driverMobile",String($scope.submitData.phone));
    $scope.employeeToEdit.set("driverAddressUnit",$scope.submitData.unit);
    $scope.employeeToEdit.set("driverStreetAddress",$scope.submitData.streetAddress);
    $scope.employeeToEdit.set("driverAddressCity",$scope.submitData.city);
    $scope.employeeToEdit.set("driverAddressState",$scope.submitData.state);
    $scope.employeeToEdit.set("driverAddressPostalCode",$scope.submitData.postalCode);
    $scope.employeeToEdit.set("username",$scope.submitData.username);
    $scope.employeeToEdit.set("password",$scope.submitData.password);
    $scope.employeeToEdit.save(null, {
      success: function(order) {
        console.log("save successful");
        $state.go("app.employees");
      },
      error: function(myObject, error) {
        alert("error saving the object");
      }
    });
  }

  $scope.flipShowPersonalInfo = function(){
    $scope.showPersonalInfo = !$scope.showPersonalInfo;
  }

  $scope.flipShowContactInfo = function(){
    $scope.showContactInfo = !$scope.showContactInfo;
  }

  $scope.flipShowAddressInfo = function(){
    $scope.showAddressInfo = !$scope.showAddressInfo;
  }

  $scope.flipShowLoginInfo = function(){
    $scope.showLoginInfo = !$scope.showLoginInfo;
  }

  $scope.signUpDriver = function(){
    console.log($scope.submitData);
    $ionicLoading.show({
      template: 'Loading...'
    });
    //cloud code call
    Parse.Cloud.run('createNewDriverAccount', { driverFirstName: $scope.submitData.fName, driverLastName: $scope.submitData.lName, driverDOB: $scope.submitData.dob, 
            driverSIN: String($scope.submitData.sin), driverLicense: $scope.submitData.license, driverEmail: $scope.submitData.email, driverMobile: String($scope.submitData.phone), driverAddressUnit: $scope.submitData.unit, 
                driverStreetAddress: $scope.submitData.streetAddress, driverAddressCity: $scope.submitData.city, driverAddressState: $scope.submitData.state, 
                driverAddressPostalCode: $scope.submitData.postalCode, driverUserName: $scope.submitData.username, driverPassword: $scope.submitData.password }, {
      success: function(result) {
        $scope.submitData = {};
        $scope.showSuccessAlert();
        $ionicLoading.hide();
        window.location.replace("home.html");
      },
      error: function(error) {
        $scope.showFailAlert(error);
        $ionicLoading.hide();
      }
    });

    $ionicLoading.hide();
  }

  $scope.showSuccessAlert = function() {
    var alertPopup = $ionicPopup.alert({
        title: "Success!",
        template: "Driver SignUp Successful",
        okText: "Ok",
        okType: "button-assertive"
    });  
  };

  $scope.showFailAlert = function(error) {
    var alertPopup = $ionicPopup.alert({
        title: "Fail!",
        template: error.message.message,
        okText: "Ok",
        okType: "button-assertive"
    });  
  };

})

function loadMaps($scope){
  
  var deliveries = $scope.deliveries;

  var pharmacyInfoMap = new Map();
  var pharmacyInfoArray = [], pharmacyUserItem;
  var pharmacyUserMap = new Map();
  var pharmacyUserArray = [], pharmacyInfoItem;
  var pharmacyOrdersMap = new Map();
  var pharmacyOrdersArray = [], pharmacyInfoItem;

  var totalPending = [0,0];
  var totalPickupInProgress = [0,0];
  var totalInProgress = [0,0];
  var totalCompleted = [0,0];
  
  var driverMap = new Map();
  var patientMap = new Map();

  for (var i = 0; i < deliveries.length; i++) {

      //required for backwards integration
      checkCost(deliveries[i]);

      pharmacyInfoMap.set(deliveries[i].get("pharmacyID").id, deliveries[i].get("pharmacyID").get("pharmacyInfo"));
      pharmacyUserMap.set(deliveries[i].get("pharmacyID").id, deliveries[i].get("pharmacyID"));

      if(deliveries[i].get("driverId") != undefined){
        driverMap.set(deliveries[i].get("driverId").id, deliveries[i].get("driverId"));
      }

      if(deliveries[i].get("patientId") != undefined){
        patientMap.set(deliveries[i].get("patientId").id, deliveries[i].get("patientId"));
      }

      if(pharmacyOrdersMap.get(deliveries[i].get("pharmacyID").id) == undefined){
        pharmacyOrdersMap.set(deliveries[i].get("pharmacyID").id, [deliveries[i]]);
      }else{
        var tempValue = pharmacyOrdersMap.get(deliveries[i].get("pharmacyID").id);
        tempValue.push(deliveries[i]);
        pharmacyOrdersMap.set(deliveries[i].get("pharmacyID").id, tempValue);
      }

      if(deliveries[i].get("deliveryStatus") == "pending"){
        totalPending[0]++;
        totalPending[1] += deliveries[i].get("cost");
      }
      if(deliveries[i].get("deliveryStatus") == "In progress"){
        if(deliveries[i].get("pickup")){
          totalPickupInProgress[0]++;
          totalPickupInProgress[1] += deliveries[i].get("cost");
        }else{
          totalInProgress[0]++;
          totalInProgress[1] += deliveries[i].get("cost");
        }
      }
      if(deliveries[i].get("deliveryStatus") == "Completed"){
        totalCompleted[0]++;
        totalCompleted[1] += deliveries[i].get("cost");
      }

  }
  pharmacyInfoMap.forEach(function (item, key, mapObj) {
      pharmacyUserItem = {};
      pharmacyUserItem.id = key;
      pharmacyUserItem.object = item;
      pharmacyInfoArray.push(pharmacyUserItem);
  });
  pharmacyOrdersMap.forEach(function (item, key, mapObj) {
      pharmacyInfoItem = {};
      pharmacyInfoItem.id = key;
      pharmacyInfoItem.object = item;

      pharmacyInfoItem.pending = [];
      pharmacyInfoItem.pickupInProgress = [];
      pharmacyInfoItem.inProgress = [];
      pharmacyInfoItem.completed = [];
      
      pharmacyInfoItem.totalCost = 0;

      pharmacyInfoItem.under10Km = [0,0];
      pharmacyInfoItem.under20Km = [0,0];
      pharmacyInfoItem.under30Km = [0,0];
      pharmacyInfoItem.over30Km = [0,0];


      for(var x=0; x<item.length; x++){
        
        //update cost
        pharmacyInfoItem.totalCost += item[x].get("cost");

        //update distance counter
        var distanceFromPharmacy = item[x].get("patientId").get("distanceFromPharmacy");
        if(distanceFromPharmacy < 10){
          pharmacyInfoItem.under10Km[0]++;
          pharmacyInfoItem.under10Km[1] += item[x].get("cost");
        }else if(distanceFromPharmacy < 20){
          pharmacyInfoItem.under20Km[0]++;
          pharmacyInfoItem.under20Km[1] += item[x].get("cost");
        }else if(distanceFromPharmacy < 30){
          pharmacyInfoItem.under30Km[0]++;
          pharmacyInfoItem.under30Km[1] += item[x].get("cost");
        }else if(distanceFromPharmacy > 29){
          pharmacyInfoItem.over30Km[0]++;
          pharmacyInfoItem.over30Km[1] += item[x].get("cost");
        }

        if(item[x].get("deliveryStatus") == "pending"){
          pharmacyInfoItem.pending.push(item[x]);
        }
        if(item[x].get("deliveryStatus") == "In progress"){
          if(item[x].get("pickup")){
            pharmacyInfoItem.pickupInProgress.push(item[x]);
          }else{
            pharmacyInfoItem.inProgress.push(item[x]);
          }
        }
        if(item[x].get("deliveryStatus") == "Completed"){
          pharmacyInfoItem.completed.push(item[x]);
        }
      }
      
      pharmacyOrdersArray.push(pharmacyInfoItem);
  });

  $scope.pharmacyInfoArray = pharmacyInfoArray;
  $scope.pharmacyInfoMap = pharmacyInfoMap;
  $scope.pharmacyOrdersArray = pharmacyOrdersArray;
  $scope.pharmacyOrdersMap = pharmacyOrdersMap;
  $scope.pharmacyUserMap = pharmacyUserMap;
  $scope.activeDriversMap = driverMap;
  $scope.patientsMap = patientMap;

  $scope.totalPending = totalPending;
  $scope.totalInProgress = totalInProgress;
  $scope.totalCompleted = totalCompleted;
  $scope.totalPickupInProgress = totalPickupInProgress;

  return $scope;
}

// function loadMap (){
//   var myLatlng = new google.maps.LatLng(37.3000, -120.4833);

//   var mapOptions = {
//       center: myLatlng,
//       zoom: 16,
//       mapTypeId: google.maps.MapTypeId.ROADMAP
//   };

//   var map = new google.maps.Map(document.getElementById("map"), mapOptions);

//   navigator.geolocation.getCurrentPosition(function(pos) {
//       map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
//       var myLocation = new google.maps.Marker({
//           position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
//           map: map,
//           title: "My Location"
//       });
//   });
// }

function checkCost(order){
  if(order.get("cost") == undefined){
    var cost = order.get("cost");
    var deliveryDate = order.get("deliveryDate");
    var patient = order.get("patientId");
    var distanceFromPharmacy = patient.get("distanceFromPharmacy");
    var pharmacyInfo = order.get("pharmacyID").get("pharmacyInfo");

    if(distanceFromPharmacy < 10){
      cost = ( pharmacyInfo.get("priceRate"));
    }else if(distanceFromPharmacy < 20){
      cost = ( pharmacyInfo.get("priceRateOver10Km"));
    }else if(distanceFromPharmacy < 30){
      cost = ( pharmacyInfo.get("priceRateOver20Km"));
    }else if(distanceFromPharmacy > 29){
      cost = ( pharmacyInfo.get("priceRateOver30Km"));
    }

    if(order.get("noShow") == true && order.get("numberOfNoShows") != undefined){
      cost = cost * order.get("numberOfNoShows");
    }
    order.set("cost",cost);
    order.save(null, {
      success: function(order) {
        console.log("save successful");
      },
      error: function(myObject, error) {
        alert("error saving the object");
      }
    });
  }
}

function sendNotification(notification, ionicLoading){
  switch (notification.type) {
    case 'notifyDriver':
        notifyDriver(notification.params, ionicLoading);
        break;
    case 'someOtherFunction':
        notifyDriver(notification.params);
        break;
  }

}

//notification functions

function notifyDriver(params, ionicLoading){

  Parse.Cloud.run('notifyDriver', { params: JSON.stringify(params)}, {
    success: function(result) {
      var jsonResult = JSON.stringify(result);
      var start = new Date().getTime();
      var end = start;
      while(end < start + 3500) {
        end = new Date().getTime();
      }
      ionicLoading.hide();
      window.location.replace("home.html");
    },
    error: function(error) {
      var jsonResult = JSON.stringify(error);
    }
  });
}

function someOtherFunction(params){}

function updateLocal (){

}