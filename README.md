# Ogury Campaign Creator

A React TypeScript application for creating campaigns and line items through the Ogury Campaign Manager API.

## Features

- OAuth2 authentication with the Ogury API
- Tabbed interface for Campaign and Line Item creation
- Form-based creation with all required fields pre-filled
- Real-time API communication
- Debug information showing request body and server response
- Modern, responsive UI

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Authentication**: Click the "Authenticate with OAuth2" button to get an access token
2. **Tab Selection**: Choose between "Campaign" and "Line Item" tabs
3. **Form Filling**: Forms come pre-filled with example data from your specification
4. **Creation**: Modify the form fields as needed and click "Create Campaign" or "Create Line Item"
5. **Debug Information**: View the request body sent and server response in the debug sections

## API Endpoints

- **Authentication**: `https://gateway-tyk-oss.devc.cloud.ogury.io/oauth2/token`
- **Campaign Creation**: `https://admin.devc.cloud.ogury.io/api/ogury-one/campaigns`
- **Line Item Creation**: `https://gateway-tyk-oss.devc.cloud.ogury.io/trafficking/api/line-items`

## Form Fields

### Campaign Form
The application includes all fields from your example campaign data:

- Campaign Name
- Advertiser ID
- Brand ID
- BI Manager ID
- Sales Manager ID
- Target Cost
- CTR
- Country
- Initial Budget
- Currency
- Start/End Dates
- Economic Type
- Pacing
- Salesforce ID
- Objective
- Notes

### Line Item Form
The line item form includes all fields from your example line item data:

- Line Item Name
- Parent ID
- Display Type
- Kind
- Start/End Dates
- Local Budget
- Target Cost
- CTR
- Over Delivery
- Country
- Economic Type
- Pacing
- Priority
- Salesforce ID
- IAB Category ID
- IAB Subcategory Filter
- Tracking
- Environment Type
- Device
- OS Targeting
- SSP
- Margin
- Creative IDs
- In Pause status
- And many more configuration options

## Technical Details

- Built with React 18 and TypeScript
- Uses Vite for fast development and building
- Axios for HTTP requests
- Modern CSS with responsive design
- OAuth2 client credentials flow
- HTTPS certificate validation disabled for development

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build 