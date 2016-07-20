/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

function panelButtonClick(){
    console.log("panel button pressed");
}

function login() {
    $('div.ui-loader').show();
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if (username && password) {
        Parse.User.logIn(username, password , {
          success: function(user) {
            var objectString = JSON.stringify(user);
            saveUserInfoToLocalDB(user.id);
            $('div.ui-loader').hide();
            window.location = 'homePage.html';
          },
          error: function(user, error) {
            // The login failed. Check error to see why.
            $('div.ui-loader').hide();
            console.log("login unsuccessful");
            $( "#dlg-invalid-credentials" ).popup("open");
            //alert("Error: " + error.code + " " + error.message);
          }
        });
    }
    else {
        $('div.ui-loader').hide();
        $( "#dlg-invalid-credentials" ).popup("open");
        // alert("Please enter your username and password.");
    }
}

function logout() {
    Parse.User.logOut();
    localStorage.setItem("isLoggedIn", false);
    closePanel();
    window.location = 'index.html';
}

function closePanel(){
    $.mobile.activePage.find('#mypanel').panel().panel("close");
}

$(document).ready ( function(){
    if(localStorage.getItem("isLoggedIn")){
        $("#current_username").empty();
        $("#current_username").append(localStorage.getItem("userName").toUpperCase());
        refreshSync();
    }
});

function saveUserInfoToLocalDB(userId){
    localStorage.setItem("isLoggedIn", true);
    
    var currentUser = Parse.User.current();
    var objectString = JSON.stringify(currentUser);
    var jsonUserData = JSON.parse(objectString);
    localStorage.setItem("userName", jsonUserData.username);
}

function refreshSync(){
    //localStorage.clear();
    // search the parse website for new deliveries and update the local db and the UI
    var Orders = Parse.Object.extend("Orders");
    var OrdersQuery = new Parse.Query(Orders);
    var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    var dayNames = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth();
    var year = d.getFullYear();
    var today = new Date(year, month, day, 0, 0, 0, 0);

    //pharmacy set objects 
    var pharmaciesObj = {};
    var myDeliveriesPharmacyObj = {};
    var myNoShowsPharmacyObj = {};

    //array with order id's 
    var myPickups = [];
    var myDeliveries = [];
    var myDropoffs = [];
    var myNoShows = [];
    
    OrdersQuery.equalTo("deliveryDate", today);
    OrdersQuery.include("pharmacyID");
    OrdersQuery.include("patientId");
    OrdersQuery.include("pharmacyID.pharmacyInfo");
    OrdersQuery.include("driverId");
    OrdersQuery.include("driverId.driverUser");
    //OrdersQuery.equalTo("driverId", Parse.User.current().get("driverId"));

    OrdersQuery.find({
        success: function(results){
            for (var i = 0; i < results.length; i++) {
                if(results[0].get("driverId") != undefined && results[0].get("driverId").id == Parse.User.current().get("driverInfo").id){
                    if(results[i].get("deliveryStatus") == 'pending' ){
                        myPickups.push(results[i].id);
                        //store the order object into local DB
                        localStorage.setItem(results[i].id, JSON.stringify(results[i]) );
                        //store the pharmacyID and pharmacyID.pharmacyInfo of the order objects into local DB
                        localStorage.setItem(results[i].get("pharmacyID").id, JSON.stringify(results[i].get("pharmacyID")));
                        localStorage.setItem(results[i].get("pharmacyID").get("pharmacyInfo").id, JSON.stringify(results[i].get("pharmacyID").get("pharmacyInfo")));                        
                        pharmaciesObj[results[i].get("pharmacyID").get("pharmacyInfo").id] = true;
                        //store the patientId  of the the ordre object into local DB
                        localStorage.setItem(results[i].get("patientId").id, JSON.stringify(results[i].get("patientId")));
                    }
                    else if(results[i].get("deliveryStatus") == 'In progress'){
                        myDeliveries.push(results[i].id);
                        localStorage.setItem(results[i].id, JSON.stringify(results[i]) );
                        localStorage.setItem(results[i].get("pharmacyID").id, JSON.stringify(results[i].get("pharmacyID")));
                        localStorage.setItem(results[i].get("pharmacyID").get("pharmacyInfo").id, JSON.stringify(results[i].get("pharmacyID").get("pharmacyInfo")));
                        myDeliveriesPharmacyObj[results[i].get("pharmacyID").get("pharmacyInfo").id] = true;
                        localStorage.setItem(results[i].get("patientId").id, JSON.stringify(results[i].get("patientId")));
                    }else if(results[i].get("deliveryStatus") == 'No Show'){
                        myNoShows.push(results[i].id);
                        localStorage.setItem(results[i].id, JSON.stringify(results[i]) );
                        localStorage.setItem(results[i].get("pharmacyID").id, JSON.stringify(results[i].get("pharmacyID")));
                        localStorage.setItem(results[i].get("pharmacyID").get("pharmacyInfo").id, JSON.stringify(results[i].get("pharmacyID").get("pharmacyInfo")));
                        myNoShowsPharmacyObj[results[i].get("pharmacyID").get("pharmacyInfo").id] = true;
                        localStorage.setItem(results[i].get("patientId").id, JSON.stringify(results[i].get("patientId")));
                    }
                }
            }
            console.log(pharmaciesObj);
            console.log(myDeliveriesPharmacyObj);
            localStorage.setItem("current_pharmacies_pickup", JSON.stringify(pharmaciesObj));
            localStorage.setItem("current_pharmacies_myDeliveries", JSON.stringify(myDeliveriesPharmacyObj));
            localStorage.setItem("current_pharmacies_noShows", JSON.stringify(myNoShowsPharmacyObj));
            
            //store mypickups data to local DB
            localStorage.setItem("myPickups",JSON.stringify(myPickups));
            localStorage.setItem("myDeliveries", JSON.stringify(myDeliveries));
            localStorage.setItem("myNoShows", JSON.stringify(myNoShows));
            
            //update UI
            updateUI();
        },
        error: function(error){
            alert("Error : " + error);
        }
    });
}

