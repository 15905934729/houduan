const { Vika } = require('@vikadata/vika');

const VIKA_TOKEN = process.env.VIKA_TOKEN;
const VIKA_DATASHEET_ID = process.env.VIKA_DATASHEET_ID;
const VIKA_VIEW_ID = process.env.VIKA_VIEW_ID;

const vika = new Vika({ token: VIKA_TOKEN, fieldKey: "name" });
const datasheet = vika.datasheet(VIKA_DATASHEET_ID);

// 修改为 Netlify 函数格式
exports.handler = async (event, context) => {
  // CORS 头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  // OPTIONS 请求处理
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod === 'GET') {
    try {
      const response = await datasheet.records.query({ viewId: VIKA_VIEW_ID });
      if (response.success) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(response.data.records)
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