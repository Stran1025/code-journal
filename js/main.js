/* global data */
/* exported data */

var $photoDisplay = document.querySelector('#photo-display');
var $urlInput = document.querySelector('#url');
var $form = document.querySelector('#input-form');
var $entriesContainer = document.querySelector('ul.container');
var $tabsContainer = document.querySelector('#tabs');
var $tab = document.querySelectorAll('.tab');
var $view = document.querySelectorAll('.view');
var $newEntryButton = document.querySelector('#new-entry-button');
var $newEntryHeading = document.querySelector('#new-entry-heading');
var $editEntryHeading = document.querySelector('#edit-entry-heading');
var $deleteEntry = document.querySelector('.delete-entry');
var $deleteModal = document.querySelector('#delete-modal');
var $modalCancel = document.querySelector('.modal-cancel-button');
var $modalConfirm = document.querySelector('.modal-confirm-button');
var $searchInput = document.querySelector('#search-input');
var $searchButton = document.querySelector('#search-button');

$urlInput.addEventListener('input', updatePhoto);
$form.addEventListener('submit', saveEntry);
document.addEventListener('DOMContentLoaded', displayingPreviousEntry);
$tabsContainer.addEventListener('click', switchTab);
$newEntryButton.addEventListener('click', newForm);
$entriesContainer.addEventListener('click', editEntry);
$deleteEntry.addEventListener('click', toggleDeleteModal);
$modalCancel.addEventListener('click', toggleDeleteModal);
$modalConfirm.addEventListener('click', deleteEntry);
$searchButton.addEventListener('click', searchEntry);

function searchEntry(event) {
  if ($searchInput.value === undefined || $searchInput.value === '') {
    return;
  }
  var $entries = document.querySelectorAll('li.entry');
  for (var entryIndex = 0; entryIndex < data.entries.length; entryIndex++) {
    if (data.entries[entryIndex].title.includes($searchInput.value)) {
      continue;
    } else {
      $entries[entryIndex].classList.add('hidden');
    }
  }
}

function deleteEntry(event) {
  for (var entryIndex = 0; entryIndex < data.entries.length; entryIndex++) {
    if (Number.parseInt(data.entries[entryIndex].entryId) === Number.parseInt(data.editing.entryId)) {
      var toBeDeleted = document.querySelector('.entry-' + data.entries[entryIndex].entryId);
      data.entries.splice(entryIndex, 1);
      toBeDeleted.remove();
    }
  }
  data.editing = null;
  $deleteModal.classList.toggle('hidden');
  switchToEntries();
}

function toggleDeleteModal(event) {
  $deleteModal.classList.toggle('hidden');
}

function editEntry(event) {
  if (!event.target.hasAttribute('data-edit-id')) {
    return;
  }
  $deleteEntry.classList.remove('hidden');
  $newEntryHeading.classList.add('hidden');
  $editEntryHeading.classList.remove('hidden');
  for (var entryIndex = 0; entryIndex < data.entries.length; entryIndex++) {
    if (Number.parseInt(event.target.getAttribute('data-edit-id')) === Number.parseInt(data.entries[entryIndex].entryId)) {
      data.editing = data.entries[entryIndex];
      break;
    }
  }
  switchToForm(data.editing);
}

