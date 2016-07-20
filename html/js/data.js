function Login(form) {
var username = form.username.value;
var password = form.password.value;
var server = document.location.href;

if (username && password && server) {

Parse.User.logIn(username, password , {
  success: function(user) {
    // Do stuff after successful login.
    var objectString = JSON.stringify(user);
    //alert(objectString);
    console.log("login successful");
    server =  server.substr(0, server.lastIndexOf("/")) + "/private/portalStuff/userPortal.html";
    //server = server.replace("https://","");
    //server = server.replace("http://","");

    // if( server.includes("localhost") || server.includes("127.0.0.1")){
    //   var htsite = "http://" + username + ":" + password + "@" + server;
    // }else{
    //   var htsite = "https://" + username + ":" + password + "@" + server;
    // }
    
	  window.location = server;

  

  //$("#view_ad_page").append(image_content);
  

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

function sendInquiry(){

  // save te inquiry to database 

  var inquiry_object = Parse.Object.extend("Inquiries");
  var inquiriesObject = new inquiry_object;

  var currentUser = Parse.User.current();
  var userString = JSON.stringify(currentUser);
  var jsonUserData = JSON.parse(userString);

  var inquiry_user_name = document.getElementById("inquiry_user_name").value;
  var inquiry_contact_info = document.getElementById("inquiry_contact_info").value;
  var inquiry_message = document.getElementById("inquiry_message").value;

  //alert("inquiry_name : " + inquiry_user_name + " inquiry_contact_info : " + inquiry_contact_info + " inquiry_message : " + inquiry_message);

  inquiriesObject.set("name",inquiry_user_name);
  inquiriesObject.set("contactInfo",inquiry_contact_info);
  inquiriesObject.set("message",inquiry_message);

  inquiriesObject.save(null, {
        success: function(inquiryObject) {
          // Execute any logic that should take place after the object is saved.
          alert('Your inquiry has been submitted, your inquiry ID is : ' + inquiryObject.id);
          document.getElementById('contact-form').reset();

          // now run the server side code to send emails to the company people
          Parse.Cloud.run('inquirySubmit', {name: inquiry_user_name, contactInfo: inquiry_contact_info, message: inquiry_message, objectId: inquiryObject.id}, {
            success: function(result) {
              // result is 'Hello world!'
              var jsonResult = JSON.stringify(result);
              //alert(jsonResult);
            },
            error: function(error) {
              var jsonResult = JSON.stringify(error);
              //alert("something went wrong sending the request : " + jsonResult);
            }
          });
        },
        error: function(inquiryObject, error) {
          // Execute any logic that should take place if the save fails.
          // error is a Parse.Error with an error code and message.
          alert('Failed to send your request : ' + error.message);
        }
      });


  
}