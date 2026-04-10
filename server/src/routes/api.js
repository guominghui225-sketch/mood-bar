const express = require('express');
const router = express.Router();
const cocktailController = require('../controllers/cocktail');

// 生成鸡尾酒
router.post('/generate-cocktail', cocktailController.generateCocktail);

// 检查图片生成状态
router.get('/image-status/:generationId', cocktailController.getImageStatus);

// 错误处理中间件（仅适用于此路由）
router.use((err, req, res, next) => {
  console.error('API route error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

module.exports = router;