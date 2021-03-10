const puppeteer = require("puppeteer");

let serverOptions = {
  headless: false,
  waitForTimeOut: 1000,
};

let { headless, waitForTimeOut } = serverOptions;

describe("labeling-tool", () => {
  jest.setTimeout(500000);
  let spanElement, url, code, title, content, browser, page;
  beforeAll(async () => {
    browser = await puppeteer.launch({ headless, args: ["--start-maximized"] });
    page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.setViewport({
      width: 1200,
      height: 800,
    });
    page.on("console", (msg) => {
      for (let i = 0; i < msg.args().length; ++i) {
        let text = msg.args()[i];
        console.log(`${i}: ${text}`);
      }
    });
  });
  afterAll(() => {
    browser.close();
  });
  const utils = {
    goto: async (where) => {
      await page.goto(where, { waitUntil: "load" });
      await page.waitFor(waitForTimeOut);
    },
    $$: async (element) => {
      await page.waitForSelector(element);
      return await page.$$(element);
    },
    $eval: async (element, event) => {
      await page.waitForSelector(element, {
        visible: true,
      });
      return await page.$eval(
        element,
        (el, event) => {
          switch (event) {
            case "innerText":
              return el.innerText;
            case "src":
              return el.getAttribute("src");
          }
        },
        event
      );
    },
    $$eval: async (element, num, event) => {
      await page.waitForSelector(element, {
        visible: true,
      });
      return await page.$$eval(
        element,
        (els, num, event) => {
          switch (event) {
            case "top":
              return els[num].style.top;
            case "left":
              return els[num].style.left;
          }
        },
        num,
        event
      );
    },
    type: async (element, data) => {
      await page.waitForSelector(element, {
        visible: true,
      });
      await page.type(element, data);
      await page.waitFor(waitForTimeOut);
    },
    click: async (element, options) => {
      await page.waitForSelector(element, {
        visible: true,
      });
      await page.click(element, options);
      await page.waitFor(waitForTimeOut);
    },
    press: async (keyCode) => {
      await page.keyboard.press(keyCode);
      await page.waitFor(waitForTimeOut);
    },
    waitForLoading: async (element) => {
      await page.waitForFunction(
        (element) => !document.querySelector(element),
        {
          timeout: 50000,
        },
        element
      );
      await page.waitFor(waitForTimeOut);
    },
    getPDF: async (name) => {
      if (headless) {
        await page.pdf({ path: `./pdf/${name}.pdf` });
        await page.waitFor(waitForTimeOut);
      }
    },
    getScreenShot: async (name, options = {}) => {
      await page.screenshot({
        path: `./img/${name}`,
        ...options,
      });
    },
  };
  // it("取得JSON網址", async () => {
  //   await utils.goto("https://monospace.kktix.cc/events.json");
  //   await page.evaluate;
  //   url = await page.evaluate(() => {
  //     let url, json;
  //     json = JSON.parse(document.querySelector("body").innerText);
  //     json["entry"].forEach((item) => {
  //       Object.keys(item).forEach((key) => {
  //         if (key === "title") {
  //           if (item[key].includes("0xFE")) {
  //             url = item["url"];
  //             return;
  //           }
  //         }
  //       });
  //     });
  //     return url;
  //   });
  //   await page.waitFor(1000);
  //   console.log(url);
  //   await utils.getScreenShot("取得JSON網址.png", { fullPage: true });
  //   await utils.getPDF("取得JSON網址");
  // });
  // it("登入活動頁面", async () => {
  //   await utils.goto(url);
  //   spanElement = await utils.$eval(
  //     "body > div.outer-wrapper > div.content-wrapper > div > div.og-banner > img",
  //     "src"
  //   );
  //   console.log(spanElement);
  //   code = await page.evaluate(() => {
  //     let code = document.querySelector(
  //       "body > div.outer-wrapper > div.content-wrapper > div > div.main.clearfix > div > pre"
  //     ).innerText;
  //     code = code.slice(14, 30);
  //     return code;
  //   });
  //   console.log(code);
  //   title = await page.evaluate(() => {
  //     let title = document.querySelector(
  //       "body > div.outer-wrapper > div.content-wrapper > div > div.header > div > h1"
  //     ).innerText;
  //     return title;
  //   });
  //   console.log(title);
  //   content = await page.evaluate(() => {
  //     let content = document.querySelector(
  //       "body > div.outer-wrapper > div.content-wrapper > div > div.main.clearfix > div > h2"
  //     ).innerText;
  //     content +=
  //       " " +
  //       document.querySelector(
  //         "body > div.outer-wrapper > div.content-wrapper > div > div.main.clearfix > div > p:nth-child(2)"
  //       ).innerText;
  //     content +=
  //       " " +
  //       document.querySelector(
  //         "body > div.outer-wrapper > div.content-wrapper > div > div.main.clearfix > div > p:nth-child(4)"
  //       ).innerText;
  //     content +=
  //       " " +
  //       document.querySelector(
  //         "body > div.outer-wrapper > div.content-wrapper > div > div.main.clearfix > div > pre"
  //       ).innerText;
  //     return content;
  //   });
  //   console.log(content);
  //   await utils.getScreenShot("登入活動頁面.png", { fullPage: true });
  //   await utils.getPDF("登入活動頁面");
  // });
  // it("data-code解碼", async () => {
  //   await utils.goto(
  //     "https://www.convertstring.com/zh_TW/EncodeDecode/Base64Decode"
  //   );
  //   await utils.type("#input", code);
  //   await utils.click("#submit");
  //   await page.waitFor(5000);
  //   code = await page.evaluate(() => {
  //     let code;
  //     code = document.querySelector("#output").value;
  //     return code;
  //   });
  //   console.log(code);
  //   await utils.getScreenShot("ata-code解碼.png", { fullPage: true });
  //   await utils.getPDF("ata-code解碼");
  // });
  // it("填寫票數", async () => {
  //   await utils.goto(url);
  //   await utils.click(
  //     "body > div.outer-wrapper > div.content-wrapper > div > div.tickets > a"
  //   );
  //   await utils.click(
  //     "#guestModal > div.modal-dialog > div > div.modal-footer > button"
  //   );
  //   await utils.click(
  //     "#ticket_344407 > div > span.ticket-quantity.ng-scope > input"
  //   );
  //   await utils.click(
  //     "#ticket_344407 > div > span.ticket-quantity.ng-scope > button.btn-default.plus"
  //   );
  //   await utils.click("#person_agree_terms");
  //   await utils.getScreenShot("填寫票數.png", { fullPage: true });
  //   await utils.getPDF("填寫票數");

  //   await utils.click(
  //     "#registrationsNewApp > div > div:nth-child(5) > div.form-actions.plain.align-center.register-new-next-button-area"
  //   );
  // });
  // it("填寫表單", async () => {
  //   await utils.click(
  //     "#guestModal > div.modal-dialog > div > div.modal-footer > button"
  //   );
  //   await utils.type("#field_text_701843 > div > div > input", "蔡名彥");
  //   await utils.type(
  //     "#field_email_701844 > div > div > input",
  //     "b976543257@gmail.com"
  //   );
  //   await utils.type("#field_text_701845 > div > div > input", "0912345678");
  //   await utils.type("#field_text_701846 > div > div > input", code);
  //   await utils.click("#person_agree_terms");
  //   await utils.getScreenShot("填寫表單.png", { fullPage: true });
  //   await utils.getPDF("填寫表單");
  //   await utils.click(
  //     "#registrations_controller > div:nth-child(4) > div:nth-child(2) > div > div.form-actions.plain.align-center.ng-scope > a"
  //   );
  //   await page.waitFor(5000);
  //   await utils.getScreenShot("完成訂單.png", { fullPage: true });
  //   await utils.getPDF("完成訂單");
  // });
  it("填寫票數", async () => {
    await page.addScriptTag({
      path: `./node_modules/easy-pdf-merge`,
    });
    // await page.evaluate(() => {
    //   window.merge(
    //     ["../../../pdf/完成訂單.pdf", "../../../pdf/取得JSON網址.pdf"],
    //     "a.pdf",
    //     function(err) {
    //       if (err) return console.log(err);
    //       console.log("Successfully merged!");
    //     }
    //   );
    // });
    console.log(`${process.cwd()}`);
  });
});
