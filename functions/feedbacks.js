const { Vika } = require('@vikadata/vika');

const VIKA_TOKEN = process.env.VIKA_TOKEN;
const FEEDBACK_DATASHEET_ID = process.env.FEEDBACK_DATASHEET_ID;
const FEEDBACK_VIEW_ID = process.env.FEEDBACK_VIEW_ID;

const vika = new Vika({ token: VIKA_TOKEN, fieldKey: "name" });
const datasheet = vika.datasheet(FEEDBACK_DATASHEET_ID);

// 转换为 Netlify Functions 格式
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
      const response = await datasheet.records.query({ viewId: FEEDBACK_VIEW_ID });
      if (response.success) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            code: 200,
            success: true,
            message: "查询成功",
            data: response.data.records
          })
        };
      } else {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            code: response.code,
            success: false,
            message: response.message
          })
        };
      }
    } catch (err) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          code: 500,
          success: false,
          message: '服务器异常',
          error: err.message
        })
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