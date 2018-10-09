const testmiljo = process.env.MILJO ? process.env.MILJO.toLowerCase() : 'q6';
const URLBuilder = {
    baseFSSUrl: env => {
        return `https://app-${env}.adeo.no`;
    },
    baseUrl: env => {
        return `https://tjenester-${env}.nav.no`;
    },
    SBSUrl(env) {
        return this.baseUrl(env) + '/aktivitetsplan';
    },

    FSSUrl(env) {
        return this.baseFSSUrl(env) + '/veilarbpersonflatefs/';
    },
};

const nightwatch_config = {
    src_folders: ['test/integration/tests'],
    output_folder: 'test/integration/reports',
    output: true,
    custom_commands_path: 'test/integration/custom',
    custom_assertions_path: '',
    page_objects_path: ['test/integration/pages'],
    globals_path: 'test/integration/globals.js',
    selenium: {
        start_process: false,
        port: 9515,
        host: 'localhost',
    },
    test_settings: {
        default: {
            globals: {
                FSSUrl: 'http://localhost:3000/aktivitetsplanfelles/',
                SBSUrl: 'http://localhost:3000/aktivitetsplanfelles/',
                timeout: 10000,
                FSSBaseUrl: 'http://localhost:3000',
                SBSBaseUrl: 'http://localhost:3000',
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
                path: 'test/integration/reports',
            },
            desiredCapabilities: {
                browserName: 'chrome',
                chromeOptions: {
                    args: [
                        '--headless',
                        '--no-sandbox',
                        '--disable-gpu',
                        '--log-level=3',
                    ],
                },
            },
        },
        verdikjede: {
            globals: {
                testmiljo: testmiljo,
                FSSUrl: URLBuilder.FSSUrl(testmiljo),
                SBSUrl: URLBuilder.SBSUrl(testmiljo),
                FSSBaseUrl: URLBuilder.baseFSSUrl(testmiljo),
                SBSBaseUrl: URLBuilder.baseUrl(testmiljo),
                timeout: 10000,
            },
        },
    },
};

nightwatch_config.test_settings.default.globals.testbrukere = {
    SBS: { brukerNavn: '12345678910' },
};
module.exports = nightwatch_config;
