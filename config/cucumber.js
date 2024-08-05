module.exports = {
  default: {
    formatOptions: {
      snippetInterface: 'async-await',
    },
    paths: ['src/test/api/features/'],
    dryRun: false,
    require: [
      'src/test/api/step_definitions/*',
      'src/test/api/step_definitions/*/*.ts',
      'src/test/hooks/hooks.ts',
      'src/test/helper/report/report.ts',
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress-bar',
      'html:test-results/cucumber-report.html',
      'json:test-results/cucumber-report.json',
      'junit:test-results/cucumber-report.xml',
    ],
  },
}
