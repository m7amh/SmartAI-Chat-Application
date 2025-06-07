
import requests
import unittest
import json
import sys
from datetime import datetime

class SmartAIChatTester:
    def __init__(self, base_url="http://localhost:4000"):
        # Use the base_url provided or default to localhost:4000
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"Response: {json.dumps(response_data, indent=2, ensure_ascii=False)}")
                except:
                    print(f"Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"Response: {response.text[:200]}...")

            result = {
                "test_name": name,
                "success": success,
                "status_code": response.status_code,
                "expected_status": expected_status
            }
            
            try:
                result["response"] = response.json()
            except:
                result["response"] = response.text[:200]
                
            self.test_results.append(result)
            return success, response

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.test_results.append({
                "test_name": name,
                "success": False,
                "error": str(e)
            })
            return False, None

    def test_health_endpoint(self):
        """Test the /health endpoint"""
        return self.run_test(
            "Health Endpoint",
            "GET",
            "health",
            200
        )

    def test_chat_endpoint_english(self):
        """Test the /api/chat endpoint with English message"""
        return self.run_test(
            "Chat Endpoint (English)",
            "POST",
            "api/chat",
            200,
            data={"message": "Hello, how are you today?"}
        )
        
    def test_chat_endpoint_arabic(self):
        """Test the /api/chat endpoint with Arabic message"""
        return self.run_test(
            "Chat Endpoint (Arabic)",
            "POST",
            "api/chat",
            200,
            data={"message": "مرحبا، كيف حالك اليوم؟"}
        )
        
    def test_chat_endpoint_empty_message(self):
        """Test the /api/chat endpoint with empty message"""
        return self.run_test(
            "Chat Endpoint (Empty Message)",
            "POST",
            "api/chat",
            400,
            data={"message": ""}
        )
        
    def test_chat_endpoint_missing_message(self):
        """Test the /api/chat endpoint with missing message field"""
        return self.run_test(
            "Chat Endpoint (Missing Message)",
            "POST",
            "api/chat",
            400,
            data={}
        )
        
    def test_chat_endpoint_with_temperature(self):
        """Test the /api/chat endpoint with temperature parameter"""
        return self.run_test(
            "Chat Endpoint (With Temperature)",
            "POST",
            "api/chat",
            200,
            data={"message": "Tell me a joke", "temperature": 0.7}
        )

    def print_summary(self):
        """Print a summary of all test results"""
        print("\n" + "="*50)
        print(f"📊 TEST SUMMARY: {self.tests_passed}/{self.tests_run} tests passed")
        print("="*50)
        
        for result in self.test_results:
            status = "✅ PASSED" if result.get("success") else "❌ FAILED"
            print(f"{status} - {result.get('test_name')}")
            
        print("="*50)
        return self.tests_passed == self.tests_run

def main():
    # Get base URL from command line if provided
    base_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:4000"
    print(f"🚀 Testing SmartAI Chat API at {base_url}")
    
    tester = SmartAIChatTester(base_url)
    
    # Run all tests
    tester.test_health_endpoint()
    tester.test_chat_endpoint_english()
    tester.test_chat_endpoint_arabic()
    tester.test_chat_endpoint_empty_message()
    tester.test_chat_endpoint_missing_message()
    tester.test_chat_endpoint_with_temperature()
    
    # Print summary
    all_passed = tester.print_summary()
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())
