const report = require('multiple-cucumber-html-reporter')

report.generate({
  jsonDir: 'test-results',
  reportPath: './test-results',
  reportName: 'Playwright Test Report',
  disableLog: true,
  pageTitle: 'API Test with Playwright',
  displayDuration: false,
  metadata: {
    device: 'Docker',
    platform: {
      name: 'Linux',
    },
  },
  customData: {
    title: 'Test Info',
    data: [{ label: 'Project', value: 'API Test' }],
  },
})
