import { when } from "jest-when";
import psmf from "../api";
import { getFieldsList } from "../fields";
import {
  aritmaField,
  bechField,
  edenField,
  mainHeader,
  meteField,
  midHeader,
  mikuField,
  motoField,
} from "./fields.fixtures";
import type { AxiosResponse } from "axios";

jest.mock("../api", () => ({
  ...(jest.requireActual("../api") as any),
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

describe("Fields", () => {
  function createResponse(html: string) {
    return {
      data: `
        <html>
        <head></head>
        <body>
        <div class="main-content">
        <table class="standard" cellspacing="0" cellpadding="0" width="100%">
        ${html}
        </table>
        </div>
        </body>
        </html>
        `,
    } as AxiosResponse;
  }

  beforeEach(() => {
    (psmf.get as jest.Mock).mockReset();
  });

  it("should omit fields list headers", async () => {
    const html = `
        ${mainHeader}
        ${aritmaField}
        ${midHeader}
        ${bechField}
    `;

    when(psmf.get)
      .calledWith("vyveska/seznam-hrist/")
      .mockResolvedValue(createResponse(html));

    const fields = await getFieldsList();

    expect(fields).toHaveLength(2);
  });

  it("should parse simple single field abbr", async () => {
    const html = bechField;

    when(psmf.get)
      .calledWith("vyveska/seznam-hrist/")
      .mockResolvedValue(createResponse(html));

    const fields = await getFieldsList();

    expect(fields).toHaveLength(1);
    expect(fields[0]).toHaveProperty("abbr", "BECH");
  });

  it("should parse single field abbr with comment", async () => {
    const html = edenField;

    when(psmf.get)
      .calledWith("vyveska/seznam-hrist/")
      .mockResolvedValue(createResponse(html));

    const fields = await getFieldsList();

    expect(fields).toHaveLength(1);
    expect(fields[0]).toHaveProperty("abbr", "EDEN");
  });

  it("should parse simple multiple field abbr", async () => {
    const html = mikuField;

    when(psmf.get)
      .calledWith("vyveska/seznam-hrist/")
      .mockResolvedValue(createResponse(html));

    const fields = await getFieldsList();

    expect(fields).toHaveLength(4);
    expect(fields[0]).toHaveProperty("abbr", "MIKU1");
    expect(fields[1]).toHaveProperty("abbr", "MIKU2");
    expect(fields[2]).toHaveProperty("abbr", "MIKU3");
    expect(fields[3]).toHaveProperty("abbr", "MIKU4");
  });

  it("should parse multiple field abbr with comment", async () => {
    const html = meteField;

    when(psmf.get)
      .calledWith("vyveska/seznam-hrist/")
      .mockResolvedValue(createResponse(html));

    const fields = await getFieldsList();

    expect(fields).toHaveLength(2);
    expect(fields[0]).toHaveProperty("abbr", "METE1");
    expect(fields[1]).toHaveProperty("abbr", "METE2");
  });

  it("should parse and assign name to single field", async () => {
    const html = bechField;

    when(psmf.get)
      .calledWith("vyveska/seznam-hrist/")
      .mockResolvedValue(createResponse(html));

    const fields = await getFieldsList();

    expect(fields).toHaveLength(1);
    expect(fields[0]).toHaveProperty("name", "Běchovice 2");
  });

  it("should parse and assign name to multiple field", async () => {
    const html = mikuField;
    const name = "Mikulova";

    when(psmf.get)
      .calledWith("vyveska/seznam-hrist/")
      .mockResolvedValue(createResponse(html));

    const fields = await getFieldsList();

    expect(fields).toHaveLength(4);
    expect(fields[0]).toHaveProperty("name", name);
    expect(fields[1]).toHaveProperty("name", name);
    expect(fields[2]).toHaveProperty("name", name);
    expect(fields[3]).toHaveProperty("name", name);
  });

  it("should parse field descr", async () => {
    const html = bechField;

    when(psmf.get)
      .calledWith("vyveska/seznam-hrist/")
      .mockResolvedValue(createResponse(html));

    const fields = await getFieldsList();

    expect(fields).toHaveLength(1);
    expect(fields[0]).toHaveProperty(
      "info",
      `Na Korunce 580, Praha 9, pronajímatel T.J. Sokol Praha 9 – Běchovice II.\xa0
V areálu udržujte čistotu, používejte jen snadno dostupná WC! UMT 3.\xa0generace, osvětlení.\xa0Více na www.sokolbechovice.cz . Obuv: povoleny maximálně\xa0turfy, gumotextilní kopačky a sálová obuv.\xa0V "lisovkách" se hrát nesmí!`
    );
  });

  it("should parse field link for one field", async () => {
    const html = aritmaField;
    const link =
      "http://mapy.cz/zakladni?x=14.3407596&y=50.0985489&z=15&source=addr&id=8985624";

    when(psmf.get)
      .calledWith("vyveska/seznam-hrist/")
      .mockResolvedValue(createResponse(html));

    const fields = await getFieldsList();

    expect(fields).toHaveLength(1);
    expect(fields[0]).toHaveProperty("link", link);
  });

  it("should parse field link for multiple fields with one link", async () => {
    const html = meteField;
    const link =
      "http://mapy.cz/zakladni?x=14.4673609&y=50.1092719&z=15&source=addr&id=11165881&q=U%20Meteoru%2029%2F3%2C";

    when(psmf.get)
      .calledWith("vyveska/seznam-hrist/")
      .mockResolvedValue(createResponse(html));

    const fields = await getFieldsList();

    expect(fields).toHaveLength(2);
    expect(fields[0]).toHaveProperty("link", link);
    expect(fields[1]).toHaveProperty("link", link);
  });

  it("should parse field link for multiple fields with individual links", async () => {
    const html = motoField;
    const link1 =
      "https://mapy.cz/zakladni?x=14.3611348&y=50.0510808&z=18&base=ophoto&source=coor&id=14.36198204755783%2C50.05139082670212";
    const link2 =
      "https://mapy.cz/zakladni?x=14.3614781&y=50.0505917&z=18&base=ophoto&source=coor&id=14.360179603099823%2C50.050770565867424";
    const link3 =
      "https://mapy.cz/zakladni?x=14.3614781&y=50.0505917&z=18&base=ophoto&source=coor&id=14.360179603099823%2C50.050770565867424";
    const link4 =
      "https://mapy.cz/zakladni?x=14.3614781&y=50.0505917&z=18&base=ophoto&source=coor&id=14.360051164804077%2C50.05026791106221";

    when(psmf.get)
      .calledWith("vyveska/seznam-hrist/")
      .mockResolvedValue(createResponse(html));

    const fields = await getFieldsList();

    expect(fields).toHaveLength(4);
    expect(fields[0]).toHaveProperty("link", link1);
    expect(fields[1]).toHaveProperty("link", link2);
    expect(fields[2]).toHaveProperty("link", link3);
    expect(fields[3]).toHaveProperty("link", link4);
  });
});
