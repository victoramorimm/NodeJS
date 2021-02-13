import { SurveyAnswerModel } from '@/domain/models/survey'

export interface SurveyModel {
  id: string
  question: string
  answers: SurveyAnswerModel[]
  date: Date
}
