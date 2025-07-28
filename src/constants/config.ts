export const Config = {
  VERSION: 'v0.0.1',
  BASE_ENVIRONMENT: '',
  ENVIRONMENTS_URLS: {},
  BASE_URL: '',
  API_VERSION: 'v1',
  DEPLOY_VERSION: '',
  EXTERNAL_PROTOCOLS: ['http', 'https'],
  TOKEN_HEADER_KEY: 'Authorization',
  DEV_VARIABLES: { INTEGRATION1: '', INTEGRATION2: '' },
  TEST_VARIABLES: { INTEGRATION1: '', INTEGRATION2: '' },
};

export type ConfigType = typeof Config;
