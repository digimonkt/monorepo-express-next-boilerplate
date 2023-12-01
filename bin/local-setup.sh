#!/bin/bash

# Navigate to the root of the monorepo
cd "$(dirname "$0")/.." || exit

# Install dependencies 
yarn install --frozen-lockfile

# Create .env file in the 'api' package
api_env_file="./packages/api/.env"
echo "PORT=4000" > "$api_env_file"
echo "MONGODB_URI=" >> "$api_env_file"
echo "" >> "$api_env_file"
echo "JWT_SECRET=secret" >> "$api_env_file"
echo "" >> "$api_env_file"
echo "# The following variables are required for sending emails" >> "$api_env_file"
echo "EMAIL_SERVICE=" >> "$api_env_file"
echo "EMAIL_HOST=" >> "$api_env_file"
echo "EMAIL_REJECT_UNAUTHORIZED=true" >> "$api_env_file"
echo "EMAIL_SECURE=true" >> "$api_env_file"
echo "EMAIL_PORT=" >> "$api_env_file"
echo "EMAIL_USER=" >> "$api_env_file"
echo "EMAIL_PASS=" >> "$api_env_file"

echo "Created .env file in '@monorepo/api' package"


# Create .env file in the '@monorepo/ui-web' package
ui_web_env_file="./packages/ui-web/.env"
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:4000" > "$ui_web_env_file"

echo "Created .env file in '@monorepo/ui-web' package"

echo "Local setup completed!"
