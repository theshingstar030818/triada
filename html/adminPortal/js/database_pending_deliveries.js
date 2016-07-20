/***********************************************
* Drop Down Date select script- by JavaScriptKit.com
* This notice MUST stay intact for use
* Visit JavaScript Kit at https://www.javascriptkit.com/ for this script and more
***********************************************/

var monthtext=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];


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
    
    pharmacyQuery.find({
      success: function(pharmacyObject){
        if(pharmacyObject.length > 0){
          $("#pharmacy_name").append(pharmacyObject[0].get("businessName"));
          $("#pharmacy_address").append(pharmacyObject[0].get("businessAddress"));
          //alert("the pharmacy name retrieved was : " + pharmacyObject[0].get("businessName"));
        }else{
          alert("There was an issue with your account, Engineers have been notified.");
          //notify engineers and log the user out !! 
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

window.onload = function() {
    if(!window.location.hash) {
    	//code for the page first time load goes here
        window.location.hash = '#loaded';
        //window.location.reload();
        //getPendingDeliveriesFromDatabase();
    }
    fetchFilters();
}

function printData()
{
   var divToPrint=document.getElementById("patient_info_table");
   newWin= window.open("");
   newWin.document.write(divToPrint.outerHTML);
   newWin.print();
   newWin.close();
}