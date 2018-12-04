import el from '/diesel/src/el.js';
import router from '/diesel/src/router.js';

function setContent(e) {
  let main = document.getElementsByTagName('main')[0];
  main.innerHTML = ''
  main.appendChild(e);
}

router({
  '/': function() {
    setContent(el('h1', 'Hello'));
  }
})
