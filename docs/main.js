import router from '/diesel/src/router.js';

router({
  '/': function() {
    document.getElementsByTagName('main')[0].innerHTML = '<h1>Hello</h1>';
  }
})
