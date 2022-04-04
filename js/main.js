/* global data */
/* exported data */

var $photoDisplay = document.querySelector('#photo-display');
var $urlInput = document.querySelector('#url-input');

$urlInput.addEventListener('focusout', updatePhoto);

function updatePhoto(event) {
  $photoDisplay.setAttribute('src', event.target.value);
}
