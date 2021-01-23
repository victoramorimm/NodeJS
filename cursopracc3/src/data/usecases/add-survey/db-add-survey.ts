import {
  AddSurveyRepository,
  AddSurvey,
  AddSurveyModel,
} from './db-add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor(private readonly addSurveyRepositoryStub: AddSurveyRepository) {}

  async add(data: AddSurveyModel): Promise<void> {
    await this.addSurveyRepositoryStub.add(data)
  }
}
