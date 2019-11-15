// highlight drag area 
var fileinput = document.querySelector('.file-input');
var filedroparea = document.querySelector('.file-drop-area');
var jssetnumber = document.querySelector('.js-set-number');
fileinput.addEventListener('dragenter', isactive);
fileinput.addEventListener('focus', isactive);
fileinput.addEventListener('click', isactive);

// back to normal state
fileinput.addEventListener('dragleave', isactive);
fileinput.addEventListener('blur', isactive);
fileinput.addEventListener('drop', isactive);

// add Class
function isactive() {
  filedroparea.classList.add('is-active');
}

// change inner text
fileinput.addEventListener('change', function() {
  var count = fileinput.files.length;
  if (count === 1) {
    // if single file then show file name
    jssetnumber.innerText = fileinput.value.split('\\').pop();
  } else {
    // otherwise show number of files
    jssetnumber.innerText = count + ' files selected';
  }
});