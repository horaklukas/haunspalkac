import type { AxiosResponse } from "axios";
import { delay as lodashDelay } from "lodash";

export function createFakeResponse(data: string, path?: string) {
  return {
    data,
    request: {
      path,
    },
  } as AxiosResponse;
}

export function createFakeHTMLResponse(html: string, path?: string) {
  return createFakeResponse(
    `
          <html>
          <head></head>
          <body>
          <div class="main-content">
          ${html}
          </div>
          </body>
          </html>
          `,

    path
  );
}

export function createFakeJsonScriptDataResponse(
  teams: { id: string; label: string }[]
) {
  return createFakeResponse(
    `
        var searchJsonData = ${JSON.stringify(teams.map(({ label }) => label))};
        var formJsonData = ${JSON.stringify(teams)}
      `
  );
}

export function delay(timeout: number) {
  return new Promise((resolve) => lodashDelay(resolve, timeout));
}
