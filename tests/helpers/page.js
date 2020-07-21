const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');
const puppeteer = require('puppeteer');

/*
 * Adding extra functionality to puppeteer page
 */
class CustomPage {
  constructor(page) {
    this.page = page;
  }

  static async build() {
    const browser = await puppeteer.launch({
      // headless: false,
      args: ['--no-sandbox'], //decrease the testing time
    });

    const page = await browser.newPage();
    const customPage = new CustomPage(page);

    return new Proxy(customPage, {
      get: function (target, property) {
        return browser[property] || customPage[property] || page[property];
      },
    });
  }

  async login() {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);

    await this.page.setCookie({ name: 'session', value: session });
    await this.page.setCookie({ name: 'session.sig', value: sig });
    // refresh the page for cookie to take effect
    await this.page.goto('http://localhost:3000/blogs');
    /*
     * Without the waitFor function call the code executes too fast, even not waiting for the page to fully render
     * Hence waitFor will add in some delay for the program to wait
     */
    await this.page.waitFor('a[href="/auth/logout"]');
  }

  async getInnerHTML(selector) {
    return this.page.$eval(selector, (el) => el.innerHTML);
  }

  get(path) {
    return this.page.evaluate((_path) => {
      return fetch(_path, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json());
    }, path);
  }

  post(path, data) {
    return this.page.evaluate(
      (_path, _data) => {
        return fetch(_path, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(_data),
        }).then((res) => res.json());
      },
      path,
      data
    );
  }

  execRequests(actions) {
    return Promise.all(
      actions.map(({ method, path, data }) => {
        // invoking either get or post method
        return this[method](path, data);
      })
    );
  }
}

module.exports = CustomPage;
