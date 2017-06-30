(function(window, $) {
  'use strict';

  const ENTER_KEY = 13;

  function App() {
    console.log('App.init');
    this.$notes = $('#nt-notes');
    this.$addNote = $('#nt-add-note');

    this.addEventListeners();
  }

  App.prototype.addEventListeners = function() {
    this.$addNote.on('keypress', this.onAddNote.bind(this));
  }

  App.prototype.onAddNote = function(evt) {
    debugger;
    let element = evt.target;
    let text = element.value.trim();
    if(text && evt.keyCode === ENTER_KEY) {
      this.addNote(text);
      element.value = '';
    }
  }

  App.prototype.addNote = function(text) {
    let item = { text: text, color: 'white' };

    let element = this.noteItem(item);
    this.$notes.append(element);
  }

  App.prototype.noteItem = function(item) {
    let { color, id, text } = item;
    let $div = $('<div/>', { class: `note-taker ${color}` });
    let $delete = $('<button/>', { class: 'delete' });
    let $span = $('<span/>', {
      class: 'note-taker',
      text: text
    });
    $div.append($span, $delete);

    return $('<li/>', { 'data-id': id })
      .append($div)
      .get(0);
  }

  $(function() {
    window.NoteTaker = new App();
  });

})(window, jQuery)