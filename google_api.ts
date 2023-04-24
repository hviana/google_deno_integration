/*
Created by: Henrique Emanoel Viana
Githu: https://github.com/hviana
Page: https://sites.google.com/view/henriqueviana
cel: +55 (41) 99999-4664
*/

import { GoogleAuth, GoogleAuthOptions } from "./google_auth.ts";

export class GoogleAPI {
  static SUBSCRIPTION_RECOVERED = 1;
  static SUBSCRIPTION_RENEWED = 2;
  static SUBSCRIPTION_CANCELED = 3;
  static SUBSCRIPTION_PURCHASED = 4;
  static SUBSCRIPTION_ON_HOLD = 5;
  static SUBSCRIPTION_IN_GRACE_PERIOD = 6;
  static SUBSCRIPTION_RESTARTED = 7;
  static SUBSCRIPTION_PRICE_CHANGE_CONFIRMED = 8;
  static SUBSCRIPTION_DEFERRED = 9;
  static SUBSCRIPTION_PAUSED = 10;
  static SUBSCRIPTION_PAUSE_SCHEDULE_CHANGED = 11;
  static SUBSCRIPTION_REVOKED = 12;
  static SUBSCRIPTION_EXPIRED = 13;

  static SUBSCRIPTION_IGNORE_STATUS = [
    GoogleAPI.SUBSCRIPTION_PRICE_CHANGE_CONFIRMED,
    GoogleAPI.SUBSCRIPTION_DEFERRED,
    GoogleAPI.SUBSCRIPTION_PAUSE_SCHEDULE_CHANGED,
  ];

  static SUBSCRIPTION_OK_STATUS = [
    GoogleAPI.SUBSCRIPTION_RECOVERED,
    GoogleAPI.SUBSCRIPTION_RENEWED,
    GoogleAPI.SUBSCRIPTION_PURCHASED,
    GoogleAPI.SUBSCRIPTION_RESTARTED,
  ];

  static SUBSCRIPTION_CANCELED_STATUS = [
    GoogleAPI.SUBSCRIPTION_CANCELED,
  ];

  #googleAuth: GoogleAuth;

  async get(endpoint: string) {
    return await this.request(endpoint, "GET", null);
  }
  async put(endpoint: string, data: any = {}) {
    return await this.request(endpoint, "PUT", data);
  }
  async post(endpoint: string, data: any = {}) {
    return await this.request(endpoint, "POST", data);
  }
  async delete(endpoint: string, data: any = {}) {
    return await this.request(endpoint, "DELETE", data);
  }
  constructor(options: GoogleAuthOptions) {
    this.#googleAuth = new GoogleAuth(options);
  }
  async request(
    endpoint: string,
    method: string = "GET",
    data: any = {},
  ): Promise<any> {
    const headers = new Headers({
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${await this.#googleAuth.getToken()}`,
    });
    const reqData = JSON.stringify(data);
    var params: any = {
      method: method,
      headers: headers,
    };
    if (method !== "GET" && method !== "HEAD") {
      params.body = reqData;
    }
    var request = await fetch(
      endpoint,
      params,
    );
    var res: any = {};
    try {
      res = await request.json();
    } catch (e) {}
    return res;
  }

  async getSubscriptionPurchase(
    planId: string,
    purchaseToken: string,
    packageName: string,
  ) {
    return await this.get(
      `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/subscriptions/${planId}/tokens/${purchaseToken}`,
    );
  }
}
