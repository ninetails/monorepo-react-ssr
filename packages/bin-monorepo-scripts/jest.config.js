module.exports = {
  browser: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.{js,ts,tsx}'],
  reporters: process.env.CI
    ? [['jest-silent-reporter', { useDots: true }]]
    : undefined,
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.(js|ts|tsx)$': 'babel-jest'
  }
}
