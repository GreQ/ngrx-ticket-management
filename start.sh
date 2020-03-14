#!/usr/bin/env bash
echo 'stating server ...'
(npm run server) &
(ng serve --proxy-config proxy.config.json --o)

