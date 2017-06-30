(function(window) {
  'use strict';

  let _store = window.localStorage;
  let _key = 'app';

  let Storage = function(key) {
    _key = key;

    if(!_store[_key]) {
      this.reset();
    }
  }

  Storage.prototype.find = function(id, callback) {
    let items = this.findAll();
    let item = items.filter((item) => id === item.id);

    callback && callback(item[0] || {});
  }

  Storage.prototype.findAll = function(callback) {
    let items = JSON.parse(_store[_key]);
    callback && callback(items);

    return items;
  }

  Storage.prototype.save = function(newItem, callback) {
    let items = this.findAll();

    newItem.id = new Date().getTime();
    items.push(newItem);

    _store[_key] = JSON.stringify(items);

    callback && callback(newItem);
  }

  Storage.prototype.delete = function(id, callback) {
    let items = this.findAll();
    items = items.filter(function(item) {
      return item.id !== id;
    });
    _store[_key] = JSON.stringify(items);

    callback && callback(true);
  }

  Storage.prototype.reset = function(callback) {
    _store[_key] = JSON.stringify([]);
  }

  window.Storage = Storage;
})(window);