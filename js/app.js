(function(window, $) {
  'use strict';

  function App() {
    console.log('App.init');
  }

  $(function() {
    window.NoteTaker = new App();
  });

})(window, jQuery)