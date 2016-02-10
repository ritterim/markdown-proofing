'use strict';

require('shelljs/global');

mkdir('-p', './lib/presets');
cp('-R', './src/lib/presets/', './lib/presets/');
