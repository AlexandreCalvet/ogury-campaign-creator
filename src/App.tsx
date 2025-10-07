import { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import SalesforceApp from './SalesforceApp';

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
  user_shown_capping_attributes: Record<string, any>;
  user_accomplished_capping_attributes: Record<string, any>;
  ad_unit_configs: Record<string, any>;
  allow_video_opt_in: boolean;
  allow_external_rewarded_video: boolean;
  adchooser_delivery: string;
  is_unpaid: boolean;
  is_unpaid_by_advertiser: boolean;
  prog_only_identified_user: boolean;
  geo_targeting: Record<string, any>;
  language_targeting: Record<string, any>;
  controllist: Record<string, any>;
  persona_id: number | null;
  persona_threshold: number;
  environment_type: string;
  connectivity: string;
  device: string;
  os_targeting: string;
  sdk_requirement: string | null;
  ios_sdk_requirement: string | null;
  android_requirement: string | null;
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

function OriginalApp() {
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
    local_budget: 111,
    iab_category_tmp_id: 666,
    iab_subcategory_filter: "G",
    kind: "Branding",
    family: "ad",
    in_pause: true,
    kpi: 0,
    tracking: "None",
    salesforce_id: "00k12346789ABCDFGH",
    country: "NOT",
    economic_type: "cpc",
    ctr: 0.001,
    target_cost: 1,
    daily_budget: null,
    over_delivery: 6,
    pacing: "ASAP",
    priority: 3,
    user_shown_capping_attributes: { total: 3 },
    user_accomplished_capping_attributes: { total: 1 },
    ad_unit_configs: {
      interstitial: { is_enabled: true, payback_cpm: 9, margin: 85 },
      optin_video: { is_enabled: true, payback_cpm: 9, margin: 76 },
      overlay_thumbnail: { is_enabled: true, payback_cpm: 9, margin: 80 },
      header_ad: { is_enabled: true, payback_cpm: 9, margin: 80 },
      footer_ad: { is_enabled: true, payback_cpm: 9, margin: 65 },
      banner_320x50: { is_enabled: true, payback_cpm: 9, margin: 80 },
      in_article: { is_enabled: true, payback_cpm: 9, margin: 76 },
      medium_rectangle: { is_enabled: true, payback_cpm: 9, margin: 80 },
      standard_banners: { is_enabled: true, payback_cpm: 2, margin: 70 }
    },
    allow_video_opt_in: true,
    allow_external_rewarded_video: false,
    adchooser_delivery: "yes",
    is_unpaid: false,
    is_unpaid_by_advertiser: false,
    prog_only_identified_user: false,
    geo_targeting: { allow: [], deny: [] },
    language_targeting: { allow: [], deny: [] },
    controllist: { allow: [], deny: [] },
    persona_id: null,
    persona_threshold: 0,
    environment_type: "in-app,web",
    connectivity: "ALL",
    device: "mobile,tablet",
    os_targeting: "Android,IOS",
    sdk_requirement: null,
    ios_sdk_requirement: null,
    android_requirement: null,
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
    
    try {
      const body = jsonFormat === 'pretty' ? JSON.stringify(campaignData, null, 2) : JSON.stringify(campaignData);
      setRequestBody(body);
      
      const response = await axios.post(
        '/api/ogury-one/campaigns',
        campaignData,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          }
        }
      );

      setResponse(response.data);
    } catch (error: any) {
      console.error('Campaign creation error:', error);
      setResponse({
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof CampaignData, value: any) => {
    setCampaignData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLineItemInputChange = (field: keyof LineItemData, value: any) => {
    setLineItemData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const createLineItem = async () => {
    if (!authToken) {
      setAuthStatus('Please authenticate first');
      return;
    }

    setIsLoading(true);
    
    try {
      const body = jsonFormat === 'pretty' ? JSON.stringify(lineItemData, null, 2) : JSON.stringify(lineItemData);
      setRequestBody(body);
      
      const response = await axios.post(
        '/trafficking/api/line-items',
        lineItemData,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          }
        }
      );

      setResponse(response.data);
    } catch (error: any) {
      console.error('Line item creation error:', error);
      setResponse({
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Ogury Campaign Creator</h1>
      
      {/* Authentication Section */}
      <div className="auth-section">
        <h2>Authentication</h2>
        
        {!isAuthenticated && (
          <div className="auth-form">
            <div className="form-row">
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
          </div>
        )}
        
        <div className="auth-buttons">
          <button 
            onClick={authenticate} 
            disabled={isLoading || isAuthenticated}
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
              style={{ marginLeft: '10px', backgroundColor: '#dc3545' }}
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

      {/* Tabs */}
      {isAuthenticated && (
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'campaign' ? 'active' : ''}`}
            onClick={() => setActiveTab('campaign')}
          >
            Campaign
          </button>
          <button 
            className={`tab ${activeTab === 'lineitem' ? 'active' : ''}`}
            onClick={() => setActiveTab('lineitem')}
          >
            Line Item
          </button>
        </div>
      )}

      {/* Campaign Form Section */}
      {isAuthenticated && activeTab === 'campaign' && (
        <div className="form-section">
          <h2>Create Campaign</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>Campaign Name</label>
              <input
                type="text"
                value={campaignData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Advertiser ID</label>
              <input
                type="text"
                value={campaignData.advertiser_id}
                onChange={(e) => handleInputChange('advertiser_id', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Brand ID</label>
              <input
                type="text"
                value={campaignData.brand_id}
                onChange={(e) => handleInputChange('brand_id', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Salesforce ID</label>
              <input
                type="text"
                value={campaignData.salesforce_id}
                onChange={(e) => handleInputChange('salesforce_id', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>BI Manager ID</label>
              <input
                type="number"
                value={campaignData.bi_manager_id}
                onChange={(e) => handleInputChange('bi_manager_id', parseInt(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Sales Manager ID</label>
              <input
                type="number"
                value={campaignData.sales_manager_id}
                onChange={(e) => handleInputChange('sales_manager_id', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Target Cost</label>
              <input
                type="number"
                step="0.01"
                value={campaignData.target_cost}
                onChange={(e) => handleInputChange('target_cost', parseFloat(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>CTR</label>
              <input
                type="number"
                step="0.001"
                value={campaignData.ctr}
                onChange={(e) => handleInputChange('ctr', parseFloat(e.target.value))}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                value={campaignData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Currency</label>
              <select
                value={campaignData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Initial Budget</label>
              <input
                type="number"
                value={campaignData.initial_budget}
                onChange={(e) => handleInputChange('initial_budget', parseFloat(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Economic Type</label>
              <select
                value={campaignData.economic_type}
                onChange={(e) => handleInputChange('economic_type', e.target.value)}
              >
                <option value="cpc">CPC</option>
                <option value="cpm">CPM</option>
                <option value="cpa">CPA</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={campaignData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={campaignData.end_date}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Pacing</label>
              <select
                value={campaignData.pacing}
                onChange={(e) => handleInputChange('pacing', e.target.value)}
              >
                <option value="ASAP">ASAP</option>
                <option value="EVEN">EVEN</option>
              </select>
            </div>
            <div className="form-group">
              <label>Objective</label>
              <select
                value={campaignData.objective}
                onChange={(e) => handleInputChange('objective', e.target.value)}
              >
                <option value="branding">Branding</option>
                <option value="performance">Performance</option>
                <option value="awareness">Awareness</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={campaignData.note}
              onChange={(e) => handleInputChange('note', e.target.value)}
            />
          </div>

          <button 
            onClick={createCampaign} 
            disabled={isLoading}
            style={{ marginTop: '20px', width: '100%' }}
          >
            {isLoading ? 'Creating Campaign...' : 'Create Campaign'}
          </button>
        </div>
      )}

      {/* Line Item Form Section */}
      {isAuthenticated && activeTab === 'lineitem' && (
        <div className="form-section">
          <h2>Create Line Item</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>Line Item Name</label>
              <input
                type="text"
                value={lineItemData.name}
                onChange={(e) => handleLineItemInputChange('name', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Parent ID</label>
              <input
                type="number"
                value={lineItemData.parent_id}
                onChange={(e) => handleLineItemInputChange('parent_id', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Display Type</label>
              <select
                value={lineItemData.display_type}
                onChange={(e) => handleLineItemInputChange('display_type', e.target.value)}
              >
                <option value="display">Display</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div className="form-group">
              <label>Kind</label>
              <select
                value={lineItemData.kind}
                onChange={(e) => handleLineItemInputChange('kind', e.target.value)}
              >
                <option value="Branding">Branding</option>
                <option value="Performance">Performance</option>
                <option value="Awareness">Awareness</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={lineItemData.start_date}
                onChange={(e) => handleLineItemInputChange('start_date', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={lineItemData.end_date}
                onChange={(e) => handleLineItemInputChange('end_date', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Local Budget</label>
              <input
                type="number"
                value={lineItemData.local_budget}
                onChange={(e) => handleLineItemInputChange('local_budget', parseFloat(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Target Cost</label>
              <input
                type="number"
                step="0.01"
                value={lineItemData.target_cost}
                onChange={(e) => handleLineItemInputChange('target_cost', parseFloat(e.target.value))}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>CTR</label>
              <input
                type="number"
                step="0.001"
                value={lineItemData.ctr}
                onChange={(e) => handleLineItemInputChange('ctr', parseFloat(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Over Delivery</label>
              <input
                type="number"
                value={lineItemData.over_delivery}
                onChange={(e) => handleLineItemInputChange('over_delivery', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                value={lineItemData.country}
                onChange={(e) => handleLineItemInputChange('country', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Economic Type</label>
              <select
                value={lineItemData.economic_type}
                onChange={(e) => handleLineItemInputChange('economic_type', e.target.value)}
              >
                <option value="cpc">CPC</option>
                <option value="cpm">CPM</option>
                <option value="cpa">CPA</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Pacing</label>
              <select
                value={lineItemData.pacing}
                onChange={(e) => handleLineItemInputChange('pacing', e.target.value)}
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
                onChange={(e) => handleLineItemInputChange('priority', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Salesforce ID</label>
              <input
                type="text"
                value={lineItemData.salesforce_id}
                onChange={(e) => handleLineItemInputChange('salesforce_id', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>IAB Category ID</label>
              <input
                type="number"
                value={lineItemData.iab_category_tmp_id}
                onChange={(e) => handleLineItemInputChange('iab_category_tmp_id', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>IAB Subcategory Filter</label>
              <input
                type="text"
                value={lineItemData.iab_subcategory_filter}
                onChange={(e) => handleLineItemInputChange('iab_subcategory_filter', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Tracking</label>
              <select
                value={lineItemData.tracking}
                onChange={(e) => handleLineItemInputChange('tracking', e.target.value)}
              >
                <option value="None">None</option>
                <option value="Basic">Basic</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Environment Type</label>
              <input
                type="text"
                value={lineItemData.environment_type}
                onChange={(e) => handleLineItemInputChange('environment_type', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Device</label>
              <input
                type="text"
                value={lineItemData.device}
                onChange={(e) => handleLineItemInputChange('device', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>OS Targeting</label>
              <input
                type="text"
                value={lineItemData.os_targeting}
                onChange={(e) => handleLineItemInputChange('os_targeting', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>SSP</label>
              <input
                type="text"
                value={lineItemData.ssp}
                onChange={(e) => handleLineItemInputChange('ssp', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Margin</label>
              <input
                type="number"
                value={lineItemData.margin}
                onChange={(e) => handleLineItemInputChange('margin', parseInt(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Creative IDs (comma-separated)</label>
              <input
                type="text"
                value={lineItemData.creative_ids.join(',')}
                onChange={(e) => handleLineItemInputChange('creative_ids', e.target.value.split(',').map(id => parseInt(id.trim())))}
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={lineItemData.in_pause}
                onChange={(e) => handleLineItemInputChange('in_pause', e.target.checked)}
              />
              In Pause
            </label>
          </div>

          <button 
            onClick={createLineItem} 
            disabled={isLoading}
            style={{ marginTop: '20px', width: '100%' }}
          >
            {isLoading ? 'Creating Line Item...' : 'Create Line Item'}
          </button>
        </div>
      )}

      {/* JSON Format Selector */}
      <div className="json-format-selector">
        <label>JSON Format: </label>
        <select
          value={jsonFormat}
          onChange={(e) => setJsonFormat(e.target.value as 'pretty' | 'raw')}
        >
          <option value="pretty">Pretty (Human Readable)</option>
          <option value="raw">Raw (Minified)</option>
        </select>
      </div>

      {/* Response Section */}
      {response && (
        <div className="response-section">
          <h3>Server Response</h3>
          <pre>{jsonFormat === 'pretty' ? JSON.stringify(response, null, 2) : JSON.stringify(response)}</pre>
        </div>
      )}

      {/* Request Body Section */}
      {requestBody && (
        <div className="response-section">
          <h3>Request Body Sent</h3>
          <pre>{requestBody}</pre>
        </div>
      )}
    </div>
  );
}

// Navigation Component
function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="main-navigation">
      <div className="nav-container">
        <h1>Ogury Campaign Creator</h1>
        <div className="nav-links">
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            Standard Edition
          </Link>
          <Link 
            to="/salesforce" 
            className={location.pathname === '/salesforce' ? 'nav-link active' : 'nav-link'}
          >
            Salesforce Edition
          </Link>
        </div>
      </div>
    </nav>
  );
}

// Main App Component with Routing
function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navigation />
        <Routes>
          <Route path="/" element={<OriginalApp />} />
          <Route path="/salesforce" element={<SalesforceApp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 