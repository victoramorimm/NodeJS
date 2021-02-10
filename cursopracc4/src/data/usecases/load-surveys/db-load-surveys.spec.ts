import { DbLoadSurveys } from './db-load-surveys'
import { LoadSurveysRepository } from '../../protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '../../../domain/models/survey'

export const makeFakeSurveys = (): SurveyModel[] => {
  return [
    {
      id: 'any_id',
      question: 'any_question',
      answers: [
        {
          answer: 'any_answer',
          image: 'any_image'
        }
      ],
      date: new Date()
    },
    {
      id: 'other_id',
      question: 'other_question',
      answers: [
        {
          answer: 'other_answer',
          image: 'other_image'
        }
      ],
      date: new Date()
    }
  ]
}

describe('DbLoadSurveys Usecase', () => {
  test('Should call LoadSurveysRepository', async () => {
    class LoadSurveysRepositoryStub implements LoadSurveysRepository {
      async loadAll(): Promise<SurveyModel[]> {
        const fakeSurveys = makeFakeSurveys()

        return new Promise((resolve) => resolve(fakeSurveys))
      }
    }

    const loadSurveysRepositoryStub = new LoadSurveysRepositoryStub()

    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')

    const sut = new DbLoadSurveys(loadSurveysRepositoryStub)

    await sut.load()

    expect(loadAllSpy).toHaveBeenCalled()
  })
})
