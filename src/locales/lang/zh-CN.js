import antd from 'ant-design-vue/es/locale-provider/zh_CN'
import momentCN from 'moment/locale/zh-cn'

const components = {
  antLocale: antd,
  momentName: 'zh-cn',
  momentLocale: momentCN
}

const locale = {
  'message': '-',
  'menu.home': '主页',
  'menu.dashboard': '仪表盘',
  'menu.dashboard.analysis': '分析页',
  'menu.dashboard.monitor': '监控页',
  'menu.dashboard.workplace': '工作台',
  'layouts.usermenu.dialog.title': '提示',
  'layouts.usermenu.dialog.content': '确定退出?',

  'app.setting.pagestyle': '页面风格设置',
  'app.setting.pagestyle.light': '明亮模式',
  'app.setting.pagestyle.dark': '黑暗模式',
  'app.setting.pagestyle.realdark': 'RealDark style',
  'app.setting.themecolor': '主题颜色',
  'app.setting.navigationmode': 'Navigation Mode',
  'app.setting.content-width': 'Content Width',
  'app.setting.fixedheader': '固定头部',
  'app.setting.fixedsidebar': '固定菜单',
  'app.setting.sidemenu': '左侧菜单',
  'app.setting.topmenu': '顶部菜单',
  'app.setting.content-width.fixed': '固定',
  'app.setting.content-width.fluid': '流体',
  'app.setting.othersettings': '其他设置',
  'app.setting.weakmode': '色弱模式',
  'app.setting.copy': 'Copy Setting',
  'app.setting.loading': 'Loading theme',
  'app.setting.copyinfo': 'copy success，please replace defaultSettings in src/models/setting.js',
  'app.setting.production.hint': 'Setting panel shows in development environment only, please manually modify'
}

export default {
  ...components,
  ...locale
}
