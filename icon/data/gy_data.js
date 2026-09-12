// ============================================
// 「关于」页面链接数据 - linkData
// 集中管理 6 个链接卡片：主卡片(标题/描述/图片) + 展开后的子链接(文字/图片/网址)
// 以后只需修改本文件，页面无需改动；重新部署时改一下 index/mine 里的版本号即可
// 图片路径均相对于项目根目录，放在 icon/ 子目录下
// ============================================

const linkData = [
  {
    title: 'Leo/need',                       // 主卡片标题
    //desc: '文字',                        // 主卡片描述
    icon: 'icon/Tuant/ln.webp',          // 主卡片图片
    links: [                             // 展开后的子链接
      { text: '星乃一歌', img: 'icon/Tuant/Information/chr_ts_1.png',  url: 'https://pjsk.moe/zh-cn/character/1/' },
      { text: '天马咲希', img: 'icon/Tuant/Information/chr_ts_2.png',  url: 'https://pjsk.moe/zh-cn/character/2/' },
      { text: '望月穗波', img: 'icon/Tuant/Information/chr_ts_3.png',  url: 'https://pjsk.moe/zh-cn/character/3/' },
      { text: '日野森志步', img: 'icon/Tuant/Information/chr_ts_4.png',  url: 'https://pjsk.moe/zh-cn/character/4/' },
    ],
  },
  {
    title: 'MORE MORE JUMP！',
    //desc: '文字',
    icon: 'icon/Tuant/mmj.webp',
    links: [
      { text: '花里实乃里', img: 'icon/Tuant/Information/chr_ts_5.png',  url: 'https://pjsk.moe/zh-cn/character/5/' },
      { text: '桐谷遥', img: 'icon/Tuant/Information/chr_ts_6.png',  url: 'https://pjsk.moe/zh-cn/character/6/' },
      { text: '桃井爱莉', img: 'icon/Tuant/Information/chr_ts_7.png',  url: 'https://pjsk.moe/zh-cn/character/7/' },
      { text: '日野森雫', img: 'icon/Tuant/Information/chr_ts_8.png',  url: 'https://pjsk.moe/zh-cn/character/8/' },
    ],
  },
  {
    title: 'Vivid BAD SQUAD',
    //desc: '文字',
    icon: 'icon/Tuant/vbs.webp',
    links: [
      { text: '小豆泽心羽', img: 'icon/Tuant/Information/chr_ts_9.png',  url: 'https://pjsk.moe/zh-cn/character/9/' },
      { text: '白石杏', img: 'icon/Tuant/Information/chr_ts_10.png', url: 'https://pjsk.moe/zh-cn/character/10/' },
      { text: '东云彰人', img: 'icon/Tuant/Information/chr_ts_11.png', url: 'https://pjsk.moe/zh-cn/character/11/' },
      { text: '青柳冬弥', img: 'icon/Tuant/Information/chr_ts_12.png', url: 'https://pjsk.moe/zh-cn/character/12/' },
    ],
  },
  {
    title: 'Wonderlands×Showtime',
    //desc: '文字',
    icon: 'icon/Tuant/wxs.webp',
    links: [
      { text: '天马司', img: 'icon/Tuant/Information/chr_ts_13.png', url: 'https://pjsk.moe/zh-cn/character/13/' },
      { text: '凤笑梦', img: 'icon/Tuant/Information/chr_ts_14.png', url: 'https://pjsk.moe/zh-cn/character/14/' },
      { text: '草薙宁宁', img: 'icon/Tuant/Information/chr_ts_15.png', url: 'https://pjsk.moe/zh-cn/character/15/' },
      { text: '神代类', img: 'icon/Tuant/Information/chr_ts_16.png', url: 'https://pjsk.moe/zh-cn/character/16/' },
    ],
  },
  {
    title: '25点，Nightcord见。',
    //desc: '文字',
    icon: 'icon/Tuant/n25.webp',
    links: [
      { text: '宵崎奏', img: 'icon/Tuant/Information/chr_ts_17.png', url: 'https://pjsk.moe/zh-cn/character/17*' },
      { text: '朝比奈真冬', img: 'icon/Tuant/Information/chr_ts_18.png', url: 'https://pjsk.moe/zh-cn/character/18/' },
      { text: '东云绘名', img: 'icon/Tuant/Information/chr_ts_19.png', url: 'https://pjsk.moe/zh-cn/character/19/' },
      { text: '晓山瑞希', img: 'icon/Tuant/Information/chr_ts_20.png', url: 'https://pjsk.moe/zh-cn/character/20/' },
    ],
  },
  {
    title: '虚拟歌手',
    //desc: '文字',
    icon: 'icon/Tuant/vs.webp',
    links: [                             // 最后一个卡片展开 6 条
      { text: '初音未来', img: 'icon/Tuant/Information/chr_ts_21.png', url: 'https://pjsk.moe/zh-cn/character/21/' },
      { text: '镜音铃', img: 'icon/Tuant/Information/chr_ts_22.png', url: 'https://pjsk.moe/zh-cn/character/22/' },
      { text: '镜音连', img: 'icon/Tuant/Information/chr_ts_23.png', url: 'https://pjsk.moe/zh-cn/character/231' },
      { text: '巡音流歌', img: 'icon/Tuant/Information/chr_ts_24.png', url: 'https://pjsk.moe/zh-cn/character/24/' },
      { text: 'MEIKO', img: 'icon/Tuant/Information/chr_ts_25.png', url: 'https://pjsk.moe/zh-cn/character/25/' },
      { text: 'KAITO', img: 'icon/Tuant/Information/chr_ts_26.png', url: 'https://pjsk.moe/zh-cn/character/23/' },
    ],
  },
];