function saveEntry(event) {
  event.preventDefault();
  var obj = {};
  if (data.editing !== null) {
    obj.title = $form.elements.title.value;
    obj.photoURL = $form.elements.url.value;
    obj.notes = $form.elements.note.value;
    obj.entryId = data.editing.entryId;
    displayNewEntry(obj);
    $editEntryHeading.classList.add('hidden');
    $newEntryHeading.classList.remove('hidden');
    data.editing = null;
    return;
  }
  obj.entryId = data.nextEntryId;
  obj.title = $form.elements.title.value;
  obj.photoURL = $form.elements.url.value;
  obj.notes = $form.elements.note.value;
  data.nextEntryId++;
  data.entries.unshift(obj);
  $form.reset();
  displayNewEntry(obj);
  $photoDisplay.setAttribute('src', 'images/placeholder-image-square.jpg');
  switchToEntries();
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
  //       <div>
  //         <h2>obj.title</h2>
  //         <i class fa-solid fa-pen></i>
  //       </div>
  //       <p>obj.note</p>
  //     </div>
  //   </li>
  // </ul>

  var $li = document.createElement('li');
  var $imgDiv = document.createElement('div');
  var $textDiv = document.createElement('div');
  var $headerDiv = document.createElement('div');
  var $img = document.createElement('img');
  var $h2 = document.createElement('h2');
  var $icon = document.createElement('i');
  var $p = document.createElement('p');

  $p.textContent = obj.notes;
  $h2.textContent = obj.title;
  $img.setAttribute('src', obj.photoURL);
  $icon.setAttribute('data-edit-id', obj.entryId);

  $li.className = 'row';
  $imgDiv.className = 'col-half';
  $textDiv.className = 'col-half';
  $img.className = 'width-full';
  $icon.className = 'fas fa-pen text-right center-height';
  $headerDiv.className = 'flex separate-content';
  $li.classList.add('entry-' + obj.entryId);
  $li.classList.add('entry');

  $headerDiv.appendChild($h2);
  $headerDiv.appendChild($icon);
  $textDiv.appendChild($headerDiv);
  $textDiv.appendChild($p);
  $imgDiv.appendChild($img);
  $li.appendChild($imgDiv);
  $li.appendChild($textDiv);
  return $li;
}

function displayNewEntry(obj) {
  if (data.editing !== null) {
    for (var entryIndex = 0; entryIndex < data.entries.length; entryIndex++) {
      if (Number.parseInt(data.entries[entryIndex].entryId) === Number.parseInt(obj.entryId)) {
        data.entries.splice(entryIndex, 1, obj);
      }
    }
    var oldLiElement = document.querySelector('.entry-' + obj.entryId);
    var editedLiElement = createLi(obj);
    oldLiElement.replaceWith(editedLiElement);
    $form.reset();
    $photoDisplay.setAttribute('src', 'images/placeholder-image-square.jpg');
    switchToEntries();
    return;
  }
  var liElement = createLi(obj);
  var topEntry = document.querySelector('li.entry');
  $entriesContainer.insertBefore(liElement, topEntry);
  switchToEntries();
  var noEntry = document.querySelector('.no-entry');
  noEntry.remove();
}

function displayingPreviousEntry(event) {
  if (!data.entries.length) {
    var $noEntry = document.createElement('p');
    var $noEntryDiv = document.createElement('div');
    $noEntryDiv.className = 'width-full full-page padding no-entry';
    $noEntry.textContent = 'No entries have been recorded.';
    $noEntry.classList = 'width-full';
    $noEntryDiv.appendChild($noEntry);
    $entriesContainer.appendChild($noEntryDiv);
  }
  for (var i = 0; i < data.nextEntryId - 1; i++) {
    var liElement = createLi(data.entries[i]);
    $entriesContainer.appendChild(liElement);
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

function newForm(event) {
  switchToForm();
}

function switchToForm(obj) {
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
  if (obj === undefined) {
    return;
  }
  $form.elements.title.value = obj.title;
  $form.elements.url.value = obj.photoURL;
  $form.elements.note.value = obj.notes;
}

function switchToEntries() {
  for (var tabIndex = 0; tabIndex < $tab.length; tabIndex++) {
    if ($tab[tabIndex].getAttribute('data-view') === 'entries') {
      $tab[tabIndex].classList.add('active');
    } else {
      $tab[tabIndex].classList.remove('active');
    }
  }
  for (var viewIndex = 0; viewIndex < $view.length; viewIndex++) {
    if ($view[viewIndex].getAttribute('data-view') === 'entries') {
      $view[viewIndex].classList.remove('hidden');
    } else {
      $view[viewIndex].classList.add('hidden');
    }
  }
}
