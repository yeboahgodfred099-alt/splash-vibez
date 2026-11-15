#!/bin/sh
set -e

# Generate env-config.js with runtime environment variables
cat <<EOF > /usr/share/nginx/html/env-config.js
window.__ENV__ = {
  VITE_N8N_COUPON_VALIDATE_URL: "${VITE_N8N_COUPON_VALIDATE_URL}",
  VITE_N8N_REGISTRATION_URL: "${VITE_N8N_REGISTRATION_URL}",
  VITE_N8N_PAYMENT_STATUS_URL: "${VITE_N8N_PAYMENT_STATUS_URL}",
  VITE_N8N_TICKET_URL: "${VITE_N8N_TICKET_URL}"
};
EOF

# Execute the default container command (nginx)
exec "$@"

