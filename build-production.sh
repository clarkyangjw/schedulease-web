#!/bin/bash
# Frontend production build script for VM deployment

echo "Building frontend for production..."

# Build the frontend (uses relative paths for API when deployed on same server)
npm run build

if [ $? -eq 0 ]; then
    echo "✓ Frontend build completed successfully"
    echo "Build output: dist/"
else
    echo "✗ Frontend build failed"
    exit 1
fi

