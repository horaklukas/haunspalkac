// @ts-ignore
const axios = require("axios");
// @ts-ignore
const psmf = axios.create({
  baseURL: "http://www.psmf.cz",
});

exports.psmf = psmf;

// @ts-ignore
const getText = (element: HTMLElement, $: any) => $(element).text().trim();

exports.getText = getText;
