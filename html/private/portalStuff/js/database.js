function onLoad() {
	var currentUser = Parse.User.current();
	var objectString = JSON.stringify(currentUser);
	var jsonUserData = JSON.parse(objectString);
    //alert(objectString);
    //get the pharmacy object for  the user
    var Pharmacy = Parse.Object.extend("Pharmacies");
    
    var pharmacyQuery = new Parse.Query(Pharmacy);
    pharmacyQuery.include("pharmacyUser");
    pharmacyQuery.equalTo("pharmacyUser", currentUser);
    pharmacyQuery.limit(1000);
    pharmacyQuery.find({
    	success: function(pharmacyObject){
    		if(pharmacyObject.length > 0){
    			$("#pharmacy_name").append(pharmacyObject[0].get("businessName"));
    			$("#pharmacy_address").append(pharmacyObject[0].get("businessAddress"));
	    		//alert("the pharmacy name retrieved was : " + pharmacyObject[0].get("businessName"));
    		}else{
    			alert("First time logging in on this browser? Please log out and log back in. If the issue remains contact Pace Couriers.");
    			//notify engineers and log the user out !! 
    		}
    	},
    	error: function(error){
    		alert("Error: " + error.code + " " + error.message);
    	}
    });

    //set the top nav username
    $("#top_nav_username").empty();
    $("#top_nav_username").append(jsonUserData.username);
    //$("#pharmacy_name").append(jsonUserData.pharmacyName);
    // $("#pharmacy_address").append(jsonUserData.pharmacyAddress);
    //getPatientsFromDatabase();
}

window.onload = function() {
    // if(!window.location.hash) {
    // 	//code for the page first time load goes here
    //     window.location.hash = window.location + '#loaded';
    //     window.location.reload();
    // }
    
    getPatientsFromDatabase();
}

function logout(){
	Parse.User.logOut();
	window.location = '/';
}

function getPatientsFromDatabase(){

	var Patients = Parse.Object.extend("Patients");
	var PatientsQuery = new Parse.Query(Patients);
	PatientsQuery.limit(1000);
	//query conditions
	//PatientsQuery.equalTo("pharmacyId", Parse.User.current().id);
	$("#patient_info_table_body").empty();
	PatientsQuery.find({
		success: function(results){
			//$("#patient_info_table_body").empty();
			if(results.length != 0){
				document.getElementById('no_ddeliveries_message').style.display = "none";
				for (var i = 0; i < results.length; i++) { 
					// alert(JSON.stringify(results[i].id));
					var name = results[i].get("name");
					var objectId = results[i].id;
					var createdAt = results[i].createdAt;
					var updatedAt = results[i].updatedAt;
					var email = results[i].get("email");
					var address = results[i].get("address");
					var telephone = results[i].get("telephone");
					var distance = results[i].get("distanceFromPharmacy");

					if(distance != undefined ){
						distance = distance.toFixed(2)
					}

					var content =  '<tr onClick="editPatient(\''+objectId+'\')" ><td class="user-name">'+name+'</td><td class="user-email">'+address+'</td><td class="user-phone">'+telephone+'</td><td class="user-email">'+distance+' KM</td></tr>';
					$("#patient_info_table_body").append(content);
				}	
			}
			

			var table = document.getElementById ("patient_info_table");
            //table.refresh ();
			// $("#patient_info_table_body").listview('refresh');

		},
		error: function(error){
			alert("Error: " + error.code + " " + error.message);
		}
	});
}

function editPatient(patientID){
  var patients = Parse.Object.extend("Patients");
  var query = new Parse.Query(patients);
  query.include("pharmacy");
  query.include("pharmacy.pharmacyInfo");

  query.get(patientID, {
    success: function(patient) {
      var aptNum = patient.get("aptNum");
      var buildingNum = patient.get("buildingNum");
      var streetName = patient.get("streetName");
      var city = patient.get("city");
      var postalCode = patient.get("postalCode");
      var state = patient.get("state");
      var telephone = patient.get("telephone");

      document.getElementById('patient_aptNum').value = aptNum;
      document.getElementById('patient_buildingNum').value = buildingNum;
      document.getElementById('patient_streetName').value = streetName;
      console.log("patient_city = " + document.getElementById('patient_city').value);
      
      if(patient.get("pharmacy").get("pharmacyInfo").get("pricing") != undefined){
      	document.getElementById('patient_city_select').value = city;
      }else{
      	document.getElementById('patient_city_input').value = city;
      }
      
      document.getElementById('patient_postalCode').value = postalCode;
      document.getElementById('patient_state').value = state;
      document.getElementById('patient_telephone').value = telephone;

      var editButton = '<a onClick="updatePatientInfo(\''+patientID+'\')" id="submit">Update Info</a>';
           
      $("#save_button_div").empty();
      $("#save_button_div").append(editButton);

      edit_patient_info_div_show();
    },
    error: function(object, error) {
      console.log("The object was not retrieved successfully.")
      // The object was not retrieved successfully.
      // error is a Parse.Error with an error code and message.
    }
  });
}

