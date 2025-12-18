#!/bin/bash

# WalkSafe Quick Start Script
# This script automates the setup process

echo "================================="
echo "  WalkSafe Quick Start Setup     "
echo "================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if CocoaPods is installed
echo "Checking CocoaPods installation..."
if ! command -v pod &> /dev/null; then
    echo -e "${YELLOW}CocoaPods not found. Installing...${NC}"
    sudo gem install cocoapods
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ CocoaPods installed successfully${NC}"
    else
        echo -e "${RED}✗ Failed to install CocoaPods${NC}"
        echo "Please run: sudo gem install cocoapods"
        exit 1
    fi
else
    echo -e "${GREEN}✓ CocoaPods is installed${NC}"
fi

# Install Flutter dependencies
echo ""
echo "Installing Flutter dependencies..."
/Users/sanjana1106/development/flutter/bin/flutter pub get
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Flutter dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install Flutter dependencies${NC}"
    exit 1
fi

# Install iOS pods
echo ""
echo "Installing iOS pods..."
cd ios
pod install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ iOS pods installed successfully${NC}"
else
    echo -e "${YELLOW}⚠ Pod install had warnings (this is often normal)${NC}"
fi
cd ..

# Check if Python and TensorFlow are available
echo ""
echo "Checking Python and TensorFlow..."
if command -v python3 &> /dev/null; then
    echo -e "${GREEN}✓ Python 3 is installed${NC}"

    # Try to create a dummy TensorFlow model
    if python3 -c "import tensorflow" &> /dev/null; then
        echo -e "${GREEN}✓ TensorFlow is installed${NC}"
        echo "Creating TensorFlow Lite model..."
        python3 create_dummy_model.py
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ TensorFlow Lite model created${NC}"
        fi
    else
        echo -e "${YELLOW}⚠ TensorFlow not installed (optional)${NC}"
        echo "  To add ML support: pip3 install tensorflow numpy"
    fi
else
    echo -e "${YELLOW}⚠ Python 3 not found (optional for ML)${NC}"
fi

echo ""
echo "================================="
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo "================================="
echo ""
echo "To run the app:"
echo "  1. Open iOS Simulator: open -a Simulator"
echo "  2. Run Flutter: flutter run"
echo ""
echo "Or use the full path:"
echo "  /Users/sanjana1106/development/flutter/bin/flutter run"
echo ""
echo "For more details, see SETUP.md"
echo "================================="
