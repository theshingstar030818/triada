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
          if(name === "" || streetName === "" || buildingNum === "" || city === "" || postalCode === "" || state === "" || address === "" || telephone === ""){
            //alert user to enter info first
            alert("Error : All the following feilds are required.");
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
                  
                  geocoder.geocode( { 'address': pharmacyAddress}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) 
                    {
                        var pharmacyLat = results[0].geometry.location.lat();
                        var pharmacyLng = results[0].geometry.location.lng();
                        
                        // alert("pharmacy -> latitude: "+pharmacyLat + " longitude: " + pharmacyLng + " patientLat: " + patientLat + " patientLng: " + patientLng);
                        var distanceFromPharmacy = getDistanceFromLatLonInKm(patientLat,patientLng,pharmacyLat,pharmacyLng);

                        // alert("the distance between patienta and pharmacy is : " + distanceFromPharmacy);
                        patientObject.set("distanceFromPharmacy",distanceFromPharmacy);

                        //set ACL on the object 
                        //all drivers can access the patient info 
                        //the pharmacy itself can access the object
                        var acl = new Parse.ACL();
                        acl.setReadAccess(Parse.User.current().id, true);
                        //acl.setWriteAccess(Parse.User.current().id, true);
                        acl.setRoleReadAccess("Drivers", true);

                        acl.setRoleReadAccess("admins", true);
                        acl.setRoleWriteAccess("admins", true);

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