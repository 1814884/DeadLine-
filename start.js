#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// 获取命令行参数
const args = process.argv.slice(2);
const platform = args[0] || 'h5';

// 支持的平台
const platforms = {
  'h5': 'dev:h5',
  'mp-weixin': 'dev:mp-weixin',
  'mp-alipay': 'dev:mp-alipay',
  'mp-baidu': 'dev:mp-baidu',
  'mp-toutiao': 'dev:mp-toutiao',
  'mp-qq': 'dev:mp-qq',
  'app': 'dev:app'
};

if (!platforms[platform]) {
  console.log('❌ 不支持的平台:', platform);
  console.log('✅ 支持的平台:', Object.keys(platforms).join(', '));
  process.exit(1);
}

console.log(`🚀 启动 ${platform} 开发服务器...`);

try {
  execSync(`npm run ${platforms[platform]}`, { 
    stdio: 'inherit',
    cwd: path.resolve(__dirname)
  });
} catch (error) {
  console.error('❌ 启动失败:', error.message);
  process.exit(1);
}