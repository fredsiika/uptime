/*
 * Create and export configuration variables
 * 
*/

// Container for all environments
var environments = {};

// Staging (default) environment
environments.staging = {
    'httpPort' : 3000,
    'httpsPort' : 3001,
    'envName' : 'staging',
    'hashingSecret' : 'thisIsSecret',
    'maxChecks' : 5,
    'twilio' : {
        'accountSid' : 'AC39df209c0ebdd142ba373af6cf7e7ffd',
        'authToken' : '247456d7f171a3bf1dabc735bd42ef24',
        'fromPhone' : '+14159926091'
    },
    'templateGlobals' : {
        'appName' : 'UptimeChecker',
        'companyName' : 'AnotherFakeCompany, Inc.',
        'yearCreated' : '2019',
        'baseUrl' : 'http://localhost:3000/'
    }
};

// Production environment
environments.production = {
    'httpPort' : 5000,
    'httpsPort' : 5001,
    'envName' : 'production',
    'hashingSecret' : 'thisIsAlsoASecret',
    'maxChecks' : 10,
    'twilio' : {
        'accountSid' : '',
        'authToken' : '',
        'fromPhone' : ''
  },
  'templateGlobals' : {
    'appName' : 'UptimeChecker',
    'companyName' : 'AnotherFakeCompany, Inc.',
    'yearCreated' : '2019',
    'baseUrl' : 'http://localhost:5000/'
    }
};

// Determine which environment was passed as a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one fo the environments above, if not default to staging
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;