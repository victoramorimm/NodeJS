import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
  AddSurvey
} from './add-survey-protocols'
import {
  badRequest,
  noContent,
  serverError
} from '@/presentation/helpers/http/http-helper'

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      const { question, answers } = httpRequest.body

      await this.addSurvey.add({
        question,
        answers,
        date: new Date()
      })

      if (error) {
        return badRequest(error)
      }

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
