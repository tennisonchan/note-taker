(function(window, $) {
  'use strict';

  const ENTER_KEY = 13;
  const ESC_KEY = 27;
  let _storage = null;

  function App(storage) {
    console.log('App.init');

    _storage = storage;
    this.defaultColor = 'white';
    this.$notes = $('#nt-notes');
    this.$input = $('#add-note-input');
    this.$addButton = $('.add-button');
    this.$addNote = $('.add-note');

    this.addEventListeners();
    this.render();
  }

  App.prototype.addEventListeners = function() {
    this.$input.on('input', this.onTyping.bind(this));
    this.$input.on('keydown', this.onAddingNote.bind(this));
    this.$addButton.on('click', this.onAddNote.bind(this));
    this.$notes.on('click', '.delete', this.onDeleteNote.bind(this));
    this.$notes.on('focus', '.note', this.onFocusEdit.bind(this));
    this.$notes.on('blur', '.note', this.onBlurEdit.bind(this) );
  }

  App.prototype.render = function() {
    _storage.findAll((items) => {
      let nodes = $(items).map((i, item) => this.noteItem(item));
      this.$notes.append(nodes);
    });
  }

  App.prototype.onAddNote = function(evt) {
    let text = this.$input.get(0).innerText;
    if(text) {
      this.addNote(text);
      this.$input.text('');
      this.$addNote.toggleClass('typing', false);
    }
  }

  App.prototype.onTyping = function(evt) {
    let text = evt.target.innerText;
    this.$addNote.toggleClass('typing', !!text);
  }

  App.prototype.onAddingNote = function(evt) {
    if(evt.keyCode === ENTER_KEY && (evt.metaKey || evt.ctrlKey)) {
      this.onAddNote(evt);
    }
  }

  App.prototype.onDeleteNote = function(evt) {
    this.deleteNote(getItemId(evt.target));
  }

  App.prototype.onFocusEdit = function(evt) {
    this.onStartEditing(evt);
  }

  App.prototype.onStartEditing = function(evt) {
    let $li = $(evt.target).parents('li');
    this.currentId = Number($li.data('id'));

    $li.addClass('editing');
  }

  App.prototype.onEditingDone = function(event) {
    if(event.keyCode === ENTER_KEY) {
      event.target.blur();
    }
  }

  App.prototype.onBlurEdit = function(evt) {
    let $input = $(evt.target);
    let id = getItemId($input);
    let text = evt.target.innerText.trim();
    let $li = $(`[data-id="${id}"]`);

    if($input.data('isCanceled')) {
      this.onEndEditing($li);
    } else {
      if(text) {
        let item = {
          id: id,
          text: text,
          color: this.defaultColor
        };
        _storage.save(item, () => {
          this.onEndEditing($li, text);
        });
      } else {
        this.deleteNote(id);
      }
    }
  }

  App.prototype.onEndEditing = function($li, text) {
    $li.removeClass('editing')

    if(text) {
      $li.find('span').html(text);
    }
  }

  function getItemId(el) {
    return Number($(el).parents('li').data('id'));
  }

  App.prototype.addNote = function(text) {
    let item = { text: text, color: this.defaultColor };

    _storage.save(item, (item) => {
      let element = this.noteItem(item);
      this.$notes.append(element);
    });
  }

  App.prototype.deleteNote = function(id) {
    _storage.delete(id, () => {
      $(`[data-id="${id}"]`).remove();
    });
  }

  App.prototype.noteItem = function(item) {
    let { color, id, text } = item;
    let $note = $('<div/>', { class: `note ${color} shadow` });
    let $deleteButton = $('<button/>', { class: 'delete' });
    let $content = $('<div/>', {
      contenteditable: true,
      text: text
    });
    $note.append($content, $deleteButton);

    return $('<li/>', { 'data-id': id })
      .append($note)
      .get(0);
  }

  $(function() {
    window.NoteTaker = new App(new Storage('note-taker'));
  });

})(window, jQuery)