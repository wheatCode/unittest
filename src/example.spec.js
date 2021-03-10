// import { shallowMount } from "@vue/test-utils";
// import HelloWorld from "@/components/HelloWorld.vue";

// describe("HelloWorld.vue", () => {
//   it("renders props.msg when passed", () => {
//     const msg = "new message";
//     const wrapper = shallowMount(HelloWorld, {
//       propsData: { msg }
//     });
//     expect(wrapper.text()).toMatch(msg);
//   });
// });
// const puppeteer = require('puppeteer');

// describe('打開 線上讀書會網站', () => {
//   var browser, page;
//   var url = 'https://ithelp.ithome.com.tw/articles/10193230';
//   beforeEach(async () => {
//     browser = await puppeteer.launch({ headless: false });
//     page = await browser.newPage();
//   })
//   afterEach(() => {
//     browser.close()
//   })

//   it('Title == 線上讀書會', async () => {
//     await page.goto(url);
//     const title = await page.title();
//     expect(title).toBe("線上讀書會");
//   });

// })
