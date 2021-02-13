module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/**/*.ts',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/data/usecases/add-account/db-add-account-protocols.ts',
    '!<rootDir>/src/data/usecases/authentication/db-authentication-protocols.ts',
    '!<rootDir>/src/data/usecases/add-survey/db-add-survey-protocols.ts',
    '!<rootDir>/src/presentation/controllers/login/login/login-controller-protocols.ts',
    '!<rootDir>/src/presentation/controllers/login/signup/signup-controller-protocols.ts',
    '!<rootDir>/src/presentation/controllers/survey/add-survey/add-survey-protocols.ts',
    '!<rootDir>/src/presentation/protocols/index.ts',
    '!<rootDir>/src/presentation/middlewares/auth-middleware-protocols.ts',
    '!<rootDir>/src/infra/db/mongodb/account/account-mongo-repository-protocols.ts'
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  }
}
