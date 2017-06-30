(function(window) {
  'use strict';

  let _store = window.localStorage;
  let _key = 'app';

  let Storage = function(key) {
    _key = key;

    if(!_store[_key]) {
      this.loadDummyData();
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

    if(newItem.id) {
      items = items.map(function(item) {
        if(item.id === newItem.id) {
          for(let prop in newItem) {
            item[prop] = newItem[prop];
          }
        }
        return item;
      });
    } else {
      newItem.id = new Date().getTime();
      items.push(newItem);
    }

    setStorage(items);

    callback && callback(newItem);
  }

  function setStorage(object) {
    _store[_key] = JSON.stringify(object);
  }

  Storage.prototype.delete = function(id, callback) {
    let oldItems = this.findAll();
    let items = oldItems.filter((item) => item.id !== id);
    setStorage(items);

    callback && callback(items.length !== oldItems.length);
  }

  Storage.prototype.getColor = function(callback) {
    callback && callback(_store[`${_key}-color`]);
  }

  Storage.prototype.setColor = function(color, callback) {
    _store[`${_key}-color`] = color;
  }

  Storage.prototype.loadDummyData = function(color, callback) {
      setStorage([{
        id: +new Date(),
        color: 'red',
        text: 'Hello\nWorld'
      }, {
        id: +new Date() + 1,
        color: 'yellow',
        text: 'THIS\nIS\nAWESOME!'
      }, {
        id: +new Date() + 2,
        color: 'blue',
        text: 'Try this out\nAnd type something'
      }]);
  }

  window.Storage = Storage;
})(window);