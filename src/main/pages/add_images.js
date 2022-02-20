window.onload = function() {
  document.getElementById("add_images_button").onclick = addImagesSubmit;
}

function addImagesSubmit() {

  var request = {
    googleImageApiUrl: document.getElementById("googleImageApiUrl").value,
    tag: document.getElementById("tag").value,
    expectedClasses: document.getElementById("expectedClasses").value,
    annotationGroupIdentifier: document.getElementById("annotationGroupIdentifier").value
  }

  document.getElementById("loading").style.display = 'inline';
  document.getElementById("success_message").style.display = 'none';
  document.getElementById("error_message").style.display = 'none';
  document.getElementById('error_message_text').innerHTML = ""
  document.getElementById('success_message_text').innerHTML = ""

  fetch("/admin/image/bulk/from/google", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + window.localStorage.getItem("access_token")
      },
      body: JSON.stringify(request)
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(jsonResponse) {
      document.getElementById("loading").style.display = 'none';
      if (jsonResponse.code != 200) {
        document.getElementById("error_message").style.display = 'inline';
        document.getElementById('error_message_text').innerHTML = jsonResponse.message
      } else {
        document.getElementById("success_message").style.display = 'inline';
        document.getElementById('success_message_text').innerHTML = jsonResponse.content.length + " images were registered"

        document.getElementById("googleImageApiUrl").value = "";
        document.getElementById("tag").value = "";
        document.getElementById("expectedClasses").value = "";
        document.getElementById("annotationGroupIdentifier").value = "";
      }
    });

}
