import { useState } from 'react';
import axios from 'axios';

interface CampaignData {
  name: string;
  advertiser_id: string;
  brand_id: string;
  bi_manager_id: number;
  sales_manager_id: number;
  target_cost: number;
  ctr: number;
  country: string;
  initial_budget: number;
  currency: string;
  note: string;
  start_date: string;
  end_date: string;
  economic_type: string;
  pacing: string;
  over_delivery: number;
  timezone_offset_min: number;
  salesforce_id: string;
  user_accomplished_capping_attributes: Record<string, any>;
  user_shown_capping_attributes: Record<string, any>;
  objective: string;
}

interface LineItemData {
  display_type: string;
  name: string;
  parent_id: number;
  start_date: string;
  end_date: string;
  local_budget: number;
  iab_category_tmp_id: number;
  iab_subcategory_filter: string;
  kind: string;
  family: string;
  in_pause: boolean;
  kpi: number;
  tracking: string;
  salesforce_id: string;
  country: string;
  economic_type: string;
  ctr: number;
  target_cost: number;
  daily_budget: number | null;
  over_delivery: number;
  pacing: string;
  priority: number;
  environment_type: string;
  device: string;
  os_targeting: string;
  prebid_filtering: string;
  dv_prebid_filtering: boolean;
  dv_strong_filtering: boolean;
  ias_prebid_filtering: boolean;
  min_viewability: number | null;
  margin: number;
  force_external: boolean;
  apply_appbundle_ssp_whitelist: boolean;
  ssp: string;
  click_command: string;
  advertiser_domain: string;
  omid_enable_tag_moat: boolean;
  omid_enable_tag_ias: boolean;
  omid_enable_tag_dv: boolean;
  display_trackers: string;
  omid_tracking: boolean;
  omid_compliant_inventory_only: boolean;
  vpaid_tracking: boolean;
  allow_gdpr_macro: boolean;
  creative_ids: number[];
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

function SalesforceApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState<string>('');
  const [authStatus, setAuthStatus] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'campaign' | 'lineitem'>('campaign');
  const [clientId, setClientId] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');
  
  const [campaignData, setCampaignData] = useState<CampaignData>({
    name: "Test campaign SF",
    advertiser_id: "001N200000FvqviIAB",
    brand_id: "001N200000CJp5FIAT",
    bi_manager_id: 2593,
    sales_manager_id: 2881,
    target_cost: 1,
    ctr: 0.001,
    country: "FRA",
    initial_budget: 111,
    currency: "USD",
    note: "Impressions__Impressions_end\nCTR__CTR_END\nVTR__VCR_END\nreal_budget__budget_end\nreal_accomplished__accomplished_end\n3P_discrep_imp__3P_discrep_imp_end\n3P_discrep_acc__3P_discrep_acc_end\nCreative_rendering__Creative_rendering_end",
    start_date: "2025-07-11",
    end_date: "2025-07-31",
    economic_type: "cpc",
    pacing: "ASAP",
    over_delivery: 0,
    timezone_offset_min: 0,
    salesforce_id: "00612346789ABCDFGH",
    user_accomplished_capping_attributes: {},
    user_shown_capping_attributes: {
      total: 3
    },
    objective: "branding"
  });

  const [lineItemData, setLineItemData] = useState<LineItemData>({
    display_type: "display",
    name: "",
    parent_id: 0,
    start_date: "2025-07-11",
    end_date: "2025-07-31",
    local_budget: 100,
    iab_category_tmp_id: 1,
    iab_subcategory_filter: "1,2,3",
    kind: "display",
    family: "display",
    in_pause: false,
    kpi: 0.001,
    tracking: "none",
    salesforce_id: "00612346789ABCDFGH",
    country: "FRA",
    economic_type: "cpc",
    ctr: 0.001,
    target_cost: 1,
    daily_budget: null,
    over_delivery: 0,
    pacing: "ASAP",
    priority: 1,
    environment_type: "web",
    device: "desktop",
    os_targeting: "all",
    prebid_filtering: "IAS",
    dv_prebid_filtering: false,
    dv_strong_filtering: false,
    ias_prebid_filtering: true,
    min_viewability: null,
    margin: 70,
    force_external: false,
    apply_appbundle_ssp_whitelist: false,
    ssp: "OGURY",
    click_command: "no_redirect",
    advertiser_domain: "not_a_website",
    omid_enable_tag_moat: false,
    omid_enable_tag_ias: false,
    omid_enable_tag_dv: false,
    display_trackers: "<IMG SRC=\"\" BORDER=0 WIDTH=1 HEIGHT=1 ALT=\"Advertisement\"/>",
    omid_tracking: true,
    omid_compliant_inventory_only: false,
    vpaid_tracking: true,
    allow_gdpr_macro: false,
    creative_ids: [24340]
  });

