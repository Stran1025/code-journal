/* global data */
/* exported data */

var $photoDisplay = document.querySelector('#photo-display');
var $urlInput = document.querySelector('#url');
var $form = document.querySelector('#input-form');

$urlInput.addEventListener('focusout', updatePhoto);
$form.addEventListener('submit', saveEntry);

function saveEntry(event) {
  event.preventDefault();
  var obj = {};
  obj.title = $form.elements.title.value;
  obj.photoURL = $form.elements.url.value;
  obj.notes = $form.elements.note.value;
}

function updatePhoto(event) {
  if (event.target.value === '') {
    return;
  }
  $photoDisplay.setAttribute('src', event.target.value);
}
