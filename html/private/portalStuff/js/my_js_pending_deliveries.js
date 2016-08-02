// Get the <datalist> and <input> elements.
// var dataList = document.getElementById('json-datalist');
// var input = document.getElementById('ajax');

// // Create a new XMLHttpRequest.
// var request = new XMLHttpRequest();

// // Handle state changes for the request.
// request.onreadystatechange = function(response) {
//   if (request.readyState === 4) {
//     if (request.status === 200) {
//       // Parse the JSON
//       var jsonOptions = JSON.parse(request.responseText);
  
//       // Loop over the JSON array.
//       jsonOptions.forEach(function(item) {
//         // Create a new <option> element.
//         var option = document.createElement('option');
//         // Set the value using the item in the JSON array.
//         option.value = item;
//         // Add the <option> element to the <datalist>.
//         //dataList.appendChild(option);
//       });
      
//       // Update the placeholder text.
//       //input.placeholder = "e.g. datalist";
//     } else {
//       // An error occured :(
//       input.placeholder = "Couldn't load datalist options :(";
//     }
//   }
// };

// Update the placeholder text.
// input.placeholder = "Loading options...";

// Set up and make the request.
//request.open('GET', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/4621/html-elements.json', true);
//request.send();



// Validating Empty Field
function check_empty() {
// if (document.getElementById('name').value == "" || document.getElementById('email').value == "" || document.getElementById('msg').value == "") {
// alert("Fill All Fields !");
// } else {
// document.getElementById('form').submit();
// alert("Form Submitted Successfully...");
	postOrder();

// }
}

// function saveNewPatientAndSubmitNewOrder(){
//   //save patient to database
//   var Patients_object = Parse.Object.extend("Patients");
//   var patientObject = new Patients_object;
//   var currentUser = Parse.User.current();
//   var userString = JSON.stringify(currentUser);
//   var jsonUserData = JSON.parse(userString)  
//   var name = document.getElementById("new_patient_name").value;
//   var address = document.getElementById("new_patient_address").value;
//   var telephone = document.getElementById("new_patient_telephone").value;

//   patientObject.set("name", name);
//   patientObject.set("address", address);
//   patientObject.set("telephone", telephone);    
//   patientObject.set("pharmacyId", jsonUserData.objectId);
//   patientObject.save(null, {
//     success: function(patient) {
//       //get the new patient's id
//       //pass in the date and the new patient's id to postOrder()
//       var patientId = patient.id;
//       alert('New object created with objectId: ' + patientId);
      
//       var day = document.getElementById("daydropdown2").value;
//       var month = ( "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(document.getElementById("monthdropdown2").value) / 3 );
//       var year = document.getElementById("yeardropdown2").value;
//       var dateOfOrder = new Date(year, month, day, 0, 0, 0, 0);
      
//       postOrder(dateOfOrder,patientId);     
//     },
//     error: function(adObject, error) {
//       alert('Failed to create new object, with error code: ' + error.message);
//     }
//   });
// }

