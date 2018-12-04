import el from '/diesel/src/el.js';
import router from '/diesel/src/router.js';

function setContent(e) {
  let main = document.getElementsByTagName('main')[0];
  main.innerHTML = ''
  main.appendChild(e);
}

function setContentCard(title, content) {
  setContent(
    el('div', { class: 'card' }, [
      el('header', { class: 'card-header' }, [
        el('h1', { class: 'card-header-title' }, title)
      ]),
      el('div', { class: 'card-content content' }, content)
    ])
  );
}

router({
  '/': function() {
    router.go('/intro/philosophy', { replace: true })
  },
  '/intro/philosophy': function() {
    setContentCard('Philosophy', [
      el('h3', 'Complexity'),
      el('p', [
        String.raw`
          Web interface development has grow in complexity with the advent of heavy client-side, single-page application frameworks such as Angular or React.
          Those frameworks certainly have their place, but there is a set of applications whose low complexity, relative to others, may not warrant such a tool.
          The Diesel library is something you could write yourself with knowledge of the built-in 
        `,
        el('a', { href: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model' }, 'browser APIs'),
        String.raw`
          .  In fact, if you have never worked directly with them before, you may be surprised at what they can do!
          If you don't believe that learning a framework is `, el('em', 'always'), String.raw` better than just understanding standard library, then keep reading.
        `
      ]),
      el('h3', 'Dependencies'),
      el('p', [
        String.raw`
          Simply starting a project with a frontend framework and/or build tool can easily baloon your `, el('code', 'node_modules'), String.raw` folder into hundreds or maybe a thousand dependencies.
          There is a cost to relying on third party code.  Perhaps it inflates your application's install time, build time, or runtime performance.  Perhaps you find yourself troubleshooting a bug
          in a dependency.  This is not a defense of the "not invented here" stance, more a believe that the value of a dependency should be weighed against it's cost.
          You may always want a library for a database client, but should think twice about a wrapper for `, el('code', 'document.querySelector()'), String.raw`.
        `
      ]),
      el('h3', 'Understanding'),
      el('p', [
        String.raw`
        `
      ])
    ])
  },
  '/intro/quickstart': function() {
    setContentCard('Quickstart', [
      el('p', 'Starting a new project with Diesel is pretty easy.  The source is ES6 modules hosted via this website, so all you have to do is import them.'),
      el('p', [
        el('pre', [
          el('code', String.raw`
            import el from 'https://megalord.github.io/diesel/src/el.js';
            import router from 'https://megalord.github.io/diesel/src/router.js';

            router({
              '/': function() {
                let body = document.getElementsByTagName('body')[0];
                body.innerHTML = '';
                body.appendChild(el('h1', 'Hello'));
              }
            });
          `)
        ])
      ]),
      el('p', [
        'This is not a recommended approach for using this library, it is merely the quickest way to get it running.  For other options, see ',
        el('a', { href: 'intro/installation' }, 'Installation'),
        '.'
      ])
    ]);
  },
  '/intro/installation': function() {
    setContentCard('Installation', [
      el('p', [
        String.raw`
          This might sound crazy for folks used to running `, el('code', 'npm install'), String.raw` as a solution to every problem, but `, el('em', 'just clone the source'), String.raw`.
          Why?  Because you implicitly take some ownership for any code you leverage and do not pay for support for.  Downloading the source merely makes that more explicit.
          Also, a library that ships source code instead of package has less constraints on a build system, and if you agree with other parts of this documentation, then it is not a stretch to say build systems may not be worthwhile either.
          You don't need hundreds of lines of javascript to create a bundle when
        `
      ]),
      el('p', [
        el('pre', [
          el('code', String.raw`
            cat src/**/*.js > bundle.js
          `)
        ])
      ]),
      el('p', 'will do for a smaller application.')
    ]);
  },
  '/router/base': function() {
    setContentCard('Router', [
      el('p', [
        String.raw`
          What is a router?  At the most basic level, a router directs a request to a procedure that cares about the request based of some attribute.
          For single-page applications, that attribute is the path, i.e. `, el('code', 'window.location'), String.raw` in a browser.
          The simplest router then is a mapping between paths and functions, and that is precisely the (base) router that Diesel provides.
        `
      ]),
      el('p', [
        el('pre', [
          el('code', String.raw`
            router({
              '/': () => {
                setTimeout(() => router.go('/0'));
              },
              '/:num': ({ num }) => {
                setTimeout(() => router.go('/' + num));
              }
            });
          `)
        ])
      ]),
    ])
  }
})
