# Salesforce Integration Specification

## Overview
This document provides the technical specification for integrating Salesforce with the Ogury Campaign Creator platform. The integration allows Salesforce to create campaigns and line items through the Ogury API.

## Base URLs

### Production Environment
- **Authentication**: `https://gateway-tyk-oss.devc.cloud.ogury.io/oauth2/token`
- **Campaigns API**: `https://admin.devc.cloud.ogury.io/api/ogury-one/campaigns`
- **Line Items API**: `https://gateway-tyk-oss.devc.cloud.ogury.io/trafficking/api/line-items`
- **Managers API**: `https://gateway-tyk-oss.devc.cloud.ogury.io/trafficking/api/managers/{type}`

## Authentication

### OAuth2 Client Credentials Flow
```http
POST https://gateway-tyk-oss.devc.cloud.ogury.io/oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id={CLIENT_ID}&client_secret={CLIENT_SECRET}
```

### Response
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### Usage
Include the access token in all API requests:
```http
Authorization: Bearer {access_token}
```

## Manager ID Resolution

Before creating campaigns or line items, Salesforce must resolve manager IDs using email addresses.

### Get BI Manager ID
```http
GET https://gateway-tyk-oss.devc.cloud.ogury.io/trafficking/api/managers/bi?email={EMAIL}
Authorization: Bearer {access_token}
```

### Get Sales Manager ID
```http
GET https://gateway-tyk-oss.devc.cloud.ogury.io/trafficking/api/managers/sales_manager?email={EMAIL}
Authorization: Bearer {access_token}
```

### Response
```json
{
  "id": 2593,
  "email": "manager@ogury.co",
  "name": "Manager Name"
}
```

## Campaign Creation

### Endpoint
```http
POST https://admin.devc.cloud.ogury.io/api/ogury-one/campaigns
Authorization: Bearer {access_token}
Content-Type: application/json
```

### Request Body Structure
```json
{
  "name": "string",
  "advertiser_id": "string",
  "brand_id": "string",
  "bi_manager_id": "number",
  "sales_manager_id": "number",
  "target_cost": "number",
  "ctr": "number",
  "country": "string",
  "initial_budget": "number",
  "currency": "string",
  "note": "string",
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD",
  "economic_type": "string",
  "pacing": "string",
  "over_delivery": "number",
  "timezone_offset_min": "number",
  "salesforce_id": "string",
  "user_accomplished_capping_attributes": {},
  "user_shown_capping_attributes": {},
  "objective": "string"
}
```

### Field Mappings: Campaign

| Salesforce Object | Salesforce Field | API Field | Type | Required | Default Value |
|------------------|------------------|-----------|------|----------|---------------|
| Opportunity Product | Name | `name` | string | Yes | - |
| Opportunity Product | Effective Price per Unit | `target_cost` | number | Yes | - |
| Opportunity | Team Country | `country` | string | Yes | - |
| Opportunity Product | Total Budget | `initial_budget` | number | Yes | - |
| Opportunity | Currency | `currency` | string | Yes | - |
| Opportunity | Start Date | `start_date` | string | Yes | - |
| Opportunity | End Date | `end_date` | string | Yes | - |
| Opportunity | Salesforce ID | `salesforce_id` | string | Yes | - |
| - | Economic Type | `economic_type` | string | Yes | - |
| - | BI Manager Email | `bi_manager_id` | number | Yes | *Resolved via API* |
| - | Sales Manager Email | `sales_manager_id` | number | Yes | *Resolved via API* |
| - | CTR | `ctr` | number | No | *Auto-calculated* |
| - | Notes | `note` | string | No | "" |
| - | Pacing | `pacing` | string | No | "EVEN" |
| - | Over Delivery | `over_delivery` | number | No | 0 |
| - | Objective | `objective` | string | No | "branding" |
| - | Timezone Offset | `timezone_offset_min` | number | No | 0 |
| - | User Accomplished Capping | `user_accomplished_capping_attributes` | object | No | {} |
| - | User Shown Capping | `user_shown_capping_attributes` | object | No | {} |

### Economic Type Values
- `cpm` - Cost Per Mille (CTR: 0.9)
- `cpc` - Cost Per Click (CTR: 0.01)
- `cpe` - Cost Per Engagement (CTR: 0.01)
- `cpv` - Cost Per View (CTR: 0.6)

### Currency Values
- `USD` - US Dollar
- `EUR` - Euro
- `GBP` - British Pound

