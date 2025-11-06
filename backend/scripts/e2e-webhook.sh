#!/usr/bin/env bash
# E2E script: simulate webhook flow (create -> cancel -> query)
API_KEY="0c4a075f6ca97ef3533791a7af650e28adf5f220751b965c640cd3df3842904a"
BASE_URL="http://localhost:3001"
USER_ID="user_test_123"
SUB_ID="sub_TEST_001"
PHONE="+5551985670124"

set -e

echo "Sending CREATE..."
curl -s -X POST "$BASE_URL/api/webhook/stripe" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"event":"subscription.created","userId":"'$USER_ID'","subscriptionId":"'$SUB_ID'","email":"test@example.com","status":"active","phone":"'$PHONE'","customer":"cus_test_123"}' | jq

sleep 1

echo "Sending UPDATE -> canceled..."
curl -s -X POST "$BASE_URL/api/webhook/stripe" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"event":"subscription.updated","userId":"'$USER_ID'","subscriptionId":"'$SUB_ID'","status":"canceled"}' | jq

sleep 1

echo "Querying subscription..."
curl -s -X GET "$BASE_URL/api/subscription/user/$USER_ID" \
  -H "Authorization: Bearer $API_KEY" | jq

echo "Done." 
