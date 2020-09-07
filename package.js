Package.describe({
  name: 'quave:analytics',
  version: '1.0.0',
  summary: 'Utility package to send page views to Google Analytics',
  git: 'https://github.com/quavedev/logs',
});

Package.onUse(function(api) {
  api.versionsFrom('1.11');
  api.use(['ecmascript']);

  api.use('quave:settings@1.0.0');

  api.mainModule('analytics-client.js', 'client');
  api.mainModule('analytics-server.js', 'server');
});
