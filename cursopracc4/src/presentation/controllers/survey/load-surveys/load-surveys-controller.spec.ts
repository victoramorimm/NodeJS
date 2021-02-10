import { SurveyModel } from '../../../../domain/models/survey'
import MockDate from 'mockdate'
import { LoadSurveysController } from './load-surveys-controller'
import { LoadSurveys } from '../../../../domain/usecases/load-surveys'

const makeFakeSurveys = (): SurveyModel[] => {
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

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveys', async () => {
    class LoadSurveysStub implements LoadSurveys {
      async load(): Promise<SurveyModel[]> {
        const fakeSurvey: SurveyModel[] = makeFakeSurveys()

        return new Promise((resolve) => resolve(fakeSurvey))
      }
    }

    const loadSurveysStub = new LoadSurveysStub()

    const loadSpy = jest.spyOn(loadSurveysStub, 'load')

    const sut = new LoadSurveysController(loadSurveysStub)

    await sut.handle({})

    expect(loadSpy).toHaveBeenCalled()
  })
})
