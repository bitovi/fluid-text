#!/bin/bash

cp tests/index.html tests/tailwind/index.html

cd tests/tailwind
npm i
npx tailwindcss -o ./output.css
cd ../../

cp tests/index.html tests/uno/index.html

cd tests/uno
npm i
npx @unocss/cli ./index.html -c ./uno.config.js -o ./output.css
cd ../../

cp tests/index.html tests/utility/index.html
