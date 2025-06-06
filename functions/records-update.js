const { Vika } = require('@vikadata/vika');

const VIKA_TOKEN = process.env.VIKA_TOKEN;
const VIKA_DATASHEET_ID = process.env.VIKA_DATASHEET_ID;

const vika = new Vika({ token: VIKA_TOKEN, fieldKey: "name" });
const datasheet = vika.datasheet(VIKA_DATASHEET_ID);

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  if (event.httpMethod === 'OPTIONS') {
    return { 
      statusCode: 200, 
      headers, 
      body: '' 
    };
  }

  if (event.httpMethod === 'PUT' || event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body);
      const { recordId, fields } = body;
      
      if (!recordId || !fields) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, message: '参数缺失' })
        };
      }
      
      const response = await datasheet.records.update([{ recordId, fields }]);
      
      if (response.success) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, data: response.data })
        };
      } else {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ success: false, message: response.message })
        };
      }
    } catch (err) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ success: false, message: err.message })
      };
    }
  } else {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }
}; 