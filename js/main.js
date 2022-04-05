/* global data */
/* exported data */

var $photoDisplay = document.querySelector('#photo-display');
var $urlInput = document.querySelector('#url');
var $form = document.querySelector('#input-form');
var $entries = document.querySelector('ul.container');
var $tabsContainer = document.querySelector('#tabs');
var $tab = document.querySelectorAll('.tab');
var $view = document.querySelectorAll('.view');
var $newEntryButton = document.querySelector('#new-entry-button');

$urlInput.addEventListener('input', updatePhoto);
$form.addEventListener('submit', saveEntry);
document.addEventListener('DOMContentLoaded', displayingPreviousEntry);
$tabsContainer.addEventListener('click', switchTab);
$newEntryButton.addEventListener('click', switchToForm);

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
  displayNewEntry(obj);
  $photoDisplay.setAttribute('src', 'images/placeholder-image-square.jpg');
}

function updatePhoto(event) {
  $photoDisplay.setAttribute('src', event.target.value);
}

function createLi(obj) {

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

function displayNewEntry(obj) {
  var liElement = createLi(obj);
  $entries.appendChild(liElement);
}

function displayingPreviousEntry(event) {
  if (!data.entries.length) {
    var $noEntry = document.createElement('p');
    var $noEntryDiv = document.createElement('div');
    $noEntryDiv.className = 'width-full full-page padding';
    $noEntry.textContent = 'No entries have been recorded.';
    $noEntry.classList = 'width-full';
    $noEntryDiv.appendChild($noEntry);
    $entries.appendChild($noEntryDiv);
  }
  for (var i = 0; i < data.nextEntryId - 1; i++) {
    var liElement = createLi(data.entries[i]);
    $entries.appendChild(liElement);
  }
}

function switchTab(event) {
  if (!event.target.matches('.tab')) {
    return;
  }
  for (var tabIndex = 0; tabIndex < $tab.length; tabIndex++) {
    if ($tab[tabIndex] === event.target) {
      event.target.classList.add('active');
    } else {
      $tab[tabIndex].classList.remove('active');
    }
  }
  for (var viewIndex = 0; viewIndex < $view.length; viewIndex++) {
    if ($view[viewIndex].getAttribute('data-view') === event.target.getAttribute('data-view')) {
      $view[viewIndex].classList.remove('hidden');
    } else {
      $view[viewIndex].classList.add('hidden');
    }
  }
}

function switchToForm(event) {
  for (var tabIndex = 0; tabIndex < $tab.length; tabIndex++) {
    if ($tab[tabIndex].getAttribute('data-view') === 'entry-form') {
      $tab[tabIndex].classList.add('active');
    } else {
      $tab[tabIndex].classList.remove('active');
    }
  }
  for (var viewIndex = 0; viewIndex < $view.length; viewIndex++) {
    if ($view[viewIndex].getAttribute('data-view') === 'entry-form') {
      $view[viewIndex].classList.remove('hidden');
    } else {
      $view[viewIndex].classList.add('hidden');
    }
  }
}
