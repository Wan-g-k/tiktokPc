var oral = (params) => {
  if(localStorage.locale === undefined) {
    localStorage.setItem('locale', 'zh')
  }
  if (params === '首页') {
    return localStorage.locale === 'zh' ? '首页' : 'Home'
  }
  if (params === '任务详情') {
    return localStorage.locale === 'zh' ? '任务详情' : 'Task details'
  }
  if (params === '用户管理') {
    return localStorage.locale === 'zh' ? '用户管理' : 'User Management'
  }
  if (params === '账号管理') {
    return localStorage.locale === 'zh' ? '账号管理' : 'Account Management'
  }
  if (params === '商品管理') {
    return localStorage.locale === 'zh' ? '商品管理' : 'Commodity Management'
  }
  if (params === '端口管理') {
    return localStorage.locale === 'zh' ? '端口管理' : 'Port Management'
  }
  if (params === 'TK用户') {
    return localStorage.locale === 'zh' ? 'TK用户' : 'TK User'
  }
  if (params === '客服管理') {
    return localStorage.locale === 'zh' ? '客服管理' : 'Customer Aervice'
  }
  if (params === '在线聊天') {
    return localStorage.locale === 'zh' ? '在线聊天' : 'Live Chat'
  }
  if (params === '账号信息') {
    return localStorage.locale === 'zh' ? '账号信息' : 'Account Information'
  }
  if (params === '资源管理') {
    return localStorage.locale === 'zh' ? '资源管理' : 'Resource Management'
  }
  if (params === '包管理') {
    return localStorage.locale === 'zh' ? '包管理' : 'Package Management'
  }
  if (params === '广告管理') {
    return localStorage.locale === 'zh' ? '广告管理' : 'Advertising Management'
  }
  if (params === '数据面板') {
    return localStorage.locale === 'zh' ? '数据面板' : 'Data Panel'
  }
  if (params === '分成配置') {
    return localStorage.locale === 'zh' ? '分成配置' : 'Distribution Configuration'
  }
  if (params === '返利记录') {
    return localStorage.locale === 'zh' ? '返利记录' : 'Rebate Record'
  }
  if (params === '广告记录') {
    return localStorage.locale === 'zh' ? '广告记录' : 'Ad Record'
  }
  if (params === '申请广告') {
    return localStorage.locale === 'zh' ? '申请广告' : 'Apply for advertisement'
  }
  if (params === '创建链接') {
    return localStorage.locale === 'zh' ? '创建链接' : 'Create Link'
  }
  if (params === '任务管理') {
    return localStorage.locale === 'zh' ? '任务管理' : 'Task Management'
  }
  if (params === '关注') {
    return localStorage.locale === 'zh' ? '关注' : 'Interest'
  }
  if (params === '私信') {
    return localStorage.locale === 'zh' ? '私信' : 'private letter'
  }
  if (params === '实用工具') {
    return localStorage.locale === 'zh' ? '实用工具' : 'Handy Tool'
  }
  if (params === '短链接生成') {
    return localStorage.locale === 'zh' ? '短链接生成' : 'Short link generation'
  }
  if (params === '上传信息') {
    return localStorage.locale === 'zh' ? '上传信息' : 'Upload information'
  }
  if (params === '上传Token') {
    return localStorage.locale === 'zh' ? '上传Token' : 'Upload Token'
  }
  if (params === '资源下载') {
    return localStorage.locale === 'zh' ? '资源下载' : 'Download'
  }
  if (params === '采集上传') {
    return localStorage.locale === 'zh' ? '采集上传' : 'Collection upload'
  }
  if (params === '账号包管理') {
    return localStorage.locale === 'zh' ? '账号包管理' : 'Account package management'
  }
  if (params === '积分记录') {
    return localStorage.locale === 'zh' ? '积分记录' : 'Points record'
  }
  if (params === 'VIP等级') {
    return localStorage.locale === 'zh' ? 'VIP等级' : 'VIP level'
  }
  if (params === '系统配置') {
    return localStorage.locale === 'zh' ? '系统配置' : 'System Configuration'
  }
  if (params === '资源审核') {
    return localStorage.locale === 'zh' ? '资源审核' : 'Resource review'
  }
  if (params === '公告配置') {
    return localStorage.locale === 'zh' ? '公告配置' : 'Announcement management'
  }
  if (params === '声明公告') {
    return localStorage.locale === 'zh' ? '声明公告' : 'Announcement'
  }
}

export default oral
