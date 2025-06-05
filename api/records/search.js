const { Vika } = require('@vikadata/vika');

const VIKA_TOKEN = process.env.VIKA_TOKEN;
const VIKA_DATASHEET_ID = process.env.VIKA_DATASHEET_ID;
const VIKA_VIEW_ID = process.env.VIKA_VIEW_ID;

const vika = new Vika({ token: VIKA_TOKEN, fieldKey: "name" });
const datasheet = vika.datasheet(VIKA_DATASHEET_ID);

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
      // 获取查询参数
      const { name, content, time, rode } = req.query;
      
      // 构建查询过滤条件
      let filterQuery = [];
      
      if (name) {
        filterQuery.push({
          fieldName: 'name',
          operator: 'contains',
          value: name
        });
      }
      
      if (content) {
        filterQuery.push({
          fieldName: 'content',
          operator: 'contains',
          value: content
        });
      }
      
      if (time) {
        filterQuery.push({
          fieldName: 'time',
          operator: 'contains',
          value: time
        });
      }
      
      if (rode) {
        filterQuery.push({
          fieldName: 'rode',
          operator: 'is',
          value: rode
        });
      }
      
      // 执行查询
      const queryOptions = {
        viewId: VIKA_VIEW_ID
      };
      
      if (filterQuery.length > 0) {
        queryOptions.filterByFormula = {
          conjunction: 'and',
          conditions: filterQuery
        };
      }
      
      const response = await datasheet.records.query(queryOptions);
      
      if (response.success) {
        res.status(200).json({
          success: true,
          records: response.data.records
        });
      } else {
        res.status(500).json({
          success: false,
          message: response.message
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}; 