// based on http://www.html5rocks.com/en/tutorials/file/dndfiles/

function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.dataTransfer.files; // FileList object.

  // files is a FileList of File objects. List some properties.
  var output = [];
  for (var i = 0, f; f = files[i]; i++) {
    output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                f.size, ' bytes, last modified: ',
                f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                '</li>');
  }
  document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

// Setup the dnd listeners.
var dropZone = document.getElementById('drop_zone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);
ocument.getElementById('files').addEventListener('change', handleFileSelect, false);




// var fileSelect;

// function setup() {
//   noCanvas();
//   fileSelect = createFileInput(gotFile, 'multiple');
//   fileSelect.parent('sketch-holder');
// }

// function gotFile(file) {
//   var fileDiv = createDiv(file.name );
//   fileDiv.class('boxName');
//   fileDiv.parent('middle-container');
//   if (file.type === 'image') {
//     var img = createImg(file.data);
//     img.class('thumb');
//     img.parent('boxName')
//     // img.parent('sketch-holder');
//   } else if (file.type === 'text') {
//     createDiv(file.data);
//   }
// }