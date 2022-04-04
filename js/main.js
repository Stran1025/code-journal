/* global data */
/* exported data */

var $photoDisplay = document.querySelector('#photo-display');
var $urlInput = document.querySelector('#url');
var $form = document.querySelector('#input-form');

$urlInput.addEventListener('input', updatePhoto);
$form.addEventListener('submit', saveEntry);

function saveEntry(event) {
  event.preventDefault();
  var obj = {};
  obj.entryId = data.nextEntryId;
  obj.title = $form.elements.title.value;
  obj.photoURL = $form.elements.url.value;
  obj.notes = $form.elements.note.value;
  data.nextEntryId++;
  data.entries.unshift(obj);
  $form.reset();
  $photoDisplay.setAttribute('src', 'images/placeholder-image-square.jpg');
}

function updatePhoto(event) {
  $photoDisplay.setAttribute('src', event.target.value);
}
