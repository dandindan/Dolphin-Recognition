// based on http://www.html5rocks.com/en/tutorials/file/dndfiles/

var fileSelect;

function setup() {
  noCanvas();
  fileSelect = createFileInput(gotFile, 'multiple');
  fileSelect.parent('sketch-holder');
}

function gotFile(file) {
  var fileDiv = createDiv(file.name );
  fileDiv.class('boxName');
  fileDiv.parent('middle-container');
  if (file.type === 'image') {
    var img = createImg(file.data);
    img.class('thumb');
    img.parent('boxName')
    // img.parent('sketch-holder');
  } else if (file.type === 'text') {
    createDiv(file.data);
  }
}