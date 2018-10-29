#!/bin/bash
set -e

if [ -n "$VERDIKJEDETEST" ]; then

    echo "Kjører verdikjedetester"
    params=" --skiptags browserstack,arena -e verdikjede"
    conf="test/integration/default.conf.js"
    echo ${params}

elif [ -n "$BROWSERSTACK_USER" ] && [ -n "$BROWSERSTACK_KEY" ]; then
    echo "Kjører browserstack tester"
    params="-e win_chrome,ios_safari,android_chrome,win_ie,win_edge --tag browserstack"
    conf="test/integration/browserstack.conf.js"

else
    echo "Kjører flyttester med mocket backend"
    params="--skiptags browserstack"
    conf="test/integration/default.conf.js"

fi

node test/integration/nightwatch.js -c ${conf} ${params}
