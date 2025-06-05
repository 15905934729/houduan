const { Vika } = require('@vikadata/vika');

const VIKA_TOKEN = process.env.VIKA_TOKEN;
const FEEDBACK_DATASHEET_ID = process.env.FEEDBACK_DATASHEET_ID;

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

  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { recordId, newStatus } = JSON.parse(body);
        if (!recordId || !newStatus) {
          return res.status(400).json({ success: false, message: '参数缺失' });
        }
        const response = await datasheet.records.update([
          {
            recordId,
            fields: { "处理状态": newStatus }
          }
        ]);
        if (response.success) {
          res.json({ success: true, message: '更新成功', data: response.data });
        } else {
          res.status(500).json({ success: false, message: response.message });
        }
      } catch (err) {
        res.status(500).json({ success: false, message: '服务器异常', error: err.message });
      }
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}; 