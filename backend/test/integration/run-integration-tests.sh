#!/bin/bash

echo "Starting Integration Tests..."

# Set environment variables for testing
export NODE_ENV=test
export OPENAI_API_KEY=test-key

# Run the integration tests
npm run test:e2e

echo "Integration tests completed!" 