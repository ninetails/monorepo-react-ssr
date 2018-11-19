module.exports = {
  browser: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,jsx}',
    '!**/__fixtures__/**'
  ],
  roots: ['<rootDir>/src'],
  setupTestFrameworkScriptFile: '<rootDir>jest.setup.js',
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  verbose: true
}
