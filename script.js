// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
const form = document.getElementById("generate-meme");
const canvas  = document.getElementById("user-image");
const context = canvas.getContext('2d');
const fileName = document.getElementById('image-input')
const clear_button = document.querySelector("[type='reset']");
const read_button = document.querySelector("[type='button']");
const generate_button = document.querySelector("[type='submit']");
const voice_button = document.getElementById("voice-selection");
var top = document.getElementById('text-top');
var down = document.getElementById('text-bottom');
const voiceSelect = document.querySelector('select');
const slider = document.querySelector("[type='range']");
const volume_img = document.querySelector('img');
const volumeGroup = document.getElementById('volume-group')
const volume_value = volumeGroup.querySelector("[type='range']")
const synth = window.speechSynthesis;


var voices = [];
voice_button.disabled = false;
function populateVoiceList() {
  voices = synth.getVoices();
  document.querySelector("#voice-selection > option").remove()

  var option = document.createElement('option');
  option.textContent = voices[0].name + ' (' + voices[0].lang + ')';
  option.textContent += ' -- DEFAULT';
  option.setAttribute('data-lang', voices[0].lang);
  option.setAttribute('data-name', voices[0].name);
  voiceSelect.appendChild(option);

  for(var i = 1; i < voices.length; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
}

populateVoiceList();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = populateVoiceList;
}
var flag = false;
read_button.addEventListener('click', () => {
  var utterance = new SpeechSynthesisUtterance(top.value + " " + down.value);
  var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');

  for(var i = 0; i < voices.length ; i++) {
    if(voices[i].name === selectedOption) {
      utterance.voice = voices[i];
    }
  }
  utterance.volume = volume_value.value / 100;
  synth.speak(utterance);
});

slider.addEventListener('input',() =>{
  if (volume_value.value >= 67 && volume_value.value <= 100){
    volume_img.src="icons/volume-level-3.svg";
    volume_img.alt="Volume Level 3";
  }
  //level 2
  if (volume_value.value >= 34 && volume_value.value <= 66){
    volume_img.src="icons/volume-level-2.svg";
    volume_img.alt="Volume Level 2";

  }

  //level1
  if (volume_value.value >= 1 && volume_value.value <= 33){
    volume_img.src="icons/volume-level-1.svg";
    volume_img.alt="Volume Level 1";

  }

  //level0
  if (volume_value.value == 0){
    volume_img.src="icons/volume-level-0.svg";
    volume_img.alt="Volume Level 0";

  }

});

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO
  // clear the canvas?
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = 'black'; 
  context.fillRect(0, 0, canvas.width, canvas.height); 
  var coordinate = getDimmensions(canvas.width, canvas.height, img.width, img.height)
  context.drawImage(img, coordinate.startX, coordinate.startY, coordinate.width, coordinate.height)
  generate_button.disabled = false
  read_button.disabled = true
  clear_button.disabled = true

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

fileName.addEventListener('change', () =>{
  img.src = URL.createObjectURL(fileName.files[0]);
  img.alt = fileName.files[0].name;
});

// button? click?
form.addEventListener('submit',(event) =>{
  event.preventDefault();
  var top = document.getElementById('text-top').value;
  var down = document.getElementById('text-bottom').value; 
  context.font = "30px Arial"; 
  context.fillStyle = 'white'; 
  context.textAlign = "center"; 
  context.fillText(top, 200, 30); 
  context.fillText(down, 200, 380); 

  generate_button.disabled = true;
  clear_button.disabled = false;
  read_button.disabled = false;
})

clear_button.addEventListener('click', () => {
  context.clearRect(0, 0, canvas.width,canvas.height);
  generate_button.disabled = false;
  clear_button.disabled = true; 
  read_button.disabled = true;
});



/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
