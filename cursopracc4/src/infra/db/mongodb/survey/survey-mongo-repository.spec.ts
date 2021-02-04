import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection

beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL)
})

afterAll(async () => {
  await MongoHelper.disconnect()
})

beforeEach(async () => {
  surveyCollection = await MongoHelper.getCollection('surveys')

  await surveyCollection.deleteMany({})
})

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('Survey Mongo Repository', () => {
  test('Should add a survey on success', async () => {
    const sut = makeSut()

    const fakeSurveyData = {
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer'
        },
        {
          answer: 'other_answer'
        }
      ]
    }

    await sut.add(fakeSurveyData)

    const survey = await surveyCollection.findOne({
      question: 'any_question'
    })

    expect(survey).toBeTruthy()
  })
})
