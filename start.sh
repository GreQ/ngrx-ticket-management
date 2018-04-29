#!/usr/bin/env bash

(npm run server) &
(ng serve --proxy-config proxy.config.json --o)

