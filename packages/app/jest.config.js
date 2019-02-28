module.exports = {
  browser: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.js'],
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  verbose: true
}
