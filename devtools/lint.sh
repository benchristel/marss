#!/bin/bash -e

ERRORS=0
node_modules/.bin/eslint . || ERRORS=1
node_modules/.bin/prettier --check . || ERRORS=1

if [ "$ERRORS" -ne 0 ]; then
  exit 1
fi
