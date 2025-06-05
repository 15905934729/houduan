const { Vika } = require('@vikadata/vika');

const VIKA_TOKEN = process.env.VIKA_TOKEN;
const VIKA_DATASHEET_ID = process.env.VIKA_DATASHEET_ID;

const vika = new Vika({ token: VIKA_TOKEN, fieldKey: "name" });
const datasheet = vika.datasheet(VIKA_DATASHEET_ID);

module.exports = async (req, res) => {
  // 添加 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'PUT') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { recordId, fields } = JSON.parse(body);
        if (!recordId || !fields) {
          return res.status(400).json({ success: false, message: '参数缺失' });
        }
        const response = await datasheet.records.update([{ recordId, fields }]);
        if (response.success) {
          res.json({ success: true, data: response.data });
        } else {
          res.status(500).json({ success: false, message: response.message });
        }
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}; 