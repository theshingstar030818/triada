/***********************************************
* Drop Down Date select script- by JavaScriptKit.com
* This notice MUST stay intact for use
* Visit JavaScript Kit at https://www.javascriptkit.com/ for this script and more
***********************************************/

var monthtext=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
var currentPharmacyName = "";

function onLoad() {
	var currentUser = Parse.User.current();
	var objectString = JSON.stringify(currentUser);
	var jsonUserData = JSON.parse(objectString);
    //alert(objectString);
    // getPendingDeliveriesFromDatabase();
    //set the top nav username

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
          currentPharmacyName = pharmacyObject[0].get("businessName");
          $("#pharmacy_address").append(pharmacyObject[0].get("businessAddress"));
          
          var pharmacyPickupTimes = pharmacyObject[0].get("pickupTimes");
          
          for (var i = 0; i < pharmacyPickupTimes.length; i++) {
            var tmpPickupTime = "";

            if(Number(pharmacyPickupTimes[i]) < 1200){
              
              var hr = (Number(pharmacyPickupTimes[i])/100|0);
              var min = Number(pharmacyPickupTimes[i])%100;

              tmpPickupTime = n(hr) + ":" + n(min) + " AM" ;

            }else{              
              var hr = ((Number(pharmacyPickupTimes[i])/100|0)-12);
              var min = Number(pharmacyPickupTimes[i])%100;

              tmpPickupTime = n(hr) + ":" + n(min) + " PM" ;
            }

            $("#pickupTime").append("<option value="+ pharmacyPickupTimes[i] +">"+ tmpPickupTime +"</option>");
            $("#editpickupTime").append("<option value="+ pharmacyPickupTimes[i] +">"+ tmpPickupTime +"</option>");            
          }

        }else{
          alert("There was an issue with your account, Please contact Pace Couriers.");
        }
      },
      error: function(error){
        alert("Error: " + error.code + " " + error.message);
      }
    });

    $("#top_nav_username").empty();
    $("#top_nav_username").append(jsonUserData.username);
    //$("#pharmacy_name").append(jsonUserData.pharmacyName);
    //$("#pharmacy_address").append(jsonUserData.pharmacyAddress);
}

function n(n){
    return n > 9 ? "" + n: "0" + n;
}

window.onload = function() {
    if(!window.location.hash) {
    	//code for the page first time load goes here
        window.location.hash = '#loaded';
        //window.location.reload();
        //getPendingDeliveriesFromDatabase();
    }
    openDeliveriesPage();
}

function logout(){
	Parse.User.logOut();
	window.location = '/';
}

function printData()
{
  console.log("...");
  $('td:nth-child(10)').hide();
  var divToPrint=document.getElementById("patient_info_table");
  newWin= window.open("");
  newWin.document.write("<h3>Pharmacy : "+currentPharmacyName+"</h3>");
  newWin.document.write(divToPrint.outerHTML);
  newWin.print();
  newWin.close();
  $('td:nth-child(10)').show();
}