### Pacing Values
- `ASAP` - As Soon As Possible
- `EVEN` - Even Distribution

### Objective Values
- `branding` - Brand Awareness
- `performance` - Performance Marketing
- `awareness` - General Awareness

## Line Item Creation

### Endpoint
```http
POST https://gateway-tyk-oss.devc.cloud.ogury.io/trafficking/api/line-items
Authorization: Bearer {access_token}
Content-Type: application/json
```

### Request Body Structure
```json
{
  "display_type": "string",
  "name": "string",
  "parent_id": "number",
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD",
  "local_budget": "number",
  "iab_category_tmp_id": "number",
  "iab_subcategory_filter": "string",
  "kind": "string",
  "family": "string",
  "in_pause": "boolean",
  "kpi": "number",
  "tracking": "string",
  "salesforce_id": "string",
  "country": "string",
  "economic_type": "string",
  "ctr": "number",
  "target_cost": "number",
  "daily_budget": "number",
  "over_delivery": "number",
  "pacing": "string",
  "priority": "number",
  "user_shown_capping_attributes": {},
  "user_accomplished_capping_attributes": {},
  "ad_unit_configs": {},
  "allow_video_opt_in": "boolean",
  "allow_external_rewarded_video": "boolean",
  "adchooser_delivery": "string",
  "is_unpaid": "boolean",
  "is_unpaid_by_advertiser": "boolean",
  "prog_only_identified_user": "boolean",
  "geo_targeting": {},
  "language_targeting": {},
  "controllist": {},
  "persona_id": "number",
  "persona_threshold": "number",
  "environment_type": "string",
  "connectivity": "string",
  "device": "string",
  "os_targeting": "string",
  "sdk_requirement": "string",
  "ios_sdk_requirement": "string",
  "android_requirement": "string",
  "prebid_filtering": "string",
  "dv_prebid_filtering": "boolean",
  "dv_strong_filtering": "boolean",
  "ias_prebid_filtering": "boolean",
  "min_viewability": "number",
  "margin": "number",
  "force_external": "boolean",
  "apply_appbundle_ssp_whitelist": "boolean",
  "ssp": "string",
  "click_command": "string",
  "advertiser_domain": "string",
  "omid_enable_tag_moat": "boolean",
  "omid_enable_tag_ias": "boolean",
  "omid_enable_tag_dv": "boolean",
  "display_trackers": "string",
  "omid_tracking": "boolean",
  "omid_compliant_inventory_only": "boolean",
  "vpaid_tracking": "boolean",
  "allow_gdpr_macro": "boolean",
  "creative_ids": ["number"]
}
```

### Field Mappings: Line Item

| Salesforce Object | Salesforce Field | API Field | Type | Required | Default Value |
|------------------|------------------|-----------|------|----------|---------------|
| Line Item | Name | `name` | string | Yes | - |
| Campaign | Campaign ID | `parent_id` | number | Yes | - |
| Line Item | Start Date | `start_date` | string | Yes | - |
| Line Item | End Date | `end_date` | string | Yes | - |
| Line Item | Budget | `local_budget` | number | Yes | - |
| Line Item | Target Cost | `target_cost` | number | Yes | - |
| Line Item | Country | `country` | string | Yes | - |
| Line Item | Salesforce ID | `salesforce_id` | string | Yes | - |
| - | Display Type | `display_type` | string | Yes | "display" |
| - | IAB Category ID | `iab_category_tmp_id` | number | No | 0 |
| - | IAB Subcategory Filter | `iab_subcategory_filter` | string | No | "" |
| - | Kind | `kind` | string | No | "standard" |
| - | Family | `family` | string | No | "standard" |
| - | In Pause | `in_pause` | boolean | No | false |
| - | KPI | `kpi` | number | No | 0.001 |
| - | Tracking | `tracking` | string | No | "none" |
| - | Economic Type | `economic_type` | string | Yes | - |
| - | CTR | `ctr` | number | No | *Auto-calculated* |
| - | Daily Budget | `daily_budget` | number | No | null |
| - | Over Delivery | `over_delivery` | number | No | 0 |
| - | Pacing | `pacing` | string | No | "ASAP" |
| - | Priority | `priority` | number | No | 1 |
| - | Environment Type | `environment_type` | string | No | "production" |
| - | Connectivity | `connectivity` | string | No | "wifi" |
| - | Device | `device` | string | No | "mobile" |
| - | OS Targeting | `os_targeting` | string | No | "all" |
| - | Margin | `margin` | number | No | 0 |
| - | SSP | `ssp` | string | No | "" |
| - | Advertiser Domain | `advertiser_domain` | string | No | "" |
| - | Display Trackers | `display_trackers` | string | No | "" |
| - | Creative IDs | `creative_ids` | array | No | [] |

