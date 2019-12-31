#!/usr/bin/env bash
set -eu

# env "PATH=$PATH" alows to access add-to-systemd in sudo mode
sudo env "PATH=$PATH" add-to-systemd \
   --env NODE_ENV=production \
   --env FORCE_COLOR=true \
   --env PATH="$PATH" \
   entities-search-engine "$(which node) $(pwd)/server/server.js"
