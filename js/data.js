/* exported data */

var data = {
  view: 'entry-form',
  entries: [],
  editing: null,
  nextEntryId: 1
};

if (localStorage.getItem('entry-data') !== null) {
  data = JSON.parse(localStorage.getItem('entry-data'));
}

window.addEventListener('beforeunload', saveData);

function saveData(event) {
  localStorage.setItem('entry-data', JSON.stringify(data));
}
