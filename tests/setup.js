// jest chrome
Object.assign(global, require('jest-chrome'))

// inject chrome into jest chrome faker
require('../src').setChrome(global.chrome)
