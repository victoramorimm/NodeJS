/* eslint-disable @typescript-eslint/method-signature-style */
import { HttpRequest, HttpResponse } from './http'

export interface Controller {
  handle (httpRequest: HttpRequest): Promise<HttpResponse>
}
