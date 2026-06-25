/**
 * 生成真实风格头像 URL
 * 使用 UI Avatars API 生成带首字母的专业头像
 * 离线环境回退到 SVG 渐变头像
 */

const avatarColors = [
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'],
  ['#fa709a', '#fee140'],
  ['#a18cd1', '#fbc2eb'],
  ['#fccb90', '#d57eeb'],
  ['#e0c3fc', '#8ec5fc'],
  ['#f093fb', '#f5576c'],
  ['#ffecd2', '#fcb69f'],
]

export function avatarUrl(name: string, size: number = 80): string {
  const encodedName = encodeURIComponent(name)
  // UI Avatars API - 生成专业头像（需联网）
  const colorIndex = Math.abs(hashCode(name)) % avatarColors.length
  const [bg1, bg2] = avatarColors[colorIndex]
  return `https://ui-avatars.com/api/?name=${encodedName}&size=${size * 2}&background=${bg1.replace('#', '')}&color=fff&bold=true&format=svg`
}

export function avatarSvgDataUrl(name: string, size: number = 80): string {
  const initial = name.charAt(0)
  const colorIndex = Math.abs(hashCode(name)) % avatarColors.length
  const [bg1, bg2] = avatarColors[colorIndex]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bg1}"/>
      <stop offset="100%" style="stop-color:${bg2}"/>
    </linearGradient></defs>
    <rect width="${size}" height="${size}" rx="${size / 2}" fill="url(#g)"/>
    <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
      font-family="'PingFang SC','Microsoft YaHei',sans-serif"
      font-size="${size * 0.45}" font-weight="bold" fill="white">${initial}</text>
  </svg>`
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)))
}

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + chr
    hash |= 0
  }
  return Math.abs(hash)
}
