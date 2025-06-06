const { Vika } = require('@vikadata/vika');

const VIKA_TOKEN = process.env.VIKA_TOKEN;
const FEEDBACK_DATASHEET_ID = process.env.FEEDBACK_DATASHEET_ID || process.env.VIKA_DATASHEET_ID;

const vika = new Vika({ token: VIKA_TOKEN, fieldKey: "name" });
const datasheet = vika.datasheet(FEEDBACK_DATASHEET_ID);

// Netlify 函数格式
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

  if (event.httpMethod === 'POST') {
    try {
      // Netlify 直接从 event.body 获取数据
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
          body: JSON.stringify({ success: true, message: '更新成功', data: response.data })
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
        body: JSON.stringify({ success: false, message: '服务器异常', error: err.message })
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