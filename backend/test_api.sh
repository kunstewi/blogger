#!/bin/bash

# Blogger API Endpoint Testing Script
# This script tests all API endpoints systematically

BASE_URL="http://localhost:8000"
TOKEN_FILE="/tmp/blogger_test_token.txt"
POST_ID_FILE="/tmp/blogger_test_post_id.txt"
COMMENT_ID_FILE="/tmp/blogger_test_comment_id.txt"

echo "========================================="
echo "Blogger API Endpoint Testing"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

test_count=0
pass_count=0
fail_count=0

# Function to test an endpoint
test_endpoint() {
    local name="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"
    local auth="$5"
    
    test_count=$((test_count + 1))
    echo -e "${YELLOW}Test $test_count: $name${NC}"
    
    if [ "$auth" = "true" ]; then
        TOKEN=$(cat $TOKEN_FILE 2>/dev/null)
        response=$(curl -s -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -d "$data")
    else
        response=$(curl -s -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    echo "$response" | jq . 2>/dev/null || echo "$response"
    
    # Check if response contains "error" or has error status
    if echo "$response" | grep -q '"message".*"error"' || echo "$response" | grep -q '"error"'; then
        echo -e "${RED}❌ FAILED${NC}"
        fail_count=$((fail_count + 1))
    else
        echo -e "${GREEN}✅ PASSED${NC}"
        pass_count=$((pass_count + 1))
    fi
    echo ""
}

# 1. Health Check
echo "========================================="
echo "1. HEALTH CHECK"
echo "========================================="
test_endpoint "Health Check" "GET" "/" "" "false"

# 2. Authentication Tests
echo "========================================="
echo "2. AUTHENTICATION TESTS"
echo "========================================="

# Register (might fail if user exists, that's ok)
test_endpoint "Register New User" "POST" "/api/auth/register" \
    '{"name":"API Test User","email":"apitest@example.com","password":"test123456"}' "false"

# Login and save token
echo -e "${YELLOW}Logging in and saving token...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"apitest@example.com","password":"test123456"}')

echo "$LOGIN_RESPONSE" | jq .
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
    echo "$TOKEN" > $TOKEN_FILE
    echo -e "${GREEN}✅ Login successful, token saved${NC}"
    pass_count=$((pass_count + 1))
else
    echo -e "${RED}❌ Login failed${NC}"
    fail_count=$((fail_count + 1))
fi
test_count=$((test_count + 1))
echo ""

# Get Profile
test_endpoint "Get User Profile" "GET" "/api/auth/profile" "" "true"

# Update Profile
test_endpoint "Update Profile" "PUT" "/api/auth/profile" \
    '{"name":"Updated Test User","bio":"Testing the API"}' "true"

# 3. Blog Post Tests
echo "========================================="
echo "3. BLOG POST TESTS"
echo "========================================="

# Create Post
echo -e "${YELLOW}Creating a blog post...${NC}"
CREATE_POST_RESPONSE=$(curl -s -X POST "$BASE_URL/api/posts" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $(cat $TOKEN_FILE)" \
    -d '{
        "title":"Test Blog Post - API Testing",
        "content":"# Test Post\n\nThis is a **test** blog post created via API.\n\n## Features\n- Markdown support\n- Auto slug generation\n- Tags",
        "tags":"testing, api, markdown",
        "isDraft":false
    }')

echo "$CREATE_POST_RESPONSE" | jq .
POST_ID=$(echo "$CREATE_POST_RESPONSE" | jq -r '.post._id')
POST_SLUG=$(echo "$CREATE_POST_RESPONSE" | jq -r '.post.slug')

if [ "$POST_ID" != "null" ] && [ -n "$POST_ID" ]; then
    echo "$POST_ID" > $POST_ID_FILE
    echo -e "${GREEN}✅ Post created successfully${NC}"
    echo "Post ID: $POST_ID"
    echo "Post Slug: $POST_SLUG"
    pass_count=$((pass_count + 1))
else
    echo -e "${RED}❌ Post creation failed${NC}"
    fail_count=$((fail_count + 1))
fi
test_count=$((test_count + 1))
echo ""

# Get All Posts
test_endpoint "Get All Posts (Public)" "GET" "/api/posts?page=1&limit=5" "" "false"

# Get Post by Slug
if [ -n "$POST_SLUG" ] && [ "$POST_SLUG" != "null" ]; then
    test_endpoint "Get Post by Slug" "GET" "/api/posts/$POST_SLUG" "" "false"
fi

# Get User's Posts
test_endpoint "Get My Posts" "GET" "/api/posts/user/my-posts" "" "true"

# Like Post
if [ -n "$POST_ID" ] && [ "$POST_ID" != "null" ]; then
    test_endpoint "Like Post" "PATCH" "/api/posts/$POST_ID/like" "" "false"
fi

# Update Post
if [ -n "$POST_ID" ] && [ "$POST_ID" != "null" ]; then
    test_endpoint "Update Post" "PUT" "/api/posts/$POST_ID" \
        '{"title":"Updated Test Post","content":"# Updated Content\n\nThis post has been updated!"}' "true"
fi

# Toggle Draft
if [ -n "$POST_ID" ] && [ "$POST_ID" != "null" ]; then
    test_endpoint "Toggle Draft Status" "PATCH" "/api/posts/$POST_ID/draft" "" "true"
fi

# 4. Comment Tests
echo "========================================="
echo "4. COMMENT TESTS"
echo "========================================="

if [ -n "$POST_ID" ] && [ "$POST_ID" != "null" ]; then
    # Create Comment
    echo -e "${YELLOW}Creating a comment...${NC}"
    CREATE_COMMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/comments" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $(cat $TOKEN_FILE)" \
        -d "{\"postId\":\"$POST_ID\",\"content\":\"Great post! Very informative.\"}")
    
    echo "$CREATE_COMMENT_RESPONSE" | jq .
    COMMENT_ID=$(echo "$CREATE_COMMENT_RESPONSE" | jq -r '.comment._id')
    
    if [ "$COMMENT_ID" != "null" ] && [ -n "$COMMENT_ID" ]; then
        echo "$COMMENT_ID" > $COMMENT_ID_FILE
        echo -e "${GREEN}✅ Comment created successfully${NC}"
        pass_count=$((pass_count + 1))
    else
        echo -e "${RED}❌ Comment creation failed${NC}"
        fail_count=$((fail_count + 1))
    fi
    test_count=$((test_count + 1))
    echo ""
    
    # Get Post Comments
    test_endpoint "Get Post Comments" "GET" "/api/comments/$POST_ID" "" "false"
    
    # Update Comment
    if [ -n "$COMMENT_ID" ] && [ "$COMMENT_ID" != "null" ]; then
        test_endpoint "Update Comment" "PUT" "/api/comments/$COMMENT_ID" \
            '{"content":"Updated comment: This is even better!"}' "true"
    fi
