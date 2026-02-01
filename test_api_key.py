#!/usr/bin/env python3
import json
import requests

print("🔍 Testing Claude API Key...\n")

# Load key
try:
    with open('keys.config', 'r') as f:
        keys = json.load(f)
    api_key = keys['claude']['api_key']
    print(f"✅ API key loaded: {api_key[:15]}...{api_key[-4:]}")
except Exception as e:
    print(f"❌ Error loading key: {e}")
    exit(1)

# Test key format
if not api_key.startswith('sk-ant-'):
    print(f"⚠️  WARNING: Key doesn't start with 'sk-ant-'")
    print(f"   Your key starts with: {api_key[:10]}")
else:
    print(f"✅ Key format OK")

# Test API call
url = "https://api.anthropic.com/v1/messages"
headers = {
    "x-api-key": api_key,
    "anthropic-version": "2023-06-01",
    "content-type": "application/json"
}

data = {
    "model": "claude-sonnet-4-20250514",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "Say 'test'"}]
}

print(f"\n📤 Testing API call...")
print(f"   URL: {url}")
print(f"   Model: claude-sonnet-4-20250514")

try:
    resp = requests.post(url, headers=headers, json=data, timeout=30)
    print(f"\n📊 Response:")
    print(f"   Status: {resp.status_code}")
    
    if resp.status_code == 200:
        result = resp.json()
        print(f"   ✅ SUCCESS! API key works!")
        print(f"   Response: {result['content'][0]['text'][:50]}")
    else:
        print(f"   ❌ FAILED!")
        print(f"   Error: {resp.text[:200]}")
        
except Exception as e:
    print(f"   ❌ Exception: {e}")
