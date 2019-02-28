module.exports = {
  browser: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.js'],
  reporters: process.env.CI ? [['jest-silent-reporter', { useDots: true }]] : [],
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
}
