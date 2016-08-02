// Validating Empty Field
function check_empty() {
// if (document.getElementById('name').value == "" || document.getElementById('email').value == "" || document.getElementById('msg').value == "") {
// alert("Fill All Fields !");
// } else {
// document.getElementById('form').submit();
// alert("Form Submitted Successfully...");
	postPatient();

// }
}

//Function To Display add patient Popup
function div_show() {
document.getElementById('abc').style.display = "block";
document.getElementById('table_div').style.display = "none";
}
//Function to Hide add patient Popup
function div_hide(){
	document.getElementById('table_div').style.display = "block";
document.getElementById('abc').style.display = "none";
location.reload();
}

//save patient 
function postPatient(){
  var Patients_object = Parse.Object.extend("Patients");
  var patientObject = new Patients_object;

  var currentUser = Parse.User.current();
  var userString = JSON.stringify(currentUser);
  var jsonUserData = JSON.parse(userString);

  //get the pharmacy object for  the user
  var Pharmacy = Parse.Object.extend("Pharmacies");
  
  var pharmacyQuery = new Parse.Query(Pharmacy);
  pharmacyQuery.include("pharmacyUser");
  pharmacyQuery.equalTo("pharmacyUser", currentUser);
  pharmacyQuery.limit(1000);
  pharmacyQuery.find({
    success: function(pharmacyObject){
      if(pharmacyObject.length > 0){
        
        var pharmacyAddress = pharmacyObject[0].get("businessAddress");
        var name = document.getElementById("new_patient_name").value;
        var telephone = document.getElementById("new_patient_telephone").value;
        var aptNum = document.getElementById("new_patient_unit").value;
        var buildingNum = document.getElementById("new_patient_building").value;
        var streetName = document.getElementById("new_patient_street").value;

        if(pharmacyObject[0].get("pricing") != undefined){
          var city = document.getElementById("new_patient_city_select").value;
        }else{
          var city = document.getElementById("new_patient_city_input").value;
        }

        
        var postalCode = document.getElementById("new_patient_postal").value;
        var state = document.getElementById("new_patient_state").value;

        var distanceAddress = streetName + " " + city + " " + postalCode + " " + state;


        var address = aptNum + " " + buildingNum + " " + streetName + " " + city + " " + postalCode + " " + state ;
          console.log(address);
          if(name === "" || streetName === "" || buildingNum === "" || city === "" || postalCode === "" || state === "" || address === ""){
            //alert user to enter info first
            alert("Error : Please enter the mandatory feilds.");
          }
          else{
            patientObject.set("name", name);

            patientObject.set("aptNum", aptNum);
            patientObject.set("buildingNum", buildingNum);
            patientObject.set("streetName", streetName);
            patientObject.set("city", city);
            patientObject.set("postalCode", postalCode);
            patientObject.set("state", state);
            
            patientObject.set("address", address);
            patientObject.set("telephone", telephone);    
            patientObject.set("pharmacyId", jsonUserData.objectId);
            patientObject.set("pharmacy",currentUser);
            
            var geocoder = new google.maps.Geocoder();

            geocoder.geocode( { 'address': distanceAddress}, function(results, status) {
              if (status == google.maps.GeocoderStatus.OK) 
              {
                  var patientLat = results[0].geometry.location.lat();
                  var patientLng = results[0].geometry.location.lng();

                  patientObject.set("patientLatitude", patientLat); 
                  patientObject.set("patientLongitude", patientLng); 
                  
                  geocoder.geocode( { 'address': pharmacyAddress}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) 
                    {
                        var pharmacyLat = results[0].geometry.location.lat();
                        var pharmacyLng = results[0].geometry.location.lng();
                        
                        var service = new google.maps.DistanceMatrixService();                          
                          
                          var point1 = new google.maps.LatLng(patientLat, patientLng);
                          var point2 = new google.maps.LatLng(pharmacyLat, pharmacyLng);

                          service.getDistanceMatrix(
                          {
                            origins: [point1],
                            destinations: [point2],
                            travelMode: google.maps.TravelMode.DRIVING
                          }, 
                          function callback(response, status) {
                            console.log("response : " + response);
                            var originList = response.originAddresses;
                            var total_distance = 0; 
                            for (var i = 0; i < originList.length; i++) {
                              var results = response.rows[i].elements;
                              for (var j = 0; j < results.length; j++) {
                                total_distance += results[j].distance.value;
                              }
                            }
                            
                            var distanceFromPharmacy = total_distance/1000;
                            patientObject.set("distanceFromPharmacy",distanceFromPharmacy);
                            
                            //set cost for the patient here and also change the updatePatient function
                            
                            if(pharmacyObject[0].get("pricing") != undefined){
                              var pharmacyPricingJSON = JSON.parse(pharmacyObject[0].get("pricing"));

                              for (var i = 0; i < pharmacyPricingJSON.cities.length; i++){
                                
                                if (pharmacyPricingJSON.cities[i].name == city){
                                  if(distanceFromPharmacy < 10){
                                    patientObject.set("cost",pharmacyPricingJSON.cities[i].rates[0]);
                                  }else if(distanceFromPharmacy > 10 && distanceFromPharmacy < 20){
                                    patientObject.set("cost",pharmacyPricingJSON.cities[i].rates[1]);
                                  }else{
                                    patientObject.set("cost",pharmacyPricingJSON.cities[i].rates[2]);
                                  }
                                }
                              }
                            }else{
                              if(distanceFromPharmacy < 10){
                                patientObject.set("cost",pharmacyObject[0].get("priceRate"));
                              }else if(distanceFromPharmacy >= 10 && distanceFromPharmacy < 20){
                                patientObject.set("cost",pharmacyObject[0].get("priceRateOver10Km"));
                              }else if(distanceFromPharmacy >= 20 && distanceFromPharmacy < 30){
                                patientObject.set("cost",pharmacyObject[0].get("priceRateOver20Km"));
                              }else{
                                patientObject.set("cost",pharmacyObject[0].get("priceRateOver30Km"));
                              }
                            }
                            


                            //set ACL on the object 
                            //all drivers can access the patient info 
                            //the pharmacy itself can access the object
                            var acl = new Parse.ACL();
                            acl.setReadAccess(Parse.User.current().id, true);
                            acl.setWriteAccess(Parse.User.current().id, true);
                            //acl.setWriteAccess(Parse.User.current().id, true);
                            acl.setRoleReadAccess("Drivers", true);
                            
                            acl.setRoleReadAccess("admins", true);
                            acl.setRoleWriteAccess("admins",true);

                            patientObject.setACL(acl);
                            // alert("saving patient");
                            patientObject.save(null, {
                              success: function(patient) {
                                // Execute any logic that should take place after the object is saved.
                                alert('Your patient : ' + patient.get("name") + " was Successfully stored in the database with the id# : " + patient.id + ". Now you can easily submit their deliveries through the deliveries tab.");
                                document.getElementById("form").reset();
                              },
                              error: function(patient, error) {
                                // Execute any logic that should take place if the save fails.
                                // error is a Parse.Error with an error code and message.
                                alert('Failed to store patient information into the database, with error code: ' + error.message);
                              }
                            });

                          });
                    } else {
                      alert("Invalid Pharmacy Address !!");
                    }
                  }); 
              } 
            }); 
          }
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

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

