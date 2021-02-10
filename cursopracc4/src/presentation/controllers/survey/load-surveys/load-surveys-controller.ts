import { LoadSurveys } from '../../../../domain/usecases/load-surveys'
import { ok } from '../../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../../protocols'

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const surveys = await this.loadSurveys.load()

    if (surveys) {
      return ok(surveys)
    }
  }
}
