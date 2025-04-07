#!/bin/bash

# Build the TypeScript code
echo "Building TypeScript..."
npm run build

# Start the server with Node.js, keeping it alive with the --max-old-space-size option
# to ensure enough memory and preventing the process from exiting
echo "Starting server..."
NODE_ENV=production node --max-old-space-size=2048 --unhandled-rejections=strict dist/index.js &

# Save the process ID
echo $! > server.pid

echo "Server started with PID $(cat server.pid)"
echo "To stop the server, run: kill $(cat server.pid)" 