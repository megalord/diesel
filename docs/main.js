import el from '/diesel/src/el.js';
import groupedRoutes from '/diesel/src/groupedRoutes.js';
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

router(groupedRoutes({
  '/': () => {
    setContentCard('Diesel', [
        el('p', [
          String.raw`
            This JavaScript code is just a set of common patterns I have arrived at from work on personal projects, which I tend to build from scratch for sake of my own learning.
            It turns out that writing plain ol' JavaScript code can get you pretty far and teaches you a lot about why big frameworks make certain decisions.
          `
        ])
    ])
  },
  '': {
    pre: () => {
      [...document.querySelectorAll('.menu a')].forEach((link) => link.classList.remove('is-active'));
      document.querySelector(`.menu a[href="${location.hash}"]`).classList.add('is-active');
    },
    '/intro/philosophy': () => {
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
            If you don't believe that learning a framework is `, el('em', 'always'), String.raw` better than just understanding the standard library, then keep reading.
          `
        ]),
        el('h3', 'Dependencies'),
        el('p', [
          String.raw`
            Simply starting a project with a frontend framework and/or build tool can easily baloon your `, el('code', 'node_modules'), String.raw` folder into hundreds or maybe a thousand dependencies.
            There is a cost to relying on third party code.  Perhaps it inflates your application's install time, build time, or runtime performance.  Perhaps you find yourself troubleshooting a bug
            in a dependency.  This is not a defense of the "not invented here" stance, more a belief that the value of a dependency should be weighed against it's cost.
            You may always want a library for a database client, but should think twice about a wrapper for `, el('code', 'document.querySelector()'), String.raw`.
          `
        ]),
        el('h3', 'Understanding'),
        el('p', [
          String.raw`
            Knowing how a library works isn't an absolute ideal.  You may be perfectly content using a library that implements the Raft algorithm without ever reading it's source code or peeking under
            the covers to see how it is built.  But perhaps the complexity of your web interface isn't on the same level of complexity as a fault-tolerant distributed system, and it's not terribly
            difficult to understand much or all of the JavaScript code in your application.  Lastly, a conceptual understanding of fundamental concepts ages much better than knowledge of a library.
            You may even gain an intuition of how frameworks are built, because ultimately they are all using the same raw material.
          `
        ])
      ])
    },
    '/intro/quickstart': () => {
      setContentCard('Quickstart', [
        el('p', 'Starting a new project with Diesel is pretty easy.  The source is ES6 modules hosted via this website, so all you have to do is import them.'),
        el('p', [
          el('pre', [
            el('code', String.raw`
              import el from 'https://megalord.github.io/diesel/src/el.js';
              import router from 'https://megalord.github.io/diesel/src/router.js';

              router({
                '/': () => {
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
    '/intro/installation': () => {
      setContentCard('Installation', [
        el('p', [
          String.raw`
            This might sound crazy for folks used to running `, el('code', 'npm install'), String.raw` as a solution to every problem, but `, el('em', 'just clone the source'), String.raw`.
            Why?  Because you implicitly take some ownership for any code you leverage (and do not pay for support for).  Downloading the source merely makes that more explicit.
            Also, a library that ships source code instead of package has less constraints on a build system, and if you agree with other parts of this documentation,
            then it is not a stretch to say build systems may not be worthwhile either.  You don't need thousands of lines of javascript to create a bundle when
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
    '/router/base': () => {
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
        el('p', [
          String.raw`
            The route handler function is called with an object whose defined properties correspond to route variables.  In the example above, `, el('code', ':num'), String.raw` is a route variable.
            If the current route is `, el('code', '/0'), ', the function argument will be an object with a ', el('code', 'num'), ' key whose value is ', el('code', "'0'"), String.raw`.
            Note that values will always be strings, so you will have to parse them on your own as needed.
          `
        ]),
        el('p', [
          String.raw`
            There is a special `, el('code', 'else'), String.raw` key in the routes object that, if provided, will be called whenever
            the path does not match any registered route.  If not provided, an error will be thrown and appear in the browser console.
          `
        ]),
        el('p', [
          'This router has nearly no features, but its simplicity makes it a solid foundation to build higher routing features on top of.  As an example of such an extension, continue to the ',
          el('a', { href: '#/router/grouped' }, 'Grouped Routes'), ' concept.'
        ])
      ])
    },
    '/router/grouped': () => {
      setContentCard('Grouped Routes', [
        el('p', [
          String.raw`
            One basic need of many applications is to define common behavior for several routes.  As an example, sites with authentication will have a group of unauthenticated routes, perhaps just the login page,
            and a group of authenticated routes that should only be accessed after a successful login.  You could achieve this via
          `
        ]),
        el('p', [
          el('pre', [
            el('code', String.raw`
              let checkAuth = () => {
                if (!localStorage.getItem('session')) {
                  throw new Error('You are not authenticated.');
                }
              }
              router({
                '/login': () => {
                  // render login form
                },
                '/posts': () => {
                  checkAuth();
                  // render posts page
                }
                '/profile': () => {
                  checkAuth();
                  // render profile page
                }
              });
            `)
          ])
        ]),
        el('p', [
          String.raw`
            Throwing an error is just a silly way of preventing the rest of the route handler for running (i.e. preventing the page from loading), but you can see how that check might get tedious to enforce,
            especially if you need to perform more checks for nested groups.  The `, el('code', 'groupedRoutes()'), ' method helps construct a routes object with less repetition.'
        ]),
        el('p', [
          el('pre', [
            el('code', String.raw`
              router(groupedRoutes({
                '/login': () => {
                  // render login form
                },
                '': {
                  pre: checkAuth,
                  '/posts': () => {
                    // render posts page
                  }
                  '/profile': () => {
                    // render profile page
                  }
                }
              }));
            `)
          ])
        ]),
        el('p', [
          String.raw`
            A group of routes is specified with an object instead of a function, and groups can be nested as deep as the browser's stack size (because it is built using recursion).
            The special `, el('code', 'pre'), String.raw` key is the function that will be composed with the route function.
          `
        ]),
        el('p', [
          'As another example, the source code for this docs site uses the grouped router to highlight the active nav item based on the current route.'
        ])
      ]);
    }
  }
}), {
  history: false
})