function submitNewOrderExistingPatient(){
  var val = $('#default').val()
  var patientId = $('#languages option').filter(function() {
      return this.value == val;
  }).data('val');

  if(patientId =='' || patientId == undefined){
    alert("Please select a patient to create a delivery order");
  }else{
    var day = document.getElementById("daydropdown2").value;
    var month = ( "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(document.getElementById("monthdropdown2").value) / 3 );
    var year = document.getElementById("yeardropdown2").value;
    var dateOfOrder = new Date(year, month, day, 0, 0, 0, 0);
    console.log("day: " + day + " month: " + month + " year: " + year);
    console.log(dateOfOrder);
    postOrder(dateOfOrder,patientId);
  }  
}

function new_patient_info_div_show() {
document.getElementById('new_patient_info').style.display = "block";
document.getElementById('add_new_patient_button').style.display = "none";
document.getElementById('submit').style.display = "none";
document.getElementById('submit_with_new_patient').style.display = "block";
//document.getElementById('fuzzSearch').style.display = "none";
}

function patient_from_database_div_show() {
// document.getElementById('new_patient_info').style.display = "none";
// document.getElementById('add_new_patient_button').style.display = "block";
// document.getElementById('submit').style.display = "block";
// document.getElementById('submit_with_new_patient').style.display = "none";
}

//Function To Display add patient Popup
function div_show() {
  //update patients list here
  getPatientsForList();

  document.getElementById('abc').style.display = "block";
  document.getElementById('table_div').style.display = "none";
  
  //set the date to current date 
  updateDateSubmitOrder();
}
//Function to Hide add patient Popup
function div_hide(){
	document.getElementById('table_div').style.display = "block";
document.getElementById('abc').style.display = "none";
get_deliveries();
//location.reload();
}

    //save order 
function postOrder(dateOfOrder,patientId){
  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var dayNames = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  var d = new Date();
  var day = d.getDate();
  var month = d.getMonth();
  var year = d.getFullYear();
  var date = new Date(year, month, day, 0, 0, 0, 0);
  if(dateOfOrder<date){
    alert ("Error : You can not submit delivery orders for date before " + day + "-" + monthNames[month] + "-" + year);
  }else{
    var Orders_object = Parse.Object.extend("Orders");
  var ordersObject = new Orders_object;
  var currentUser = Parse.User.current();
  var userString = JSON.stringify(currentUser);
  var jsonUserData = JSON.parse(userString);
  var pickupTime = document.getElementById("pickupTime").value;

  var RX = document.getElementById("RX").value;
  var Collectables = document.getElementById("Collectables").value;
  var Comments = document.getElementById("Comments").value;

  ordersObject.set("pickupTime", pickupTime);
  ordersObject.set("deliveryStatus", "pending");
  //alert("date of order : " + dateOfOrder);
  ordersObject.set("deliveryDate", dateOfOrder);
  ordersObject.set("pharmacyID", Parse.User.current());

  ordersObject.set("RX", RX);
  ordersObject.set("Collectables", Collectables);
  ordersObject.set("comments", Comments);
  ordersObject.set("pickup", false);

  var Patients = Parse.Object.extend("Patients");
  var PatientsQuery = new Parse.Query(Patients);
  PatientsQuery.get(patientId, {
      success: function(patient) {
        // The object was retrieved successfully.
        // now save that into the patientId pointer feild for the order 
        
        ordersObject.set("patientId", patient);

        //set order cost here 
        if(patient.get("cost") == undefined){

          var distanceFromPharmacy = patient.get("distanceFromPharmacy");

          if(patient.get("pharmacy").get("pharmacyInfo").get("pricing") == undefined){
            if(distanceFromPharmacy < 10){
              patient.set("cost",patient.get("pharmacy").get("pharmacyInfo").get("priceRate"));
            }else if(distanceFromPharmacy >= 10 && distanceFromPharmacy < 20){
              patient.set("cost",patient.get("pharmacy").get("pharmacyInfo").get("priceRateOver10Km"));
            }else if(distanceFromPharmacy >= 20 && distanceFromPharmacy < 30){
              patient.set("cost",patient.get("pharmacy").get("pharmacyInfo").get("priceRateOver20Km"));
            }else{
              patient.set("cost",patient.get("pharmacy").get("pharmacyInfo").get("priceRateOver30Km"));
            }
          }else{
            var pharmacyPricingJSON = JSON.parse(patient.get("pharmacy").get("pharmacyInfo").get("pricing"));
            for (var i = 0; i < pharmacyPricingJSON.cities.length; i++){
              
              if (pharmacyPricingJSON.cities[i].name == patient.get("city")){
                if(distanceFromPharmacy < 10){
                  patient.set("cost",pharmacyPricingJSON.cities[i].rates[0]);
                }else if(distanceFromPharmacy > 10 && distanceFromPharmacy < 20){
                  patient.set("cost",pharmacyPricingJSON.cities[i].rates[1]);
                }else{
                  patient.set("cost",pharmacyPricingJSON.cities[i].rates[2]);
                }
              }
            }
          }

        }else{
          ordersObject.set("cost",patient.get("cost"));
        }
        
        
        //set ACL on the object 
        //all drivers can access the patient info and also edit them
        //the pharmacy itself can access the object
        var acl = new Parse.ACL();
        acl.setReadAccess(Parse.User.current().id, true);
        acl.setWriteAccess(Parse.User.current().id, true);
        acl.setRoleReadAccess("Drivers", true);
        acl.setRoleWriteAccess("Drivers", true);
        acl.setRoleReadAccess("admins", true);
        acl.setRoleWriteAccess("admins", true);
        ordersObject.setACL(acl);

        ordersObject.save(null, {
          success: function(orderObject) {
            // Execute any logic that should take place after the object is saved.
            alert('New delivery order was created for the patient : ' + patient.get("name"));
            verifyOrder(orderObject,patient);
            resetAddDeliveryForm();
            
          },
          error: function(object, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            alert('Failed to create a new delivery order for the patient : ' + patient.get("name") + " \n Error Message : " +  error.message);
          }
        });
      },
      error: function(object, error) {
        // The object was not retrieved successfully.
        // error is a Parse.Error with an error code and message.
        alert("Error: " + error.code + " " + error.message);
      }
    });
  }
}

function get_deliveries(){
  //var idOfTextbox = "start_dt"
  //date = getDateSelected(idOfTextbox);
  
  var day = document.getElementById("daydropdown").value;
  var month = ( "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(document.getElementById("monthdropdown").value) / 3 );
  var year = document.getElementById("yeardropdown").value;
  var date = new Date(year, month, day, 0, 0, 0, 0);

  if(Object.prototype.toString.call(date) === "[object Date]"){
    if ( isNaN( date.getTime() ) ) {  // d.valueOf() could also work
      // date is not valid
      alert("Please select a date and then press go");
    }
    else {
      // date is valid
      console.log("getting all the delivery logs for the following date : " + date);
      $("#pending_delivery_table_body").empty();
      getDeliveriesFromDatabaseForSpecificDate(date);
    }
  }
}

function getDeliveriesFromDatabaseForSpecificDate(date){
  var Orders = Parse.Object.extend("Orders");
  var OrdersQuery = new Parse.Query(Orders);
  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];
  var dayNames = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  OrdersQuery.equalTo("pharmacyID", Parse.User.current());
  OrdersQuery.equalTo("deliveryDate", date);
  OrdersQuery.include("pharmacyId");
  OrdersQuery.include("pharmacyID.pharmacyInfo");
  OrdersQuery.include("patientId");
  OrdersQuery.include("driverId");
  OrdersQuery.limit(1000);
  document.getElementById('no_ddeliveries_message').style.display = "block";
  OrdersQuery.find({
    success: function(results){
      //$("#patient_info_table_body").empty();
      if(results.length == 0){
        //alert("There were no delivery orders for the following date : " + date);
      }else{
        for (var i = 0; i < results.length; i++) { 
          var pharmacy = results[i].get("pharmacyID");
          var pharmacyInfo = results[i].get("pharmacyID").get("pharmacyInfo");
          
          // alert(results[i].get("deliveryDate"));

          if(results[i].get("deliveryDate").getDate() == date.getDate() && results[i].get("deliveryDate").getMonth() == date.getMonth() && results[i].get("deliveryDate").getFullYear() == date.getFullYear()){
            document.getElementById('no_ddeliveries_message').style.display = "none";
            var deliveryStatus = results[i].get("deliveryStatus");
            var objectId = results[i].id;
            var createdAt = results[i].createdAt;
            var updatedAt = results[i].updatedAt;
            var deliveryDate = results[i].get("deliveryDate");
            var result = results[i];
            var patient = results[i].get("patientId");
            var driver = results[i].get("driverId");
            var pickupTime = results[i].get("pickupTime");
            var simpleDate = monthNames[deliveryDate.getMonth()] + ' ' + deliveryDate.getDate() + ' ' + deliveryDate.getFullYear();
            var clientSignature = results[i].get("patientSignature");
            var signatureTimeStamp = results[i].get("patientSignatureTimeStamp");
            var driverComment = results[i].get("driverComment");

            var cost = results[i].get("cost");

            //for backwards integration
            if(cost == undefined || cost == ""){
              distanceFromPharmacy = patient.get("distanceFromPharmacy");
              if(results[i].get("pharmacyID").get("pharmacyInfo").get("pricing") == undefined){

                if(distanceFromPharmacy < 10){
                  results[i].set("cost",pharmacyInfo.get("priceRate"));
                }else if(distanceFromPharmacy >= 10 && distanceFromPharmacy < 20){
                  results[i].set("cost",pharmacyInfo.get("priceRateOver10Km"));
                }else if(distanceFromPharmacy >= 20 && distanceFromPharmacy < 30){
                  results[i].set("cost",pharmacyInfo.get("priceRateOver20Km"));
                }else{
                  results[i].set("cost",pharmacyInfo.get("priceRateOver30Km"));
                }

              }else{

                var pharmacyPricingJSON = JSON.parse(pharmacyInfo.get("pricing"));

                for (var i = 0; i < pharmacyPricingJSON.cities.length; i++){
                  
                  if (pharmacyPricingJSON.cities[i].name == patient.get("city")){
                    if(distanceFromPharmacy < 10){
                      results[i].set("cost",pharmacyPricingJSON.cities[i].rates[0]);
                    }else if(distanceFromPharmacy > 10 && distanceFromPharmacy < 20){
                      results[i].set("cost",pharmacyPricingJSON.cities[i].rates[1]);
                    }else{
                      results[i].set("cost",pharmacyPricingJSON.cities[i].rates[2]);
                    }
                  }
                }

              }
              results[i].save();
              cost = results[i].get("cost");
            }

            if(driverComment === undefined){
              driverComment = "";
            }

            if(clientSignature === undefined){
              clientSignature = "";
            }else{
              clientSignature =  signatureTimeStamp + '<img height="25%" width="50%" src="'+clientSignature+'" /> ';
            }
            
            var RX = results[i].get("RX");
            var Collectables = results[i].get("Collectables");
            var comments = results[i].get("comments");

            var content =  '<tr onClick="editTableEntry(\''+objectId+'\')"><td class="user-name">'+simpleDate+'</td><td class="user-email">'+patient.get("name")+'</td><td class="user-phone">'+deliveryStatus+'</td><td class="user-mobile">'+pickupTime+'</td><td class="user-mobile">'+clientSignature+'</td><td class="user-mobile">'+driverComment+'</td><td class="user-phone">'+RX+'</td><td class="user-phone">'+Collectables+'</td><td class="user-mobile">'+comments+'</td><td class="user-mobile"> $ '+cost+'</td> </tr>';
            $("#pending_delivery_table_body").append(content);
          }
        }
      }

    },
    error: function(error){
      alert("Error: " + error.code + " " + error.message);
    }
  });
}

// order confirmation or verify order and send email notification
function verifyOrder(order,patient){

  // var d = new Date();
  // var day = d.getDate();
  // var month = d.getMonth();
  // var year = d.getFullYear();
  // var date = new Date(year, month, day, 0, 0, 0, 0);

  var currentUser = Parse.User.current();
  var objectString = JSON.stringify(currentUser);
  var jsonUserData = JSON.parse(objectString);

  var orderString = JSON.stringify(order);
  var jsonOrderData = JSON.parse(orderString);

  var patientString = JSON.stringify(patient);
  var jsonPatientData = JSON.parse(patientString);

  //get the pharmacy object for  the user
  var Pharmacy = Parse.Object.extend("Pharmacies");
  
  var pharmacyQuery = new Parse.Query(Pharmacy);
  pharmacyQuery.include("pharmacyUser");
  pharmacyQuery.equalTo("pharmacyUser", currentUser);
  pharmacyQuery.limit(1000);
  pharmacyQuery.find({
    success: function(pharmacyObject){
      if(pharmacyObject.length > 0){
          console.log("pharmacy email : " + pharmacyObject[0].get("email"));
          Parse.Cloud.run('sendMail', {pharmacyId: currentUser.id, pharmacyName: pharmacyObject[0].get("businessName"), 
                                        pharmacyAddress: pharmacyObject[0].get("businessAddress"), pharmacyEmail: pharmacyObject[0].get("email"), 
                                        orderObjectId: jsonOrderData.id, deliveryDate: jsonOrderData.deliveryDate,
                                        pickupTime: jsonOrderData.pickupTime, RX: jsonOrderData.RX, 
                                        Collectables: jsonOrderData.Collectables, comments: jsonOrderData.comments,
                                        patientObjectId: jsonPatientData.id,
                                        patientName: jsonPatientData.name, patientAddress: jsonPatientData.address, 
                                        patientTelephone: jsonPatientData.telephone}, {
            success: function(result) {
              //orders verified ! 
              //var jsonResult = JSON.stringify(result);
              alert("Delivery orders for today have been confirmed. Our driver will be there on time to pickup you order.");
            },
            error: function(error) {
              // could not verify orders !
              var jsonResult = JSON.stringify(error);
              alert("Error: Something went wrong confiming the delivery requests : " + jsonResult);
            }
          });  
      }else{
        alert("There was an issue with your account, Engineers have been notified.");
        //notify engineers and log the user out !! 
      }
    },
    error: function(error){
      alert("Error: " + error.code + " " + error.message);
    }
  });
}

function editTableEntry(orderId){
  //alert("the order id passed is  : " + orderId);

  //get the delivery order that is to be edited or deleted
  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var dayNames = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  var orders = Parse.Object.extend("Orders");
  var query = new Parse.Query(orders);
  query.include("patientId");
  query.include("driverId");
  query.get(orderId, {
    success: function(order) {
      // The object was retrieved successfully.
      console.log("The object was retrieved successfully.")

      var deliveryStatus = order.get("deliveryStatus");
      var objectId = order.id;
      var createdAt = order.createdAt;
      var updatedAt = order.updatedAt;
      var deliveryDate = order.get("deliveryDate");
      var patient = order.get("patientId");
      var driver = order.get("driverId");
      var pickupTime = order.get("pickupTime");
      var simpleDate = dayNames[deliveryDate.getDay()] + ' ' + monthNames[deliveryDate.getMonth()] + ' ' + deliveryDate.getDate() + ' ' + deliveryDate.getFullYear();
      var d = new Date();
      var day = d.getDate();
      var month = d.getMonth();
      var year = d.getFullYear();
      var date = new Date(year, month, day, 0, 0, 0, 0);

      if(deliveryDate<date || order.get("deliveryStatus")=== "In progress" || order.get("deliveryStatus")=== "Completed" || order.get("deliveryStatus")=== "No Show"){
        //show order view div 
        alert("You can not edit this delivery order. Please contact PaceCouriers for further help on the issue.");
      }else{
        //show order edit/delete div
        var editButton =  '<a onClick="saveOrder(\''+orderId+'\')" id="edit_entry_button">Save</a>';
        var deleteButton = '<a onClick="deleteOrder(\''+orderId+'\')" id="delete_entry_button">Delete</a>';
        $("#edit_delete_button_div").empty();
        $("#edit_delete_button_div").append(editButton);
        $("#edit_delete_button_div").append(deleteButton);
        
        show_edit_orders_div();
        document.getElementById('editpickupTime').value = pickupTime;
        document.getElementById('selectdaydropdown3').value = deliveryDate.getDate();
        document.getElementById('selectmonthdropdown3').value = monthNames[deliveryDate.getMonth()];
        document.getElementById('selectyeardropdown3').value = deliveryDate.getFullYear();
        
        document.getElementById('patient_id_edit').innerHTML = "Patient Id : " + patient.id;
        document.getElementById('patient_name_edit').innerHTML = " Patient name : " + patient.get("name");
        document.getElementById('patient_address_edit').innerHTML = " Patient address : " + patient.get("address");
        document.getElementById('patient_status_edit').innerHTML = " Delivery status : " + deliveryStatus;
        // document.getElementById('patient_driver_edit').innerHTML = " Driver assigned : " + driver.get("username");
        // document.getElementById('patient_createdAt_edit').innerHTML = " Created at : " + createdAt;
        // document.getElementById('patient_updatedAt_edit').innerHTML = " Last updated at : " + updatedAt;
      }
    },
    error: function(object, error) {
      console.log("The object was not retrieved successfully.")
      // The object was not retrieved successfully.
      // error is a Parse.Error with an error code and message.
    }
  });
}

function show_edit_orders_div(){
  document.getElementById('edit_orders_div').style.display = "block";
  document.getElementById('table_div').style.display = "none";
}

function edit_orders_div_hide(){
  document.getElementById('edit_orders_div').style.display = "none";
  document.getElementById('table_div').style.display = "block";
  get_deliveries();
}

function saveOrder(orderId){
  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var dayNames = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  var orders = Parse.Object.extend("Orders");
  var query = new Parse.Query(orders);
  query.include("patientId");
  query.include("driverId");
  query.get(orderId, {
    success: function(order) {
      // The object was retrieved successfully.
      console.log("The object was retrieved successfully.");
      
      var day = document.getElementById("selectdaydropdown3").value;
      var month = ( "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(document.getElementById("selectmonthdropdown3").value) / 3 );
      var year = document.getElementById("selectyeardropdown3").value;
      var dateOfOrder = new Date(year, month, day, 0, 0, 0, 0);
      var pickupTime = document.getElementById("editpickupTime").value;

      var d = new Date();
      var day = d.getDate();
      var month = d.getMonth();
      var year = d.getFullYear();
      var date = new Date(year, month, day, 0, 0, 0, 0);

      if(dateOfOrder>=date){
        // var d2 = new Date(1970,0,1,d.getHours(),d.getMinutes(),d.getSeconds(),d.getMilliseconds());
        // alert("pickupTime : " + (Date.parse("Jan 1 1970 " + pickupTime)) + " time now : " +  d2.getTime());
        // alert(d2);
        // if(dateOfOrder==date && (Date.parse("1-1-1970 " + pickupTime) < d2.getTime())){
        //   alert("Error : pickup time must not be less than : " + d.getTime());
        // }else{
          order.set("deliveryDate", dateOfOrder);
          order.set("pickupTime", pickupTime);
          order.save();
          alert("Edit successful !! ");
          edit_orders_div_hide();
        // }    
      }else{
        alert("Error : Order date can not be before " + day + "-" + monthNames[month] + "-" + year);
      }
    },
    error: function(object, error) {
      console.log("The object was not retrieved successfully.");
      // The object was not retrieved successfully.
      // error is a Parse.Error with an error code and message.
    }
  });
}

function deleteOrder(orderId){
  if (confirm('Are you sure you want to delete this delivery record from the database?')) {
      // delete it!
      var orders = Parse.Object.extend("Orders");
      var query = new Parse.Query(orders);
      query.include("patientId");
      query.include("driverId");
      query.get(orderId, {
        success: function(order) {
          order.destroy({
            success: function(myObject) {
              // The object was deleted from the Parse Cloud.
              alert(" The delivery was deleted from the database.");
              edit_orders_div_hide();
            },
            error: function(myObject, error) {
              // The delete failed.
              // error is a Parse.Error with an error code and message.
              alert("Error : The delete failed.");
            }
          });
        },
        error: function(object, error) {
          console.log("Objectretrieve unsuccessful.");
          // The object was not retrieved successfully.
          // error is a Parse.Error with an error code and message.
        }
      });
  } else {
      // Do nothing!
  }
}

function getPatientsForList(){
  $("#languages").empty();
  var Patients = Parse.Object.extend("Patients");
  var PatientsQuery = new Parse.Query(Patients);
  PatientsQuery.limit(1000);
  //query conditions
  //PatientsQuery.equalTo("pharmacyId", Parse.User.current().id);

  PatientsQuery.find({
    success: function(results){
      //$("#patient_info_table_body").empty();
      for (var i = 0; i < results.length; i++) { 
        // alert(JSON.stringify(results[i].id));
        var name = results[i].get("name");
        var objectId = results[i].id;
        var createdAt = results[i].createdAt;
        var updatedAt = results[i].updatedAt;
        var email = results[i].get("email");
        var address = results[i].get("address");
        var telephone = results[i].get("telephone");

        var content =  '<option value="'+ name +'-'+ address +'-'+ telephone +'" data-val="'+ objectId +'">';
        $("#languages").append(content);
      } 
    },
    error: function(error){
      alert("Error: " + error.code + " " + error.message);
    }
  });
}

function updateDateSubmitOrder(){
  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var d = new Date();
  var day = d.getDate();
  var month = d.getMonth();
  var year = d.getFullYear();
  
  document.getElementById("daydropdown2").value = day;
  document.getElementById("monthdropdown2").value = monthNames[month];
  document.getElementById("yeardropdown2").value = year;
}

function openDeliveriesPage(){
  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var d = new Date();
  var day = d.getDate();
  var month = d.getMonth();
  var year = d.getFullYear();
  
  document.getElementById("daydropdown").value = day;
  document.getElementById("monthdropdown").value = monthNames[month];
  document.getElementById("yeardropdown").value = year;
  get_deliveries();
}

function resetAddDeliveryForm() {
  document.getElementById("RX").value = "";
  document.getElementById("Collectables").value = "";
  document.getElementById("Comments").value = "";
  document.getElementById("default").value = "";
  div_hide();
}