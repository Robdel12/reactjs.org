const puppeteer = require('puppeteer');
const { percySnapshot } = require('@percy/puppeteer');

const ROOT_URL = `http://0.0.0.0:8001`;
const pages = [
  {
    title: 'Home',
    path: '',
  },
  {
    title: 'Docs - Getting started',
    path: 'docs/getting-started.html',
  },
  {
    title: 'Docs - Add React to a Website',
    path: 'docs/add-react-to-a-website.html',
  },
  {
    title: 'Docs - Create a New React App',
    path: 'docs/create-a-new-react-app.html',
  },
  {
    title: 'Docs - Hello World',
    path: 'docs/hello-world.html',
  },
  {
    title: 'Docs - Introducing JSX',
    path: 'docs/introducing-jsx.html',
  },
  {
    title: 'Tutorial - Intro to React',
    path: 'tutorial/tutorial.html',
  },
];

(async () => {
  let browser = await puppeteer.launch({
    headless: true,
    args: ['–no-sandbox', '–disable-setuid-sandbox', '--single-process'],
  });

  let page = await browser.newPage();

  let snapshots = pages.map(route => {
    return async () => {
      let url = `${ROOT_URL}/${route.path}`;
      console.log(`Taking snapshot of ${url} ...`);

      await page.goto(url);

      await percySnapshot(page, route.title);
      console.log('Snapshot complete.');
    };
  });

  // Snapshot these pages sequentially
  await snapshots.reduce((p, fn) => p.then(fn), Promise.resolve());
  await browser.close();
})();
