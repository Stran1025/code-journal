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

$urlInput.addEventListener('input', updatePhoto);
$form.addEventListener('submit', saveEntry);
document.addEventListener('DOMContentLoaded', displayingPreviousEntry);
$tabsContainer.addEventListener('click', switchTab);
$newEntryButton.addEventListener('click', switchTab);
$entriesContainer.addEventListener('click', editEntry);
$deleteEntry.addEventListener('click', toggleDeleteModal);
$modalCancel.addEventListener('click', toggleDeleteModal);
$modalConfirm.addEventListener('click', deleteEntry);
$searchInput.addEventListener('search', searchEntry);

function searchEntry(event) {
  var $entries = document.querySelectorAll('li.entry');
  if ($searchInput.value === undefined || $searchInput.value === '') {
    for (var liIndex = 0; liIndex < $entries.length; liIndex++) {
      $entries[liIndex].classList.remove('hidden');
    }
  }
  for (var entryIndex = 0; entryIndex < data.entries.length; entryIndex++) {
    if (data.entries[entryIndex].title.includes($searchInput.value) || data.entries[entryIndex].notes.includes($searchInput.value) || data.entries[entryIndex].tags.includes($searchInput.value) || data.entries[entryIndex].date.includes($searchInput.value)) {
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
  data.view = 'entries';
  loadTab(data.view);
}

function toggleDeleteModal(event) {
  $deleteModal.classList.toggle('hidden');
}

function editEntry(event) {
  if (!event.target.hasAttribute('data-edit-id')) {
    return;
  }
  $editEntryHeading.classList.remove('hidden');
  $newEntryHeading.classList.add('hidden');
  $deleteEntry.classList.remove('hidden');
  for (var entryIndex = 0; entryIndex < data.entries.length; entryIndex++) {
    if (Number.parseInt(event.target.getAttribute('data-edit-id')) === Number.parseInt(data.entries[entryIndex].entryId)) {
      data.editing = data.entries[entryIndex];
      break;
    }
  }
  $form.elements.tags.value = data.editing.tags;
  $form.elements.title.value = data.editing.title;
  $photoDisplay.setAttribute('src', data.editing.photoURL);
  $form.elements.url.value = data.editing.photoURL;
  $form.elements.note.value = data.editing.notes;
  data.view = 'entry-form';
  loadTab(data.view);
}

function saveEntry(event) {
  $editEntryHeading.classList.add('hidden');
  $newEntryHeading.classList.remove('hidden');
  $deleteEntry.classList.add('hidden');
  event.preventDefault();
  var obj = {};
  obj.photoURL = $form.elements.url.value;
  obj.notes = $form.elements.note.value;
  obj.title = $form.elements.title.value;
  obj.tags = $form.elements.tags.value;
  if (data.editing !== null) {
    obj.entryId = data.editing.entryId;
    obj.date = data.editing.date;
  } else {
    obj.date = new Date();
    obj.entryId = data.nextEntryId;
    data.nextEntryId++;
    data.entries.unshift(obj);
  }
  displayNewEntry(obj);
  data.view = 'entries';
  loadTab(data.view);
  $form.reset();
  $photoDisplay.setAttribute('src', 'images/placeholder-image-square.jpg');
}

function updatePhoto(event) {
  $photoDisplay.setAttribute('src', event.target.value);
}

function createLi(obj) {

  // <ul class="container" data-view="entries">
  //   <li class="row">
  //     <div class="col-half">
  //       <p>Month Day Year</p>
  //       <img src=obj.url>
  //     </div>
  //     <div class="col-half">
  //       <div>
  //         <h2>obj.title</h2>
  //         <i class fa-solid fa-pen></i>
  //       </div>
  //       <p>Tags:<span>tag1</span><span>tag2</span>
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
  var $tagContainer = document.createElement('div');
  var $note = document.createElement('p');
  var $tagheading = document.createElement('p');
  var $date = document.createElement('p');
  if (obj.tags !== undefined) {
    var tags = obj.tags.split(',');
  } else {
    tags = 0;
  }

  $note.textContent = obj.notes;
  $h2.textContent = obj.title;
  $img.setAttribute('src', obj.photoURL);
  $icon.setAttribute('data-edit-id', obj.entryId);
  $tagheading.textContent = 'Tags:';
  $date.textContent = 'Date Created: ' + obj.date.slice(4, 15);

  $li.className = 'row';
  $li.classList.add('entry');
  $li.classList.add('entry-' + obj.entryId);
  $imgDiv.className = 'col-half';
  $img.className = 'width-full';
  $textDiv.className = 'col-half';
  $headerDiv.className = 'flex separate-content';
  $icon.className = 'fas fa-pen text-right center-height';
  $tagContainer.className = 'tag-container';
  $tagheading.className = 'tag-heading';
  $date.className = 'date';

  if (tags) {
    for (var tagIndex = 0; tagIndex < tags.length; tagIndex++) {
      var $tag = document.createElement('p');
      $tag.textContent = tags[tagIndex];
      $tag.className = 'tag';
      $tagContainer.appendChild($tag);
    }
  }
  $tagContainer.prepend($tagheading);
  $headerDiv.appendChild($h2);
  $headerDiv.appendChild($icon);
  $textDiv.appendChild($headerDiv);
  $textDiv.appendChild($tagContainer);
  $textDiv.appendChild($note);
  $imgDiv.appendChild($date);
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
    data.editing = null;
  } else {
    var liElement = createLi(obj);
    var topEntry = document.querySelector('li.entry');
    $entriesContainer.insertBefore(liElement, topEntry);
    var $noEntry = document.querySelector('#no-entry');
    $noEntry.classList.add('hidden');
  }
}

function displayingPreviousEntry(event) {
  if (!data.entries.length) {
    var $noEntry = document.querySelector('#no-entry');
    $noEntry.classList.remove('hidden');
  }
  for (var i = 0; i < data.nextEntryId - 1; i++) {
    var liElement = createLi(data.entries[i]);
    $entriesContainer.appendChild(liElement);
  }
  loadTab(data.view);
}

function switchTab(event) {
  if (!event.target.matches('.tab')) {
    return;
  }
  for (var tabIndex = 0; tabIndex < $tab.length; tabIndex++) {
    if ($tab[tabIndex] === event.target) {
      data.view = $tab[tabIndex].getAttribute('data-view');
      loadTab(data.view);
    }
  }

}

function loadTab(str) {
  for (var tabIndex = 0; tabIndex < $tab.length; tabIndex++) {
    if ($tab[tabIndex].getAttribute('data-view') === str) {
      $tab[tabIndex].classList.add('active');
    } else {
      $tab[tabIndex].classList.remove('active');
    }
  }
  for (var viewIndex = 0; viewIndex < $view.length; viewIndex++) {
    if ($view[viewIndex].getAttribute('data-view') === str) {
      $view[viewIndex].classList.remove('hidden');
    } else {
      $view[viewIndex].classList.add('hidden');
    }
  }
}
