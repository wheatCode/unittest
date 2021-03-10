const puppeteer = require("puppeteer");
import basic from "../data/basic.json";

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
    await page.emulateMediaType("screen");
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
    getPDF: async (name, options = {}) => {
      if (headless) {
        await page.pdf({
          path: `./pdf/${name}.pdf`,
          printBackground: true,
          format: "A4",
          margin: {
            top: "10px",
            bottom: "10px",
            right: "10px",
            left: "10px",
          },
          ...options,
        });
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
  it("取得JSON網址", async () => {
    await utils.goto("https://monospace.kktix.cc/events.json");
    url = await page.evaluate(() => {
      let url, json;
      json = JSON.parse(document.querySelector("body").innerText);
      json["entry"].forEach((item) => {
        Object.keys(item).forEach((key) => {
          if (key === "title") {
            if (item[key].includes("0xFE")) {
              url = item["url"];
              return;
            }
          }
        });
      });
      return url;
    });
    await page.waitFor(waitForTimeOut);
    console.log(url);
    await utils.getScreenShot("第一步驟-取得JSON網址.png", { fullPage: true });
    await page.evaluate(() => {
      const title = document.createElement("h1");
      const body = document.querySelector("body");
      title.textContent = "第一步驟";
      title.style.textAlign = "center";
      title.style.color = "red";
      title.style.zIndex = "99999";
      body.insertBefore(title, body.childNodes[0]);
    });
    await utils.getPDF("第一步驟-取得JSON網址");
  });
  it("登入活動頁面", async () => {
    await utils.goto(url);
    spanElement = await utils.$eval(
      "body > div.outer-wrapper > div.content-wrapper > div > div.og-banner > img",
      "src"
    );
    console.log(spanElement);
    code = await page.evaluate(() => {
      let code = document.querySelector(
        "body > div.outer-wrapper > div.content-wrapper > div > div.main.clearfix > div > pre"
      ).innerText;
      code = code.slice(14, 30);
      return code;
    });
    await page.waitFor(waitForTimeOut);
    console.log(code);
    title = await page.evaluate(() => {
      let title = document.querySelector(
        "body > div.outer-wrapper > div.content-wrapper > div > div.header > div > h1"
      ).innerText;
      return title;
    });
    await page.waitFor(waitForTimeOut);
    console.log(title);
    content = await page.evaluate(() => {
      let content = document.querySelector(
        "body > div.outer-wrapper > div.content-wrapper > div > div.main.clearfix > div > h2"
      ).innerText;
      content +=
        " " +
        document.querySelector(
          "body > div.outer-wrapper > div.content-wrapper > div > div.main.clearfix > div > p:nth-child(2)"
        ).innerText;
      content +=
        " " +
        document.querySelector(
          "body > div.outer-wrapper > div.content-wrapper > div > div.main.clearfix > div > p:nth-child(4)"
        ).innerText;
      content +=
        " " +
        document.querySelector(
          "body > div.outer-wrapper > div.content-wrapper > div > div.main.clearfix > div > pre"
        ).innerText;
      return content;
    });
    await page.waitFor(waitForTimeOut);
    console.log(content);
    await utils.getScreenShot("第二步驟-登入活動頁面.png", { fullPage: true });
    await page.evaluate(() => {
      const title = document.createElement("h1");
      const body = document.querySelector("body");
      title.textContent = "第二步驟";
      title.style.textAlign = "center";
      title.style.color = "red";
      title.style.zIndex = "99999";
      body.insertBefore(title, body.childNodes[0]);
    });
    await utils.getPDF("第二步驟-登入活動頁面");
  });
  it("data-code解碼", async () => {
    await utils.goto(
      "https://www.convertstring.com/zh_TW/EncodeDecode/Base64Decode"
    );
    await utils.type("#input", code);
    await utils.click("#submit");
    await page.waitFor(waitForTimeOut);
    code = await page.evaluate(() => {
      let code;
      code = document.querySelector("#output").value;
      return code;
    });
    await page.waitFor(waitForTimeOut);
    console.log(code);
    await utils.getScreenShot("第三步驟-data-code解碼.png", { fullPage: true });
    await page.evaluate(() => {
      const title = document.createElement("h1");
      const body = document.querySelector("body");
      title.textContent = "第三步驟";
      title.style.textAlign = "center";
      title.style.color = "red";
      title.style.zIndex = "99999";
      body.insertBefore(title, body.childNodes[0]);
    });
    await utils.getPDF("第三步驟-data-code解碼");
  });
  it("填寫票數", async () => {
    await utils.goto(url);
    await utils.click(
      "body > div.outer-wrapper > div.content-wrapper > div > div.tickets > a"
    );
    await utils.click(
      "#guestModal > div.modal-dialog > div > div.modal-footer > button"
    );
    await utils.click(
      "#ticket_344407 > div > span.ticket-quantity.ng-scope > input"
    );
    await utils.click(
      "#ticket_344407 > div > span.ticket-quantity.ng-scope > button.btn-default.plus"
    );
    await utils.click("#person_agree_terms");
    await utils.getScreenShot("第四步驟-填寫票數.png", { fullPage: true });
    await page.evaluate(() => {
      const title = document.createElement("h1");
      const body = document.querySelector("body");
      title.textContent = "第四步驟";
      title.style.textAlign = "center";
      title.style.color = "red";
      title.style.zIndex = "99999";
      body.insertBefore(title, body.childNodes[0]);
    });
    await utils.getPDF("第四步驟-填寫票數");

    await utils.click(
      "#registrationsNewApp > div > div:nth-child(5) > div.form-actions.plain.align-center.register-new-next-button-area"
    );
  });
  it("填寫表單", async () => {
    await utils.click(
      "#guestModal > div.modal-dialog > div > div.modal-footer > button"
    );
    await utils.type(
      "#field_text_701843 > div > div > input",
      basic.basic[0].name
    );
    await utils.type(
      "#field_email_701844 > div > div > input",
      basic.basic[0].eMail
    );
    await utils.type(
      "#field_text_701845 > div > div > input",
      basic.basic[0].cellphone
    );
    await utils.type("#field_text_701846 > div > div > input", code);
    await utils.click("#person_agree_terms");
    await utils.getScreenShot("第五步驟-填寫表單.png", { fullPage: true });
    await page.evaluate(() => {
      const title = document.createElement("h1");
      const body = document.querySelector("body");
      title.textContent = "第五步驟";
      title.id = "five";
      title.style.textAlign = "center";
      title.style.color = "red";
      title.style.zIndex = "99999";
      body.insertBefore(title, body.childNodes[0]);
    });
    await utils.getPDF("第五步驟-填寫表單");
    await utils.click(
      "#registrations_controller > div:nth-child(4) > div:nth-child(2) > div > div.form-actions.plain.align-center.ng-scope > a"
    );
    await utils.getScreenShot("第六步驟-完成訂單.png", { fullPage: true });
    await page.waitForSelector(
      "#registrations_controller > div.ng-scope > div.narrow-wrapper.ng-scope > div > div.order-wrapper.ng-scope > div:nth-child(5) > div:nth-child(2) > div > ul > li > div > div > div.sub-block.ng-scope > div.qr-code.ng-scope > img",
      {
        visible: true,
      }
    );
    await page.evaluate(() => {
      const title = document.createElement("h1");
      const body = document.querySelector("body");
      title.textContent = "第六步驟";
      title.style.textAlign = "center";
      title.style.color = "red";
      title.style.zIndex = "99999";
      document.getElementById("five").remove();
      body.insertBefore(title, body.childNodes[0]);
    });
    await utils.getPDF("第六步驟-完成訂單");
  });
  // it("填寫票數", async () => {
  // await page.addScriptTag({
  //   path: `./node_modules/easy-pdf-merge`,
  // });
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
  // console.log(`${process.cwd()}`);
  // });
});
