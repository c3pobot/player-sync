#!/bin/bash
echo updating statcalc
npm i --package-lock-only github:/c3pobot/statcalc
echo updating mongo-cache
npm i --package-lock-only github:c3pobot/mongo-cache
echo updating valkey-cache
npm i --package-lock-only github:/c3pobot/valkey-cache
