var DropFileUploader = function(options) {
  this.extend(this.config, options);

  this.init();
};


DropFileUploader.prototype = {
  // Default options
  config: {
      url: 'index.php',                           // The URL to send the files to
      method: 'post',                             // The request method to use (GET/PUT/POST/DELETE)
      limit: 3,                                   // The limit of files that can be send at once
      allowed: ['image/jpeg', 'image/png'],       // The allowed file type, files are checked on MIME-type
      data: { },                                  // Additional data to send to the server
      onStart: function() {                       // Callback function on start of the upload
      },
      onProgress: function() {                    // Callback function on progress of the upload
      },
      onComplete: function(data) {                // Callback function on completion of the upload
          console.log(data);
      },
      onError: function() {                       // Callback function on error of the upload
      }
  },

  // Elements
  $dropbox: document.getElementById('dd-dropbox'),
  $previewer: document.getElementById('dd-previewer'),
  $fileInputBtn: document.getElementById('dd-fileInputBtn'),

  /** --------------------------------------------------------------------------------------
   * Initialize, set listeners for the drag and drop events and the file select button 
   */
  init: function() {
      var self = this;

      // If the dropbox has a 'upload' button, create the hidden form with the file input element to associate the button with
      if(self.$fileInputBtn) {
          self.createForm();
      }



      /* EVENTS START --------------------------------------------------------------------------- */

      // DRAGENTER
      self.$dropbox.addEventListener('dragenter', function(e) {
          self.cancelEvent(e);

          self.$dropbox.style.borderColor='#4FB2F0';
      });

      // DRAGEXIT
      self.$dropbox.addEventListener('dragexit', function(e) {
          self.cancelEvent(e);
          
          self.$dropbox.style.borderColor='#dddddd';
      });

      // DRAGOVER
      self.$dropbox.addEventListener('dragover', function(e) {
          self.cancelEvent(e);
      });

      // DROP
      self.$dropbox.addEventListener('drop', function(e) {
          self.cancelEvent(e);

          self.$dropbox.style.borderColor='#dddddd';

          // Process the files
          self.process(e.dataTransfer.files);
      });

      if(self.$fileInputBtn) {
          // Upload button click
          self.$fileInputBtn.addEventListener('click', function(e) {
              // 'Click' the file input element to open up the file dialog
              self.$fileInput.click();
          });

          // File input change
          self.$fileInput.addEventListener('change', function(e) {
              // Process the files
              self.process(self.$fileInput.files);
          });
      }

      /* EVENTS END ----------------------------------------------------------------------------- */
  },

  /** --------------------------------------------------------------------------------------
   * Extend the default settings with the user options
   */
  extend: function(target, source) {
      var self = this;

      target = target || {};
      
      for (var prop in source) {
          if (typeof source[prop] === 'object') {
              target[prop] = self.extend(target[prop], source[prop]);
          } else {
              target[prop] = source[prop];
          }
      }
      return target;
  },

  /** --------------------------------------------------------------------------------------
   * Process the files, read each file and set the onload event, next upload the file
   */
  process: function(files) {
      var self   = this,
          length = files.length;

      // Clear the previews container
      if(self.$previewer)
          self.$previewer.innerHTML = '';

      // Check the limit
      if(length > self.config.limit) {
          console.log('You can only upload ' + self.config.limit + ' files at a time');
          return;
      }

      for(var i=0; i<files.length; i++) {

          (function(file, index) {

              file['index'] = index;

              // If the file type allowed?
              if(self.config.allowed.length < 0) {
                  if( ! isAllowed(file.type)) {
                      console.log('File type: ' + file.type + ' is not allowed');
                      return;
                  }
              }

              if(self.$previewer) {
                  var reader = new FileReader();

                  // When the file is loaded (not uploaded!)
                  reader.onload = function(e) {
                      self.preview(file, e.target.result);
                  }

                  // Read the file
                  reader.readAsDataURL(file);
              }

              // Upload the file
              self.upload(file);

          })(files[i], i);
      }
  },

  /** --------------------------------------------------------------------------------------
   * Create a preview image for the file that is being uploaded and set a data attribute for the index of the file
   */
  preview: function(file, src) {
      var self = this,
          img  = document.createElement('img');

      // Save the index for this file in de data-attribute so the preview <img/> can be found again when the upload is complete   
      img.setAttribute('data-index', file.index);
      img.className = img.className +  ' dd-upload-pending';
      img.src = src;

      self.$previewer.appendChild(img);
  },

  /** --------------------------------------------------------------------------------------
   * Upload the file, create a new XHR object and set the event handlers
   */
  upload: function(file) {
      var self     = this,
          xhr      = new window.XMLHttpRequest(),
          formData = new window.FormData();

      xhr.open(self.config.method, self.config.url);

      // Start
      xhr.upload.onloadstart = function(e) {
          // Call the start callback function
          if(typeof self.config.onComplete == 'function')
              self.config.onStart();
      };

      // Complete
      xhr.onreadystatechange = function() {
          if(xhr.readyState == 4) {
              // Get the image that is uploaded by it's index
              if(self.$previewer) {
                  var img = self.$previewer.querySelector('img[data-index="' + file.index + '"]');

                  img.className = img.className.replace(' dd-upload-pending','') + ' dd-upload-success';
              }

              // Call the complete callback function
              if(typeof self.config.onComplete == 'function')
                  self.config.onComplete(JSON.parse(xhr.responseText));
          }
      };

      // Progress
      xhr.upload.onprogress = function(e) {
          var progress = e.loaded / e.total * 100;

          // Call the progress callback function
          if(typeof self.config.onComplete == 'function')
              self.config.onProgress();
      };

      // Error
      xhr.upload.onerror = function(e) {
          img.className = img.className.replace(' dd-upload-pending','') + ' dd-upload-error';

          // Call the error callback function
          if(typeof self.config.onComplete == 'function')
              self.config.onError();
      };

      // Add additional data to the request
      if(self.config.data) {
          for(prop in self.config.data) {
              formData.append(prop, self.config.data[prop]);
          }
      }


      // Add file data
      formData.append('file', file);

      // Make the request
      xhr.send(formData);
  },

  /** --------------------------------------------------------------------------------------
   * Create the form that is used to send the file to the server 
   */
  createForm: function() {
      var self  = this,
          input = document.createElement('input');

      input.setAttribute('id', 'dd-fileInput');
      input.setAttribute('type', 'file');

      document.body.insertBefore(input, self.$dropbox);
  
      self.$fileInput = document.getElementById('dd-fileInput');

      self.$fileInput.style.display = 'none';
  },

  /** --------------------------------------------------------------------------------------
   * See if the MIME-type of the file is allowed by checking if it is in the config.allowed array
   */
  isAllowed: function(type) {
      var self = this;

      return (new RegExp('(' + self.config.allowed.join('|').replace(/\./g, '\\.') + ')$')).test(type);
  },

  /** --------------------------------------------------------------------------------------
   * Stop event bubbling with the drag and drop events
   */
  cancelEvent: function(e) {
      e.preventDefault();
      e.stopPropagation();
  }
};

(function(window, document, undefined) {
  // Create a new DropFileUploader
  var uploader = new DropFileUploader({
      url: 'upload.php',
      allowed: ['image/jpeg', 'image/png'],
      data: { id: 2 },
      limit: 3
  });
}(window, document, undefined));