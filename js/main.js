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

function displayEntry(obj) {

  // <ul class="container" data-view="entries">
  //   <li class="row">
  //     <div class="col-half">
  //       <img src=obj.url>
  //     </div>
  //     <div class="col-half">
  //       <h2>obj.title</h2>
  //       <p>obj.note</p>
  //     </div>
  //   </li>
  // </ul>
  var $li = document.createElement('li');
  var $imgDiv = document.createElement('div');
  var $textDiv = document.createElement('div');
  var $img = document.createElement('img');
  var $h2 = document.createElement('h2');
  var $p = document.createElement('p');

  $p.textContent = obj.notes;
  $h2.textContent = obj.title;
  $img.setAttribute('src', obj.photoURL);

  $li.className = 'row';
  $imgDiv.className = 'col-half';
  $textDiv.className = 'col-half';
  $img.className = 'width-full';

  $textDiv.appendChild($h2);
  $textDiv.appendChild($p);
  $imgDiv.appendChild($img);
  $li.appendChild($imgDiv);
  $li.appendChild($textDiv);
  return $li;
}

displayEntry(data.entries[0]);