  const [response, setResponse] = useState<any>(null);
  const [requestBody, setRequestBody] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [jsonFormat, setJsonFormat] = useState<'pretty' | 'raw'>('pretty');

  const authenticate = async () => {
    if (!clientId || !clientSecret) {
      setAuthStatus('Please enter both Client ID and Client Secret');
      return;
    }

    setIsLoading(true);
    setAuthStatus('Authenticating...');
    
    try {
      const response = await axios.post(
        '/oauth/token',
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          auth: {
            username: clientId,
            password: clientSecret
          }
        }
      );

      const authData: AuthResponse = response.data;
      setAuthToken(authData.access_token);
      setIsAuthenticated(true);
      setAuthStatus('Authentication successful!');
    } catch (error: any) {
      console.error('Authentication error:', error);
      setAuthStatus(`Authentication failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const createCampaign = async () => {
    if (!authToken) {
      setAuthStatus('Please authenticate first');
      return;
    }

    setIsLoading(true);
    setAuthStatus('Creating campaign...');
    
    try {
      const response = await axios.post(
        '/api/ogury-one/campaigns',
        campaignData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          }
        }
      );

      setResponse(response.data);
      setRequestBody(JSON.stringify(campaignData, null, 2));
      setAuthStatus('Campaign created successfully!');
    } catch (error: any) {
      console.error('Campaign creation error:', error);
      setAuthStatus(`Campaign creation failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const createLineItem = async () => {
    if (!authToken) {
      setAuthStatus('Please authenticate first');
      return;
    }

    setIsLoading(true);
    setAuthStatus('Creating line item...');
    
    try {
      const response = await axios.post(
        '/trafficking/api/line-items',
        lineItemData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          }
        }
      );

      setResponse(response.data);
      setRequestBody(JSON.stringify(lineItemData, null, 2));
      setAuthStatus('Line item created successfully!');
    } catch (error: any) {
      console.error('Line item creation error:', error);
      setAuthStatus(`Line item creation failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Ogury Campaign Creator - Salesforce Edition</h1>
        <p>Create campaigns and line items through the Ogury Campaign Manager API</p>
      </header>

      {/* Authentication Section */}
      <div className="auth-section">
        <h2>Authentication</h2>
        
        {!isAuthenticated && (
          <div className="auth-form">
            <div className="form-group">
              <label>Client ID</label>
              <input
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Enter your Client ID"
              />
            </div>
            <div className="form-group">
              <label>Client Secret</label>
              <input
                type="password"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                placeholder="Enter your Client Secret"
              />
            </div>
          </div>
        )}
        
        <div className="auth-buttons">
          <button
            onClick={authenticate} 
            disabled={isLoading || isAuthenticated}
            className="auth-button"
          >
            {isAuthenticated ? 'Authenticated' : 'Authenticate with OAuth2'}
          </button>
          {isAuthenticated && (
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setAuthToken('');
                setAuthStatus('');
              }}
              className="reset-button"
            >
              Reset Authentication
            </button>
          )}
        </div>
        
        {authStatus && (
          <div className={`status ${isAuthenticated ? 'success' : 'info'}`}>
            {authStatus}
          </div>
        )}
      </div>

      {isAuthenticated && (
        <div className="main-content">
          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button
              className={`tab-button ${activeTab === 'campaign' ? 'active' : ''}`}
              onClick={() => setActiveTab('campaign')}
            >
              Campaign
            </button>
            <button
              className={`tab-button ${activeTab === 'lineitem' ? 'active' : ''}`}
              onClick={() => setActiveTab('lineitem')}
            >
              Line Item
            </button>
          </div>

          {/* Campaign Form */}
          {isAuthenticated && activeTab === 'campaign' && (
            <div className="form-section">
              <h2>Create Campaign</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Campaign Name</label>
                  <input
                    type="text"
                    value={campaignData.name}
                    onChange={(e) => setCampaignData({...campaignData, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Advertiser ID</label>
                  <input
                    type="text"
                    value={campaignData.advertiser_id}
                    onChange={(e) => setCampaignData({...campaignData, advertiser_id: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Brand ID</label>
                  <input
                    type="text"
                    value={campaignData.brand_id}
                    onChange={(e) => setCampaignData({...campaignData, brand_id: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>BI Manager ID</label>
                  <input
                    type="number"
                    value={campaignData.bi_manager_id}
                    onChange={(e) => setCampaignData({...campaignData, bi_manager_id: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Sales Manager ID</label>
                  <input
                    type="number"
                    value={campaignData.sales_manager_id}
                    onChange={(e) => setCampaignData({...campaignData, sales_manager_id: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Target Cost</label>
                  <input
                    type="number"
                    step="0.001"
                    value={campaignData.target_cost}
                    onChange={(e) => setCampaignData({...campaignData, target_cost: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>CTR</label>
                  <input
                    type="number"
                    step="0.001"
                    value={campaignData.ctr}
                    onChange={(e) => setCampaignData({...campaignData, ctr: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    value={campaignData.country}
                    onChange={(e) => setCampaignData({...campaignData, country: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Initial Budget</label>
                  <input
                    type="number"
                    value={campaignData.initial_budget}
                    onChange={(e) => setCampaignData({...campaignData, initial_budget: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Currency</label>
                  <input
                    type="text"
                    value={campaignData.currency}
                    onChange={(e) => setCampaignData({...campaignData, currency: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={campaignData.start_date}
                    onChange={(e) => setCampaignData({...campaignData, start_date: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={campaignData.end_date}
                    onChange={(e) => setCampaignData({...campaignData, end_date: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Economic Type</label>
                  <select
                    value={campaignData.economic_type}
                    onChange={(e) => setCampaignData({...campaignData, economic_type: e.target.value})}
                  >
                    <option value="cpc">CPC</option>
                    <option value="cpm">CPM</option>
                    <option value="cpa">CPA</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Pacing</label>
                  <select
                    value={campaignData.pacing}
                    onChange={(e) => setCampaignData({...campaignData, pacing: e.target.value})}
                  >
                    <option value="ASAP">ASAP</option>
                    <option value="EVEN">EVEN</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Over Delivery</label>
                  <input
                    type="number"
                    value={campaignData.over_delivery}
                    onChange={(e) => setCampaignData({...campaignData, over_delivery: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Salesforce ID</label>
                  <input
                    type="text"
                    value={campaignData.salesforce_id}
                    onChange={(e) => setCampaignData({...campaignData, salesforce_id: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Objective</label>
                  <select
                    value={campaignData.objective}
                    onChange={(e) => setCampaignData({...campaignData, objective: e.target.value})}
                  >
                    <option value="branding">Branding</option>
                    <option value="performance">Performance</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Notes</label>
                  <textarea
                    value={campaignData.note}
                    onChange={(e) => setCampaignData({...campaignData, note: e.target.value})}
                    rows={4}
                  />
                </div>
              </div>
              
              <button
                onClick={createCampaign}
                disabled={isLoading}
                className="create-button"
              >
                {isLoading ? 'Creating...' : 'Create Campaign'}
              </button>
            </div>
          )}

          {/* Line Item Form */}
          {isAuthenticated && activeTab === 'lineitem' && (
            <div className="form-section">
              <h2>Create Line Item</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Line Item Name</label>
                  <input
                    type="text"
                    value={lineItemData.name}
                    onChange={(e) => setLineItemData({...lineItemData, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Parent ID</label>
                  <input
                    type="number"
                    value={lineItemData.parent_id}
                    onChange={(e) => setLineItemData({...lineItemData, parent_id: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Display Type</label>
                  <select
                    value={lineItemData.display_type}
                    onChange={(e) => setLineItemData({...lineItemData, display_type: e.target.value})}
                  >
                    <option value="display">Display</option>
                    <option value="video">Video</option>
                    <option value="native">Native</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Kind</label>
                  <select
                    value={lineItemData.kind}
                    onChange={(e) => setLineItemData({...lineItemData, kind: e.target.value})}
                  >
                    <option value="display">Display</option>
                    <option value="video">Video</option>
                    <option value="native">Native</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Family</label>
                  <select
                    value={lineItemData.family}
                    onChange={(e) => setLineItemData({...lineItemData, family: e.target.value})}
                  >
                    <option value="display">Display</option>
                    <option value="video">Video</option>
                    <option value="native">Native</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={lineItemData.start_date}
                    onChange={(e) => setLineItemData({...lineItemData, start_date: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={lineItemData.end_date}
                    onChange={(e) => setLineItemData({...lineItemData, end_date: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Local Budget</label>
                  <input
                    type="number"
                    value={lineItemData.local_budget}
                    onChange={(e) => setLineItemData({...lineItemData, local_budget: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Target Cost</label>
                  <input
                    type="number"
                    step="0.001"
                    value={lineItemData.target_cost}
                    onChange={(e) => setLineItemData({...lineItemData, target_cost: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>CTR</label>
                  <input
                    type="number"
                    step="0.001"
                    value={lineItemData.ctr}
                    onChange={(e) => setLineItemData({...lineItemData, ctr: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    value={lineItemData.country}
                    onChange={(e) => setLineItemData({...lineItemData, country: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Economic Type</label>
                  <select
                    value={lineItemData.economic_type}
                    onChange={(e) => setLineItemData({...lineItemData, economic_type: e.target.value})}
                  >
                    <option value="cpc">CPC</option>
                    <option value="cpm">CPM</option>
                    <option value="cpa">CPA</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Pacing</label>
                  <select
                    value={lineItemData.pacing}
                    onChange={(e) => setLineItemData({...lineItemData, pacing: e.target.value})}
                  >
                    <option value="ASAP">ASAP</option>
                    <option value="EVEN">EVEN</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <input
                    type="number"
                    value={lineItemData.priority}
                    onChange={(e) => setLineItemData({...lineItemData, priority: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Salesforce ID</label>
                  <input
                    type="text"
                    value={lineItemData.salesforce_id}
                    onChange={(e) => setLineItemData({...lineItemData, salesforce_id: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>IAB Category ID</label>
                  <input
                    type="number"
                    value={lineItemData.iab_category_tmp_id}
                    onChange={(e) => setLineItemData({...lineItemData, iab_category_tmp_id: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>IAB Subcategory Filter</label>
                  <input
                    type="text"
                    value={lineItemData.iab_subcategory_filter}
                    onChange={(e) => setLineItemData({...lineItemData, iab_subcategory_filter: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Tracking</label>
                  <select
                    value={lineItemData.tracking}
                    onChange={(e) => setLineItemData({...lineItemData, tracking: e.target.value})}
                  >
                    <option value="none">None</option>
                    <option value="click">Click</option>
                    <option value="view">View</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Environment Type</label>
                  <select
                    value={lineItemData.environment_type}
                    onChange={(e) => setLineItemData({...lineItemData, environment_type: e.target.value})}
                  >
                    <option value="web">Web</option>
                    <option value="mobile">Mobile</option>
                    <option value="app">App</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Device</label>
                  <select
                    value={lineItemData.device}
                    onChange={(e) => setLineItemData({...lineItemData, device: e.target.value})}
                  >
                    <option value="desktop">Desktop</option>
                    <option value="mobile">Mobile</option>
                    <option value="tablet">Tablet</option>
                    <option value="all">All</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>OS Targeting</label>
                  <select
                    value={lineItemData.os_targeting}
                    onChange={(e) => setLineItemData({...lineItemData, os_targeting: e.target.value})}
                  >
                    <option value="all">All</option>
                    <option value="ios">iOS</option>
                    <option value="android">Android</option>
                    <option value="windows">Windows</option>
                    <option value="macos">macOS</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>SSP</label>
                  <input
                    type="text"
                    value={lineItemData.ssp}
                    onChange={(e) => setLineItemData({...lineItemData, ssp: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Margin</label>
                  <input
                    type="number"
                    value={lineItemData.margin}
                    onChange={(e) => setLineItemData({...lineItemData, margin: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Advertiser Domain</label>
                  <input
                    type="text"
                    value={lineItemData.advertiser_domain}
                    onChange={(e) => setLineItemData({...lineItemData, advertiser_domain: e.target.value})}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Display Trackers</label>
                  <textarea
                    value={lineItemData.display_trackers}
                    onChange={(e) => setLineItemData({...lineItemData, display_trackers: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>
              
              <button
                onClick={createLineItem}
                disabled={isLoading}
                className="create-button"
              >
                {isLoading ? 'Creating...' : 'Create Line Item'}
              </button>
            </div>
          )}

          {/* Debug Information */}
          {(requestBody || response) && (
            <div className="debug-section">
              <h3>Debug Information</h3>
              
              <div className="debug-controls">
                <button
                  onClick={() => setJsonFormat(jsonFormat === 'pretty' ? 'raw' : 'pretty')}
                  className="format-button"
                >
                  {jsonFormat === 'pretty' ? 'Raw JSON' : 'Pretty JSON'}
                </button>
              </div>
              
              {requestBody && (
                <div className="debug-item">
                  <h4>Request Body</h4>
                  <pre className="json-display">
                    {jsonFormat === 'pretty' ? requestBody : JSON.stringify(JSON.parse(requestBody))}
                  </pre>
                </div>
              )}
              
              {response && (
                <div className="debug-item">
                  <h4>Response</h4>
                  <pre className="json-display">
                    {jsonFormat === 'pretty' ? JSON.stringify(response, null, 2) : JSON.stringify(response)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SalesforceApp;
