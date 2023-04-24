/*
Created by: Henrique Emanoel Viana
Githu: https://github.com/hviana
Page: https://sites.google.com/view/henriqueviana
cel: +55 (41) 99999-4664
*/

export type GoogleAuthOptions = {
  email: string;
  scope: string[];
  key: string;
  expiration?: number;
  aud?: string;
};

import { importPKCS8, SignJWT } from "./deps.ts";

export class GoogleAuth {
  static DEFAULT_OAUTH2_URL = "https://accounts.google.com/o/oauth2/token";

  static DEFAULT_TOKEN_EXPIRATION: number = 60 * 60; //1 hour - limit

  static DEFAULT_TIMEOUT_RENEW: number = 5 * 60; //IF TOKEN HAS 5 MIN LEFT, RENEW

  #options: GoogleAuthOptions;
  #tokenTime: number = 0;
  #token: string = "";

  constructor(options: GoogleAuthOptions) {
    this.#options = options;
  }

  async getToken() {
    if (!this.#token || this.#tokenIsExpired()) {
      await this.#authenticate();
    }
    return this.#token;
  }

  async #getJWTToken() {
    var iat = Math.floor(Date.now() / 1000),
      exp = iat +
        Math.floor(
          this.#options.expiration || GoogleAuth.DEFAULT_TOKEN_EXPIRATION,
        ),
      claims: any = {
        iss: this.#options.email,
        sub: this.#options.email,
        scope: this.#options.scope.join(" "),
        aud: this.#options.aud || GoogleAuth.DEFAULT_OAUTH2_URL,
        exp: exp,
        iat: iat,
      };
    const jwt = await new SignJWT(claims).setProtectedHeader({ alg: "RS256" });
    return jwt.sign(await importPKCS8(this.#options.key, "RS256"));
  }

  async #authorizeJWTToken(
    jwt: string,
    authUrl: string = GoogleAuth.DEFAULT_OAUTH2_URL,
  ) {
    var res = await fetch(authUrl, {
      method: "POST",
      body:
        `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    var data = await res.json();
    if (!data.access_token) {
      throw new Error(`Error in get token, data: ${JSON.stringify(data)}`);
    }
    return data.access_token;
  }

  #tokenIsExpired() {
    var exp = this.#options.expiration ||
      GoogleAuth.DEFAULT_TOKEN_EXPIRATION;
    if (
      (Date.now() - this.#tokenTime) / 1000 >
        (exp - GoogleAuth.DEFAULT_TIMEOUT_RENEW)
    ) {
      return true;
    }
    return false;
  }

  async #authenticate() {
    this.#tokenTime = Date.now();
    this.#token = await this.#authorizeJWTToken(
      await this.#getJWTToken(),
      this.#options.aud,
    );
  }
}
