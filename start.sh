#!/usr/bin/env bash

(cd server && npm run server) &
(cd client && ng serve --proxy-config proxy.config.json)