function updatePatientInfo(patientID){
	
	var patients = Parse.Object.extend("Patients");
	var query = new Parse.Query(patients);
	query.include("pharmacy");
	query.include("pharmacy.pharmacyInfo");
	query.get(patientID, {
		success: function(patient) {
			
			console.log("patient retrieved success");
			
			var pharmacy = patient.get("pharmacy");
          	var pharmacyInfo = patient.get("pharmacy").get("pharmacyInfo");
          	var pharmacyAddress = pharmacyInfo.get("businessAddress");

			var aptNum = document.getElementById('patient_aptNum').value;
			var buildingNum = document.getElementById('patient_buildingNum').value;
			var streetName = document.getElementById('patient_streetName').value;

			if(patient.get("pharmacy").get("pharmacyInfo").get("pricing") != undefined){
				var city = document.getElementById('patient_city_select').value;
			}else{
				var city = document.getElementById('patient_city_input').value;
			}

			
			

			var postalCode = document.getElementById('patient_postalCode').value;
			var state = document.getElementById('patient_state').value;
			var telephone = document.getElementById('patient_telephone').value;
			var distanceAddress = streetName + " " + city + " " + postalCode + " " + state;
	        var address = aptNum + " " + buildingNum + " " + streetName + " " + city + " " + postalCode + " " + state ;			
			if(streetName === "" || buildingNum === "" || city === "" || postalCode === "" || state === "" || address === ""){
				//alert user to enter info first
				alert("Error : Please enter the mandatory feilds.");
			}
			else{
				patient.set("aptNum", aptNum);
	            patient.set("buildingNum", buildingNum);
	            patient.set("streetName", streetName);
	            patient.set("city", city);
	            patient.set("postalCode", postalCode);
	            patient.set("state", state);
	            
	            patient.set("address", address);
	            patient.set("telephone", telephone);

	            var geocoder = new google.maps.Geocoder();
	            geocoder.geocode( { 'address': distanceAddress}, function(results, status) {
	              if (status == google.maps.GeocoderStatus.OK) 
	              {
	                  var patientLat = results[0].geometry.location.lat();
	                  var patientLng = results[0].geometry.location.lng();

	                  patient.set("patientLatitude", patientLat); 
	                  patient.set("patientLongitude", patientLng); 
	                  
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
								var originList = response.originAddresses;
								var total_distance = 0;	
								for (var i = 0; i < originList.length; i++) {
									var results = response.rows[i].elements;
									for (var j = 0; j < results.length; j++) {
									  total_distance += results[j].distance.value;
									}
								}
								
								var distanceFromPharmacy = total_distance/1000;
								patient.set("distanceFromPharmacy",distanceFromPharmacy);


								if(pharmacyInfo.get("pricing") !=undefined){
									var pharmacyPricingJSON = JSON.parse(pharmacyInfo.get("pricing"));

									for (var i = 0; i < pharmacyPricingJSON.cities.length; i++){
									  
									  if (pharmacyPricingJSON.cities[i].name == city){
									  	if(distanceFromPharmacy < 10){
											patient.set("cost",pharmacyPricingJSON.cities[i].rates[0]);
									  	}else if(distanceFromPharmacy > 10 && distanceFromPharmacy < 20){
									  		patient.set("cost",pharmacyPricingJSON.cities[i].rates[1]);
									  	}else{
									  		patient.set("cost",pharmacyPricingJSON.cities[i].rates[2]);
									  	}
									  }
									}
								}else{
									if(distanceFromPharmacy < 10){
										patient.set("cost",pharmacyInfo.get("priceRate"));
									}else if(distanceFromPharmacy >= 10 && distanceFromPharmacy < 20){
										patient.set("cost",pharmacyInfo.get("priceRateOver10Km"));
									}else if(distanceFromPharmacy >= 20 && distanceFromPharmacy < 30){
										patient.set("cost",pharmacyInfo.get("priceRateOver20Km"));
									}else{
										patient.set("cost",pharmacyInfo.get("priceRateOver30Km"));
									}
								}
								




		                        patient.save(null, {
		                          success: function(patientObjectReturn) {
		                            // Execute any logic that should take place after the object is saved.
		                            alert('Your patient : ' + patientObjectReturn.get("name") + " was Successfully updated");
		                          },
		                          error: function(patientObjectReturn, error) {
		                            // Execute any logic that should take place if the save fails.
		                            // error is a Parse.Error with an error code and message.
		                            alert('Failed to store patient information into the database, with error code: ' + error.message);
		                          }
		                        });
							});
	                    } 
	                  }); 
	              } 
	            }); 
			}
		},
		error: function(object, error) {
			console.log("The object was not retrieved successfully.")
			// The object was not retrieved successfully.
			// error is a Parse.Error with an error code and message.
		}
	});
}

function edit_patient_info_div_show(){
  document.getElementById('edit_patient_info_div').style.display = "block";
  document.getElementById('table_div').style.display = "none";
}

function edit_patient_info_div_hide(){
  document.getElementById('edit_patient_info_div').style.display = "none";
  document.getElementById('table_div').style.display = "block";
  getPatientsFromDatabase();
}