function updateUI(){
    for(var i=0; i<document.getElementsByName('total_pickups').length; i++){
        (document.getElementsByName('total_pickups')[i].innerHTML = (Object.size((JSON.parse(localStorage.getItem("current_pharmacies_pickup"))))));
    }
    for(var i=0; i<document.getElementsByName('total_my_deliveries').length; i++){
        (document.getElementsByName('total_my_deliveries')[i].innerHTML = JSON.parse(localStorage.getItem("myDeliveries")).length);
    }
    for(var i=0; i<document.getElementsByName('total_no_shows').length; i++){
        (document.getElementsByName('total_no_shows')[i].innerHTML = JSON.parse(localStorage.getItem("myNoShows")).length);
    }
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function pickupPageOnLoad() {
    console.log("pickupPageOnload ....");
}

function gotoPickupsPage(pharmacyInfoId,pharmacyName){
    localStorage.setItem("pharmacyInfoId",pharmacyInfoId);
    localStorage.setItem("pharmacyName",pharmacyName);
    window.location = 'pharmacyPickups.html';
}

function viewPickup(orderId, pharmacyInfoId){
    localStorage.setItem("pickupOrderId",orderId);
    localStorage.setItem("pickupPharmacyInfoId",pharmacyInfoId);
    window.location = 'viewPickupPage.html';
}

function viewDelivery(orderId, pharmacyInfoId){
    localStorage.setItem("deliveryOrderId", orderId);
    localStorage.setItem("deliveryPharmacyInfoId",pharmacyInfoId);
    window.location = 'viewDeliveryPage.html';
}

function viewNoShowDelivery(orderId, pharmacyInfoId){

    localStorage.setItem("noShowOrderId", orderId);
    localStorage.setItem("noShowPharmacyInfoId",pharmacyInfoId);
    window.location = 'viewNoShowPage.html';
}

function confirmPickupPopup() {
     $( "#confirm_pickup_popup" ).popup("open");
}
function confirmAllPickupPopup(){
    $( "#confirm_all_pickup_popup" ).popup("open");
}

function confirmNoShowPopup(){
    $( "#confirm_no_show_popup" ).popup("open");
}

function confirmPickups(){
    $('div.ui-loader').show();
    //get array ordersToConfirmPickup from local storage 
    var ordersArray = localStorage.getItem("ordersToConfirmPickup");
    //get the pharmacyInfo Id from localStorage using key : 'ordersToConfirmPickupPharmacyInfoId'
    var pharmacyInfoId = localStorage.getItem("ordersToConfirmPickupPharmacyInfoId");
    //now for all the orders in the orders array set the status from pending to "in process"

    console.log(ordersArray);

    var array = [];

    var s = Object.size(JSON.parse(ordersArray));
    console.log("size of array : " + s );
    for (var j=0; j<s; j++){
    array.push(JSON.parse(ordersArray)[j]);
    }
    console.log(array);

    var Orders = Parse.Object.extend("Orders");
    var OrdersQuery = new Parse.Query(Orders);
    OrdersQuery.include("pharmacyID");
    OrdersQuery.include("patientId");
    OrdersQuery.include("pharmacyID.pharmacyInfo");
    OrdersQuery.include("driverId");
    OrdersQuery.include("driverId.driverUser");

    OrdersQuery.containedIn("objectId", array);
    OrdersQuery.find({
      success: function(results){
        for (var i = 0; i < results.length; i++) {
          console.log("query result " + i + " : " + results[i].id + " ---> deliveryStatus : " + results[i].get("deliveryStatus"));
          //change the delivery status to in process here 
          results[i].set("deliveryStatus", "In progress");
          results[i].save();
        }
        refreshSync();
        var delay=1000; //1 seconds
        setTimeout(function(){
            //your code to be executed after 1 seconds
            //send notification emails here 
            $('div.ui-loader').hide();
            window.history.back();
                
        }, delay);
      },
      error: function(error){
        alert("Error : " + error);
        refreshSync();
      }
    });

  //refreshSync call after everything and then go back to pharmacies list page 
}

function copyToClipBoard(){
    
    var address = $('#delivery_detailsPgae_patientAddress').text();
    // var isCordovaApp = !!window.cordova;
    
    // console.log(isCordovaApp);
    
    //var app = document.URL.indexOf( 'https://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
    // if(isCordovaApp){
        // cordova.plugins.clipboard.copy(address);
        // console.log("copied to clipboard : " + address);
        // alert("Address Copied !!");
    // }else{
        //console.log("cordova is undefined");
        window.prompt("please select all and copy the address here", address);
    // }  
}

function confirmNoShow(){
  //alert("need to confirm no show here !! ");
  var array = [];
  var timeStamp = new Date();
  
  var Orders = Parse.Object.extend("Orders");
  var OrdersQuery = new Parse.Query(Orders);
  var orderToComplete = localStorage.getItem("ordersToConfirmDelivery");
  console.log("order Id to confirm : " + orderToComplete);

  array.push(JSON.parse(orderToComplete));
  console.log(array);
  OrdersQuery.containedIn("objectId", array);
  
  OrdersQuery.find({
      success: function(results){

          if(results[0].get("noShow") == undefined ){ // base case for confirming delivery
            
            results[0].set("noShow", true);
            results[0].set("numberOfNoShows", 1);

            results[0].set("deliveryStatus", "No Show");
            var autoGeneratedNoShowCommentForDriver = timeStamp + " - The patient did not show up. \n\n ";
            results[0].set("driverComment", autoGeneratedNoShowCommentForDriver);
            results[0].save();
            var delay=1000; //1 seconds
            $('div.ui-loader').show();
            
            setTimeout(function(){
            //your code to be executed after 1 seconds
            //send notification emails here 
              $('div.ui-loader').hide();
              location.href='index.html#homePage' 
            }, delay);

          } else if(results[0].get("noShow") == true){
            
            results[0].set("noShow", true);
            var numberOfNoShows = results[0].get("numberOfNoShows");
            results[0].set("numberOfNoShows", numberOfNoShows + 1);

            results[0].set("deliveryStatus", "No Show");
            var autoGeneratedNoShowCommentForDriver = timeStamp + " - The patient did not show up. \n\n ";
            var previousDriverComment = results[0].get("driverComment");

            results[0].set("driverComment", previousDriverComment + " \n\n" + autoGeneratedNoShowCommentForDriver );
            results[0].save();
            var delay=1000; //1 seconds
            $('div.ui-loader').show();
            setTimeout(function(){
              //your code to be executed after 1 seconds
              //send notification emails here 
              $('div.ui-loader').hide();
              window.history.back();
            }, delay);

          }
      },
      error: function(error){
          alert("Error : " + error);
      }
  });
}

