import { Collection } from 'mongodb'
import { AddSurveyModel } from '../../../../data/protocols/survey/add-survey-model'
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

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer'
    },
    {
      answer: 'other_answer'
    }
  ],
  date: new Date()
})

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('Survey Mongo Repository', () => {
  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut()

      const fakeSurveyData = makeFakeSurveyData()

      await sut.add(fakeSurveyData)

      const survey = await surveyCollection.findOne({
        question: 'any_question'
      })

      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      await surveyCollection.insertMany([
        {
          question: 'any_question',
          answers: [
            {
              image: 'any_image',
              answer: 'any_answer'
            },
            {
              answer: 'other_answer'
            }
          ],
          date: new Date()
        },
        {
          question: 'other_question',
          answers: [
            {
              image: 'other_image',
              answer: 'other_answer'
            },
            {
              answer: 'other_answer'
            }
          ],
          date: new Date()
        }
      ])

      const sut = makeSut()

      const surveysFromDb = await sut.loadAll()

      expect(surveysFromDb.length).toBe(2)
      expect(surveysFromDb[0].question).toBe('any_question')
      expect(surveysFromDb[1].question).toBe('other_question')
    })
  })
})
