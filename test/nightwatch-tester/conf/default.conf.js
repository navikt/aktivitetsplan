const nightwatch_config = {
    src_folders: ['test/nightwatch-tester/integration/tests'],
    output_folder: 'test/nightwatch-tester/reports',
    output: true,
    custom_commands_path: 'test/nightwatch-tester/custom',
    custom_assertions_path: '',
    page_objects_path: ['test/nightwatch-tester/integration/pages'],
    globals_path: 'test/nightwatch-tester/integration/globals.js',
    selenium: {
        start_process: false,
    },

    test_settings: {
        default: {
            globals: {
                loginUrl: '',
                timeout: 10000,
                baseUrl: 'http://localhost:3000',
                fnr: '12345678912',
            },
            selenium_port: 9515,
            selenium_host: 'localhost',
            default_path_prefix: '',

            javaScriptEnabled: true,
            acceptSslCerts: true,
            disable_colors: true,
            screenshots: {
                enabled: true,
                on_failure: true,
                on_error: true,
                path: 'test/nightwatch-tester/reports',
            },
            desiredCapabilities: {
                browserName: 'chrome',
                chromeOptions: {
                    args: ['--headless', '--no-sandbox', '--disable-gpu', '--log-level=3'],
                },
            },
        },
    },
};
let defaultSettings = nightwatch_config.test_settings.default.globals;
defaultSettings.loginUrl = `${defaultSettings.baseUrl}/aktivitetsplanfelles/${defaultSettings.fnr}`;

module.exports = nightwatch_config;
