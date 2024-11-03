const axios = require('axios');
const cron = require('node-cron');
const { ConsentRequest, ApiResponse, AuthToken } = require('../models');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

// Function to get the current auth token
async function getAuthToken() {
  const authToken = await AuthToken.findOne({ where: { id: 1 } });
  if (!authToken || new Date() > authToken.expires_at) {
    throw new Error('Auth token is missing or expired');
  }
  return `Bearer ${authToken.token}`;
}

exports.requestConsent = async (req, res) => {
  try {
    const { userId } = req.params;
    const requestData = {
      redirect_params: {
        callback_url: "https://b_ixfq1of9uum.v0.build/"
      },
      consents: [
        {
          consent_start: new Date().toISOString(),
          consent_expiry: "2026-12-31T00:00:00.000Z",
          consent_mode: "STORE",
          fetch_type: "PERIODIC",
          consent_types: ["PROFILE", "SUMMARY"],
          fi_types: ["DEPOSIT", "RECURRING_DEPOSIT", "TERM_DEPOSIT"],
          customer: {
            identifiers: [
              {
                type: "MOBILE",
                value: req.body.mobileNumber
              }
            ]
          },
          purpose: {
            code: "101",
            text: "Monitoring Account profiles for incompleteness"
          },
          fi_data_range: {
            from: "2023-01-01T00:00:00.000Z",
            to: "2025-12-31T00:00:00.000Z"
          },
          data_life: {
            unit: "MONTH",
            value: 10
          },
          frequency: {
            unit: "MONTH",
            value: 31
          }
        }
      ]
    };

    const authHeader = await getAuthToken();

    const response = await axios.post(`${API_BASE_URL}/v2/consents/request`, requestData, {
      headers: {
        'fiu_entity_id': 'Ice-FIU',
        'aa_entity_id': 'saafe-sandbox',
        'Content-Type': 'application/json',
        'Authorization': authHeader
      }
    });

    const { redirect_url, handle } = response.data;

    // Store the consent request in the database
    const consentRequest = await ConsentRequest.create({
      UserId: userId,
      handle,
      redirect_url,
    });

    // Store the API response
    await ApiResponse.create({
      UserId: userId,
      endpoint: '/v2/consents/request',
      request_data: JSON.stringify(requestData),
      response_data: JSON.stringify(response.data)
    });

    res.status(200).json({ redirect_url, handle });
  } catch (error) {
    console.error('Error requesting consent:', error);
    res.status(500).json({ message: 'Error requesting consent', error: error.message });
  }
};

exports.fetchConsentStatus = async (req, res) => {
  try {
    const { handle } = req.params;
    const authHeader = await getAuthToken();

    const response = await axios.post(`${API_BASE_URL}/v2/consents/fetch`, { handle }, {
      headers: {
        'x-simulate-res': 'Ok',
        'Content-Type': 'application/json',
        'Authorization': authHeader
      }
    });

    const consentRequest = await ConsentRequest.findOne({ where: { handle } });
    if (consentRequest) {
      consentRequest.status = response.data.status;
      await consentRequest.save();
    }

    // Store the API response
    await ApiResponse.create({
      UserId: consentRequest.UserId,
      endpoint: '/v2/consents/fetch',
      request_data: JSON.stringify({ handle }),
      response_data: JSON.stringify(response.data)
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching consent status:', error);
    res.status(500).json({ message: 'Error fetching consent status', error: error.message });
  }
};

// Function to poll consent status
const pollConsentStatus = async (handle) => {
  try {
    const authHeader = await getAuthToken();

    const response = await axios.post(`${API_BASE_URL}/v2/consents/fetch`, { handle }, {
      headers: {
        'x-simulate-res': 'Ok',
        'Content-Type': 'application/json',
        'Authorization': authHeader
      }
    });

    const consentRequest = await ConsentRequest.findOne({ where: { handle } });
    if (consentRequest) {
      consentRequest.status = response.data.status;
      await consentRequest.save();

      // Store the API response
      await ApiResponse.create({
        UserId: consentRequest.UserId,
        endpoint: '/v2/consents/fetch',
        request_data: JSON.stringify({ handle }),
        response_data: JSON.stringify(response.data)
      });

      if (response.data.status === 'ACTIVE') {
        console.log(`Consent request ${handle} is now active.`);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error(`Error polling consent status for handle ${handle}:`, error);
    return false;
  }
};

// Schedule polling for pending consent requests
cron.schedule('* * * * *', async () => {
  const pendingRequests = await ConsentRequest.findAll({ where: { status: 'PENDING' } });
  for (const request of pendingRequests) {
    const isActive = await pollConsentStatus(request.handle);
    if (isActive) {
      // You can add additional logic here when a consent becomes active
      console.log(`Consent ${request.handle} is now active. Perform necessary actions.`);
    }
  }
});

module.exports = exports;