### Tracking Values
- `None` - No tracking
- `Basic` - Basic tracking
- `Advanced` - Advanced tracking

### Device Values
- `mobile` - Mobile devices
- `tablet` - Tablet devices
- `desktop` - Desktop devices

### OS Targeting Values
- `all` - All operating systems
- `ios` - iOS only
- `android` - Android only
- `windows` - Windows only
- `macos` - macOS only

## Integration Flow

### 1. Authentication
```javascript
// Get access token
const authResponse = await fetch('https://gateway-tyk-oss.devc.cloud.ogury.io/oauth2/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
});
const { access_token } = await authResponse.json();
```

### 2. Resolve Manager IDs
```javascript
// Get BI Manager ID
const biManagerResponse = await fetch(`https://gateway-tyk-oss.devc.cloud.ogury.io/trafficking/api/managers/bi?email=${BI_MANAGER_EMAIL}`, {
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});
const { id: biManagerId } = await biManagerResponse.json();

// Get Sales Manager ID
const salesManagerResponse = await fetch(`https://gateway-tyk-oss.devc.cloud.ogury.io/trafficking/api/managers/sales_manager?email=${SALES_MANAGER_EMAIL}`, {
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});
const { id: salesManagerId } = await salesManagerResponse.json();
```

### 3. Create Campaign
```javascript
const campaignData = {
  name: opportunityProduct.Name,
  advertiser_id: "001N200000FvqviIAB", // Static value
  brand_id: "001N200000CJp5FIAT", // Static value
  bi_manager_id: biManagerId,
  sales_manager_id: salesManagerId,
  target_cost: opportunityProduct.Effective_Price_per_Unit__c,
  ctr: getCTRByEconomicType(economicType), // Auto-calculated
  country: opportunity.Team_Country__c,
  initial_budget: opportunityProduct.Total_Budget__c,
  currency: opportunity.CurrencyIsoCode,
  note: "",
  start_date: opportunity.CloseDate,
  end_date: opportunity.End_Date__c,
  economic_type: economicType,
  pacing: "EVEN",
  over_delivery: 0,
  timezone_offset_min: 0,
  salesforce_id: opportunity.Id,
  user_accomplished_capping_attributes: {},
  user_shown_capping_attributes: {},
  objective: "branding"
};

const campaignResponse = await fetch('https://admin.devc.cloud.ogury.io/api/ogury-one/campaigns', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(campaignData)
});
const campaign = await campaignResponse.json();
```

### 4. Create Line Item
```javascript
const lineItemData = {
  display_type: "display",
  name: lineItem.Name,
  parent_id: campaign.id, // From campaign creation response
  start_date: lineItem.Start_Date__c,
  end_date: lineItem.End_Date__c,
  local_budget: lineItem.Budget__c,
  target_cost: lineItem.Target_Cost__c,
  country: lineItem.Country__c,
  salesforce_id: lineItem.Id,
  economic_type: economicType,
  ctr: getCTRByEconomicType(economicType), // Auto-calculated
  // ... other fields with default values
};

const lineItemResponse = await fetch('https://gateway-tyk-oss.devc.cloud.ogury.io/trafficking/api/line-items', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(lineItemData)
});
const lineItem = await lineItemResponse.json();
```

## Error Handling

### Common HTTP Status Codes
- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

### Error Response Format
```json
{
  "error": "Error message",
  "status": 400,
  "statusText": "Bad Request",
  "data": {
    "field": "validation error details"
  }
}
```

## Rate Limiting
- Authentication: No specific limits documented
- API calls: Standard rate limiting applies
- Recommended: Implement exponential backoff for retries

## Security Considerations
- Store client credentials securely
- Implement token refresh logic
- Use HTTPS for all API calls
- Validate all input data before sending to API
- Log API calls for debugging (without sensitive data)

## Testing
Use the provided test application to validate API calls before implementing in Salesforce:
- Standard Edition: Full field visibility for testing
- Salesforce Edition: Simplified interface matching Salesforce field names

## Support
For technical support or questions about the API:
- Contact: Ogury Technical Support
- Documentation: This specification
- Test Environment: Available for integration testing
