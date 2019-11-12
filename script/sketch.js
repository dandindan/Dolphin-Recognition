// https://teachablemachine.withgoogle.com/models/Px-2qax6/
// Classifier Variable
let classifier;
let img;

// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/Px-2qax6/';

// To store the classification
let label1 = "";
let prob1 = "";
let label2 = "";
let prob2 = "";
let label3 = "";
let prob3 = "";
// Load the model first
function preload() {
    classifier = ml5.imageClassifier('data/model.json');
}



function handleFile(file) {
    print(file);
    if (file.type === 'image') {
        img = createImg(file.data, '');
        img.hide();
    } else {
        img = null;
    }
}

function setup() {
    var canvas = createCanvas(600, 500);
    canvas.parent('sketch-holder');
    input = createFileInput(handleFile);
    input.position(680, 380);

   
}

function draw() {
    background(55, 52, 125);

    if (img) {
        image(img, 0, 0, width, height-60);
        classifyImage()
    }
    
}

// Get a prediction for the current video frame
function classifyImage() {

    classifier.classify(img, gotResult);
    // Draw the label
    
    fill(145,255,0)
    textSize(16);
    textAlign(CENTER);
    
    // for (let i = 0; i > 5; i++) {
    text(label1 + " : " + prob1 + "%", width / 2, height -45);
    fill(200, 106, 255)
    text(label2 + " : " + prob2 + "%", width / 2, height - 25);
    fill(30, 133, 251);
    text(label3 + " : " + prob3 + "%", width / 2, height - 5);
    // }
}

// When we get a result
function gotResult(error, results) {

    //     // If there is an error
    if (error) {
        console.error(error);
        return;
    }
    // The results are in an array ordered by confidence.
    // console.log(results[0]);
    // for (let i = 0; i < 5; i++) {
        
    //     console.log(results[i])
    // };
    label1 = results[0].label;
    prob1 = floor(results[0].confidence * 100);
    
    label2 = results[1].label;
    prob2 = floor(results[1].confidence * 100);

    label3 = results[2].label;
    prob3 = floor(results[2].confidence * 100);
    // let label = results[0].className;
    // let prob = results[0].probability;
    // Classifiy again!
    // classifyImage();
}