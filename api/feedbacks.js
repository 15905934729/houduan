const { Vika } = require('@vikadata/vika');

const VIKA_TOKEN = process.env.VIKA_TOKEN;
const FEEDBACK_DATASHEET_ID = process.env.FEEDBACK_DATASHEET_ID;
const FEEDBACK_VIEW_ID = process.env.FEEDBACK_VIEW_ID;

const vika = new Vika({ token: VIKA_TOKEN, fieldKey: "name" });
const datasheet = vika.datasheet(FEEDBACK_DATASHEET_ID);

module.exports = async (req, res) => {
  // 添加 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const response = await datasheet.records.query({ viewId: FEEDBACK_VIEW_ID });
      if (response.success) {
        res.status(200).json({
          code: 200,
          success: true,
          message: "查询成功",
          data: response.data.records
        });
      } else {
        res.status(500).json({
          code: response.code,
          success: false,
          message: response.message
        });
      }
    } catch (err) {
      res.status(500).json({
        code: 500,
        success: false,
        message: '服务器异常',
        error: err.message
      });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}; 