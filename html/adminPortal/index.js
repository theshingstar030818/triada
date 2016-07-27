function login(form) {
    var username = form.username.value;
    var password = form.password.value;

    if (username && password) {
        Parse.User.logIn(username, password , {
          success: function(user) {
            // Do stuff after successful login.
            var objectString = JSON.stringify(user);
            if(user.get("isAdmin")){
                console.log("login successful");
                window.location = 'adminPortal.html';
            }else{
                alert("please login with admin credentials");
                Parse.User.logOut();
            } 
            
          },
          error: function(user, error) {
            // The login failed. Check error to see why.
            console.log("login unsuccessful");
            alert("Error: " + error.code + " " + error.message);
          }
        });
    }
    else {
        alert("Please enter your username and password.");
    }
}

function logout() {
    Parse.User.logOut();
    window.location = 'index.html';
}

function createPharmacyAccount(){
    var businessName = document.getElementById("businessName").value;
    var ownerName = document.getElementById("ownerName").value;
    var businessAddress = document.getElementById("businessAddress").value;
    var businessNumber = document.getElementById("businessNumber").value;
    var zones = $('#businessZone').val();
    var otherNumber = document.getElementById("otherNumber").value;
    var fax = document.getElementById("fax").value;
    var email = document.getElementById("email").value;
    var contactMode = document.getElementById("contactMode").value;
    var employee1 = document.getElementById("employee1").value;
    var employee2 = document.getElementById("employee2").value;
    var employee3 = document.getElementById("employee3").value;
    var userName = document.getElementById("userName").value;
    var password = document.getElementById("password").value;
    var re_type_password = document.getElementById("re_type_password").value;
    
    var pricing = '{ "cities" : [ ';

    $("#cities").children().each(function(i, elm) {
        var city = $($(elm).find('select')[0]).val();
        var under10 = $($(elm).find('input')[0]).val();
        var over10 = $($(elm).find('input')[1]).val();

        pricing += '{"name" : "'+city+'", "rates" : ['+under10+','+over10+']},';
    });

    pricing = pricing.substring(0, pricing.length-1);
    pricing += ']}';


    var priceRate = pricing;


    var pickupTimesArray = [];    
    $("#pickupTimes :selected").each(function(){
        pickupTimesArray.push($(this).val()); 
    });


    if(password === re_type_password){
        Parse.Cloud.run('createNewPharmacyAccount', { businessName: businessName, ownerName: ownerName,
         businessAddress: businessAddress, businessNumber: businessNumber, otherNumber: otherNumber, 
         fax: fax, email: email, contactMode: contactMode, employee1: employee1, employee2: employee2,
         employee3: employee3, userName: userName, password: password, priceRate: pricing, pickupTimesArray: pickupTimesArray }, {
          success: function(result) {
            alert(result);
            resetForm();
          },
          error: function(error) {
            var userString = JSON.stringify(error);
            alert(userString);
          }
        });
    }else{
        alert("Passwords do not match !!");
    }
}

function createDriverAccount(){
    
    // Driver Info 
    //var  = document.getElementById('').value;

    var driverFirstName  = document.getElementById('driverFirstName').value;
    var driverLastName = document.getElementById('driverLastName').value;
    var driverDOB = document.getElementById('driverDOB').value;
    var driverSIN = document.getElementById('driverSIN').value;
    var driverLicense = document.getElementById('driverLicense').value;
    var driverEmail = document.getElementById('driverEmail').value;
    var driverMobile = document.getElementById('driverMobile').value;
    var driverAddressUnit = document.getElementById('driverAddressUnit').value;
    var driverStreetAddress = document.getElementById('driverStreetAddress').value;
    var driverAddressCity = document.getElementById('driverAddressCity').value;
    var driverAddressState = document.getElementById('driverAddressState').value;
    var driverAddressPostalCode = document.getElementById('driverAddressPostalCode').value;
    var driverUserName = document.getElementById('driverUserName').value;
    var driverPassword = document.getElementById("driverPassword").value;
    var driver_re_type_password = document.getElementById('driver_re_type_password').value;
    
    console.log(driverPassword);
    
    //alert(zones.length);

    if(driverPassword === driver_re_type_password){
        Parse.Cloud.run('createNewDriverAccount', { driverFirstName: driverFirstName, driverLastName: driverLastName, driverDOB: driverDOB, 
                driverSIN: driverSIN, driverLicense: driverLicense, driverEmail: driverEmail, driverMobile: driverMobile, driverAddressUnit: driverAddressUnit, 
                    driverStreetAddress: driverStreetAddress, driverAddressCity: driverAddressCity, driverAddressState: driverAddressState, 
                    driverAddressPostalCode: driverAddressPostalCode, driverUserName: driverUserName, driverPassword: driverPassword }, {
          success: function(result) {
            alert(result);
            resetDriverForm();
          },
          error: function(error) {
            var userString = JSON.stringify(error);
            alert(userString);
          }
        });
    }else{
        alert("Passwords do not match !!");
    }
}

function resetForm(){
    document.getElementById("businessName").value = "" ;
            document.getElementById("ownerName").value = "" ;
            document.getElementById("businessAddress").value = "" ;
            document.getElementById("businessNumber").value = "" ;
            document.getElementById("otherNumber").value = "" ;
            document.getElementById("fax").value = "" ;
            document.getElementById("email").value = "" ;
            document.getElementById("contactMode").value = "" ;
            document.getElementById("employee1").value = "" ;
            document.getElementById("employee2").value = "" ;
            document.getElementById("employee3").value = "" ;
            document.getElementById("userName").value = "" ;
            document.getElementById("password").value = "" ;
            document.getElementById("re_type_password").value = "" ;
}



function resetDriverForm(){ 
    document.getElementById('driverFirstName').value = "" ;
    document.getElementById('driverLastName').value = "" ;
    document.getElementById('driverDOB').value = "" ;
    document.getElementById('driverSIN').value = "" ;
    document.getElementById('driverLicense').value = "" ;
    document.getElementById('driverEmail').value = "" ;
    document.getElementById('driverMobile').value = "" ;
    document.getElementById('driverAddressUnit').value = "" ;
    document.getElementById('driverStreetAddress').value = "" ;
    document.getElementById('driverAddressCity').value = "" ;
    document.getElementById('driverAddressState').value = "" ;
    document.getElementById('driverAddressPostalCode').value = "" ;
    document.getElementById('driverUserName').value = "" ;
    document.getElementById('driverPassword').value = "" ;
    document.getElementById('driver_re_type_password').value = "" ;
}