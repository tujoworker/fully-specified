#!/bin/bash

echo 'Building ...'

babel ./ \
--extensions '.ts' \
--config-file ../babel.config.js \
--out-dir ./ \
--copy-files \
--no-copy-ignored \
--ignore 'src/cjs,src/esm,src/umd,src/core,**/*.test.js,**/__tests__/**/*,**/*.d.ts'

echo 'Building done ✅'

