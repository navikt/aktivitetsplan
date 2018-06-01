require('babel-core/register');

let nightwatch_config = {
    src_folders: ['test/nightwatch-tester/integration/tests'],
    output_folder: 'test/nightwatch-tester/reports',
    output: true,
    custom_commands_path: '',
    custom_assertions_path: '',
    globals_path: 'test/nightwatch-tester/integration/globals.js',
    page_objects_path: ['test/nightwatch-tester/integration/pages'],

    selenium: {
        start_process: false,
        host: 'hub-cloud.browserstack.com',
        port: 80,
    },

    common_capabilities: {
        'browserstack.debug': true,
        'browserstack.local': true,
        project: 'aktivitetsplan',
    },

    test_settings: {
        default: {
            globals: {
                baseUrl: 'http://localhost:8080',
                fnr: '123456789',
                launch_url: '',
                timeout: 10000,
            },
            screenshots: {
                enabled: true,
                on_failure: true,
                on_error: true,
                path: 'test/nightwatch-tester/reports',
            },
        },
        win_chrome: {
            desiredCapabilities: {
                os: 'Windows',
                os_version: '10',
                browser: 'Chrome',
                resolution: '1024x768',
            },
        },
        osx_safari: {
            desiredCapabilities: {
                os: 'OS X',
                os_version: 'Sierra',
                browser: 'Safari',
                browser_version: '10.0',
                resolution: '1024x768',
            },
        },
        ios: {
            desiredCapabilities: {
                device: 'iPhone X',
                realMobile: 'true',
                os_version: '11.0',
            },
        },
        android_chrome: {
            desiredCapabilities: {
                os_version: '7.0',
                device: 'Samsung Galaxy S8',
                real_mobile: 'true',
                browser: 'Chrome',
            },
        },
        win_ie: {
            desiredCapabilities: {
                os: 'Windows',
                os_version: '10',
                browser: 'IE',
                browser_version: '11.0',
                resolution: '1024x768',
            },
        },
        win_edge: {
            desiredCapabilities: {
                os: 'Windows',
                os_version: '10',
                browser: 'Edge',
                resolution: '1024x768',
            },
        },
    },
};

// Code to support common capabilites
nightwatch_config.common_capabilities['browserstack.user'] =
    process.env.BROWSERSTACK_USER;
nightwatch_config.common_capabilities['browserstack.key'] =
    process.env.BROWSERSTACK_KEY;

const pullRequest = process.env.TRAVIS_PULL_REQUEST || false;
const branch = pullRequest
    ? process.env.TRAVIS_PULL_REQUEST_BRANCH
    : process.env.TRAVIS_BRANCH || 'Local';
nightwatch_config.common_capabilities['build'] = branch;

var globals = nightwatch_config.test_settings.default.globals;
globals.launch_url = `${globals.baseUrl}/aktivitetsplanfelles/${globals.fnr}`;

for (var i in nightwatch_config.test_settings) {
    var config = nightwatch_config.test_settings[i];
    config['selenium_host'] = nightwatch_config.selenium.host;
    config['selenium_port'] = nightwatch_config.selenium.port;
    config['desiredCapabilities'] = config['desiredCapabilities'] || {};

    for (var j in nightwatch_config.common_capabilities) {
        config['desiredCapabilities'][j] =
            config['desiredCapabilities'][j] ||
            nightwatch_config.common_capabilities[j];
    }
}
module.exports = nightwatch_config;
