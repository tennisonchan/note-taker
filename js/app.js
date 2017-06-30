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
    this.$input = $('#nt-add-note');

    this.addEventListeners();
    this.render();
  }

  App.prototype.addEventListeners = function() {
    this.$input.on('keypress', this.onAddNote.bind(this));
    this.$notes.on('click', '.delete', this.onDeleteNote.bind(this));
    this.$notes.on('click', '.edit', this.onEditNote.bind(this));
    this.$notes.on('keyup', '.edit-input', this.onEditingCancel.bind(this));
    this.$notes.on('blur', '.edit-input', this.onEditingLeave.bind(this) );
  }

  App.prototype.render = function() {
    _storage.findAll((items) => {
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

  App.prototype.onDeleteNote = function(evt) {
    this.deleteNote(getItemId(evt.target));
  };

  App.prototype.onEditNote = function(evt) {
    this.onStartEditing(evt);
  };

  App.prototype.onStartEditing = function(evt) {
    let $li = $(evt.target).parents('li');
    this.currentId = Number($li.data('id'));

    $li
      .addClass('editing')
      .find('.edit-input')
      .val($li.text())
      .focus();
  };

  App.prototype.onEditingDone = function(event) {
    if(event.keyCode === ENTER_KEY) {
      event.target.blur();
    }
  };

  App.prototype.onEditingCancel = function(evt) {
    if(evt.keyCode === ESC_KEY) {
      evt.target.dataset.isCanceled = true;
      evt.target.blur();
    }
  };

  App.prototype.onEditingLeave = function(evt) {
    let $input = $(evt.target);
    let id = getItemId($input);
    let text = $input.val().trim();
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
  };

  App.prototype.onEndEditing = function($li, text) {
    $li
      .removeClass('editing')
      .find('.edit-input')
      .removeAttr('data-is-canceled');

    if(text) {
      $li.find('span').html(text);
    }
  };

  function getItemId(el) {
    return Number($(el).parents('li').data('id'));
  };

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
  };

  App.prototype.noteItem = function(item) {
    let { color, id, text } = item;
    let $div = $('<div/>', { class: `note ${color}` });
    let $deleteButton = $('<button/>', { class: 'delete' });
    let $editButton = $('<button/>', { class: 'edit' });
    let $editInput = $('<input/>', {
      class: 'edit-input',
      type: 'text'
    });
    let $span = $('<span/>', {
      text: text
    });
    $div.append($span, $editButton, $deleteButton);

    return $('<li/>', { 'data-id': id })
      .append($div, $editInput)
      .get(0);
  }

  $(function() {
    window.NoteTaker = new App(new Storage('note-taker'));
  });

})(window, jQuery)