fi

# 5. Dashboard Tests
echo "========================================="
echo "5. DASHBOARD TESTS"
echo "========================================="

test_endpoint "Get Dashboard Stats" "GET" "/api/dashboard/stats" "" "true"
test_endpoint "Get Recent Activity" "GET" "/api/dashboard/recent?limit=3" "" "true"
test_endpoint "Get Popular Posts" "GET" "/api/dashboard/popular?limit=3&sortBy=views" "" "true"

# 6. AI Tests (if GEMINI_API_KEY is configured)
echo "========================================="
echo "6. AI WRITING ASSISTANT TESTS"
echo "========================================="

test_endpoint "Generate Blog Outline" "POST" "/api/ai/generate-outline" \
    '{"topic":"Introduction to Node.js","sections":3}' "true"

test_endpoint "Generate Tags" "POST" "/api/ai/generate-tags" \
    '{"content":"This is a blog post about JavaScript, Node.js, and Express framework for building REST APIs"}' "true"

test_endpoint "Improve Content Section" "POST" "/api/ai/improve-section" \
    '{"content":"Node.js is good for building APIs.","instructions":"Make it more detailed and professional"}' "true"

# Summary
echo "========================================="
echo "TEST SUMMARY"
echo "========================================="
echo "Total Tests: $test_count"
echo -e "${GREEN}Passed: $pass_count${NC}"
echo -e "${RED}Failed: $fail_count${NC}"
echo ""

if [ $fail_count -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed. Check the output above for details.${NC}"
    exit 1
fi
