function init() {
  // Global variables 
  var dropbox = document.getElementById('dropbox');
  var uploadDest = 'some.php';
  var maxFiles = 2;
  //var allowedFiles = /(.*?)\.(jpeg|jpg|gif|png|pdf)$/;
  //TODO Create maxFiles var

  //TODO Limit file extensions

  //TODO create a function that displays uploded files in our html!!!
  function displayFiles() {

  }

  // AJAX function for file uploads
  function uploadFiles(files) {
    //FormData supports IE 10+ TODO falback
    var formData = new FormData();
    var xhr = new XMLHttpRequest();

    for (var i = 0; i < files.length; i++) {
      //TODO Append in php files array
      console.log('Looping trough passed data', files[i]);
    }

    //On successful upload response, parse JSON data
    //TODO handle response from php server script 
    xhr.onload = function() {
      var data = JSON.parse(this.responseText);
    }

    //Open an AJAX post request
    xhr.open('post', uploadDest);
    xhr.send(formData);
  }

  //Style dropbox on this event
  dropbox.ondragover = function() {
      this.className = 'dropbox dragover';
      return false;
    }
    //Style dropbox on this event
  dropbox.ondragleave = function() {
    this.className = 'dropbox';
    return false;
  }

  // Call uploadFiles function with arguments 
  dropbox.ondrop = function(e) {
    //Prevent default browser behaviour 
    e.preventDefault();

    this.className = 'dropbox';
    console.log(e.dataTransfer.files);
    uploadFiles(e.dataTransfer.files);
  }
}

init();