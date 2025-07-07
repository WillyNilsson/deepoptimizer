#!/bin/bash
# Test GitHub Actions workflow locally
# This simulates the exact environment GitHub Actions uses

echo "🚀 Simulating GitHub Actions environment..."
echo "================================================"

# Create a temporary directory
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

# Copy the project
echo "📋 Copying project files..."
cp -r "$(dirname "$0")/.." deepoptimizer
cd deepoptimizer

# Test with Python 3.8 (same as GitHub Actions)
echo -e "\n🐍 Testing with Python 3.8..."
if command -v python3.8 &> /dev/null; then
    python3.8 -m venv test_env
    source test_env/bin/activate
else
    echo "⚠️  Python 3.8 not found, using current Python"
    python -m venv test_env
    source test_env/bin/activate
fi

# Simulate GitHub Actions steps
echo -e "\n📦 Running GitHub Actions CI steps..."
echo "Step 1: Upgrade pip"
python -m pip install --upgrade pip

echo -e "\nStep 2: Install package"
pip install -e .

if [ $? -eq 0 ]; then
    echo -e "\n✅ Package installation successful!"
    
    echo -e "\nStep 3: Test CLI"
    deepoptimizer --version
    
    if [ $? -eq 0 ]; then
        echo "✅ CLI works!"
    else
        echo "❌ CLI failed!"
    fi
else
    echo -e "\n❌ Package installation failed!"
    echo "This is the same error you would see in GitHub Actions"
fi

# Cleanup
deactivate
cd /
rm -rf "$TEMP_DIR"

echo -e "\n================================================"
echo "Test complete. Check output above for any errors."