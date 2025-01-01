#!/bin/sh

# Replace environment variables in the nginx config
envsubst '${VITE_API_URL} ${VITE_PRIVY_APP_ID}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Replace environment variables in the index.html
INDEX_FILE="/usr/share/nginx/html/index.html"
if [ -f "$INDEX_FILE" ]; then
    # Replace environment variables
    envsubst '${VITE_API_URL} ${VITE_PRIVY_APP_ID}' < "$INDEX_FILE" > "$INDEX_FILE.tmp"
    mv "$INDEX_FILE.tmp" "$INDEX_FILE"
fi

# Execute CMD
exec "$@"