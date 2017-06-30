(function(window, $) {
  'use strict';

  const ENTER_KEY = 13;

  function App(storage) {
    this.storage = storage;
    console.log('App.init');
    this.$notes = $('#nt-notes');
    this.$input = $('#nt-add-note');

    this.addEventListeners();
    this.render();
  }

  App.prototype.addEventListeners = function() {
    this.$input.on('keypress', this.onAddNote.bind(this));
  }

  App.prototype.render = function() {
    this.storage.findAll((items) => {
      let nodes = $(items).map((i, item) => this.noteItem(item));
      this.$notes.append(nodes);
    });
  };

  App.prototype.onAddNote = function(evt) {
    let element = evt.target;
    let text = element.value.trim();
    if(text && evt.keyCode === ENTER_KEY) {
      this.addNote(text);
      element.value = '';
    }
  }

  App.prototype.addNote = function(text) {
    let item = { text: text, color: 'white' };

    this.storage.save(item, (item) => {
      let element = this.noteItem(item);
      this.$notes.append(element);
    });
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
    window.NoteTaker = new App(new Storage('note-taker'));
  });

})(window, jQuery)