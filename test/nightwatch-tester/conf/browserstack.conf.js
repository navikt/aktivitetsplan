require('babel-core/register');

let nightwatch_config = {
    src_folders: ['test/nightwatch-tester/integration/tests'],
    output_folder: 'test/nightwatch-tester/reports',
    output: true,
    custom_commands_path: '',
    custom_assertions_path: '',
    page_objects_path: ['test/nightwatch-tester/integration/pages'],
    selenium: {
        start_process: false,
    },

    selenium: {
        start_process: false,
        host: 'hub-cloud.browserstack.com',
        port: 80,
    },

    common_capabilities: {
        build: 'nightwatch-browserstack',
        'browserstack.debug': true,
        'browserstack.local': true,
    },

    test_settings: {
        default: {
            globals: {
                baseUrl: 'http://localhost:3000',
                fnr: '123456789',
                launch_url: '',
            },
            screenshots: {
                enabled: true,
                on_failure: true,
                on_error: true,
                path: 'test/nightwatch-tester/reports',
            },
        },
        chrome: {
            desiredCapabilities: {
                os: 'Windows',
                os_version: '10',
                browser: 'Chrome',
                browser_version: '65.0',
                resolution: '1024x768',
            },
        },
        safari: {
            desiredCapabilities: {
                os: 'OS X',
                os_version: 'High Sierra',
                browser: 'Safari',
                browser_version: '11.0',
                resolution: '1024x768',
            },
        },
        ios: {
            desiredCapabilities: {
                device: 'iPhone 8',
                realMobile: 'true',
                os_version: '11.0',
            },
        },
        ie: {
            desiredCapabilities: {
                os: 'Windows',
                os_version: '10',
                browser: 'IE',
                browser_version: '11.0',
                resolution: '1024x768',
            },
        },
    },
};

// Code to support common capabilites
nightwatch_config.common_capabilities['browserstack.user'] = process.env.BROWSERSTACK_USER;
nightwatch_config.common_capabilities['browserstack.key'] = process.env.BROWSERSTACK_KEY;

var globals = nightwatch_config.test_settings.default.globals;
nightwatch_config.test_settings.default.launch_url = `${globals.baseUrl}/aktivitetsplanfelles/${globals.fnr}`;

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
