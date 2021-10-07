import { when } from "jest-when";
import { psmf } from "../utils";
import { getFieldsList } from "../fields";
import {
  aritmaField,
  bechField,
  edenField,
  mainHeader,
  meteField,
  midHeader,
  mikuField,
} from "./fields.fixtures";

jest.mock("../utils", () => ({
  ...(jest.requireActual("../utils") as any),
  psmf: {
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
    };
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
});
