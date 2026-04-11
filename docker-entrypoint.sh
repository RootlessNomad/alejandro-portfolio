#!/bin/sh
# Inject environment variables into js/config.js at container startup
CONFIG=/usr/share/nginx/html/js/config.js

sed -i "s|__EMAILJS_SERVICE_ID__|${EMAILJS_SERVICE_ID:-}|g" "$CONFIG"
sed -i "s|__EMAILJS_TEMPLATE_ID__|${EMAILJS_TEMPLATE_ID:-}|g" "$CONFIG"
sed -i "s|__EMAILJS_PUBLIC_KEY__|${EMAILJS_PUBLIC_KEY:-}|g" "$CONFIG"

exec "$@"
