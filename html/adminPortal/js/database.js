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
    
    pharmacyQuery.find({
    	success: function(pharmacyObject){
    		if(pharmacyObject.length > 0){
    			$("#pharmacy_name").append(pharmacyObject[0].get("businessName"));
    			$("#pharmacy_address").append(pharmacyObject[0].get("businessAddress"));
	    		//alert("the pharmacy name retrieved was : " + pharmacyObject[0].get("businessName"));
    		}else{
    			// alert("First time logging in on this browser? Please log out and log back in. If the issue remains contact Pace Couriers.");
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

function getPatientsFromDatabase(){
	var Patients = Parse.Object.extend("Patients");
	var PatientsQuery = new Parse.Query(Patients);

	//query conditions
	//PatientsQuery.equalTo("pharmacyId", Parse.User.current().id);

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

					var content =  '<tr><td class="user-name">'+name+'</td><td class="user-email">'+address+'</td><td class="user-phone">'+telephone+'</td><td class="user-email">'+distance+' KM</td></tr>';
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