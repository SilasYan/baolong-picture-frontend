import { saveAs } from 'file-saver'
import { message } from 'ant-design-vue'
import CryptoJS from 'crypto-js'

// region 图片校验
// 使用方法
// import { imageValidator } from '@/utils/upload';
//
// // 默认2MB校验
// const beforeUploadDefault = (file: File) => imageValidator(file);
//
// // 自定义5MB校验
// const beforeUploadCustom = (file: File) =>
//   imageValidator(file, { maxSizeMB: 5, allowedTypes: ['image/png'] });
//
// // 仅校验类型不限制大小
// const beforeUploadTypeOnly = (file: File) =>
//   imageValidator(file, { maxSizeMB: Infinity });

type ValidatorOptions = {
  maxSizeMB?: number
  allowedTypes?: string[]
}

export const imageValidator = (
  file: File,
  options: ValidatorOptions = {
    maxSizeMB: 2,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
  },
) => {
  // 解构配置参数
  const { maxSizeMB = 2, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'] } = options

  // 校验图片格式
  const isValidType = allowedTypes.includes(file.type)
  if (!isValidType) {
    message.error(`仅支持 ${allowedTypes.join(', ').replace(/image\//g, '')} 格式的图片`)
    return false
  }

  // 校验图片大小
  const isSizeValid = file.size / 1024 / 1024 < maxSizeMB
  if (!isSizeValid) {
    message.error(`图片大小不能超过 ${maxSizeMB}MB`)
    return false
  }

  return true
}
// endregion 图片校验

// region 格式化图片大小为 M
/**
 * 格式化文件大小
 * @param size 大小
 */
export const formatPictureSize = (size?: number) => {
  if (!size) return '未知'
  if (size < 1024) return size + ' B'
  if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB'
  return (size / (1024 * 1024)).toFixed(2) + ' MB'
}
// endregion 格式化图片大小为 M

// region 十六进制颜色格式转为 RGB 格式
/**
 * 将十六进制颜色格式转为 RGB 格式
 * @param input 十六进制颜色值
 */
export function toHexColor(input) {
  // 去掉 0x 前缀
  const colorValue = input.startsWith('0x') ? input.slice(2) : input

  // 将剩余部分解析为十六进制数，再转成 6 位十六进制字符串
  const hexColor = parseInt(colorValue, 16).toString(16).padStart(6, '0')

  // 返回标准 #RRGGBB 格式
  return `#${hexColor}`
}

// endregion 十六进制颜色转为 RGB 格式

// region 拖拽图片
/**
 * 处理拖拽图片
 *
 * 需要用在 <div> 元素上，并设置 draggable="true"</div>
 * @param event
 */
export function handleDragStart(event) {
  event.preventDefault() // 阻止默认拖拽行为
}

// endregion 拖拽图片

// region 复制文本到剪贴板

/**
 * 复制文本到剪贴板
 * @param text
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    message.success('复制成功! ID: ' + text).then((r) => {})
  } catch (err) {
    message.error('复制失败!').then((r) => {})
  }
}

// endregion 复制文本到剪贴板

// region 加密解密函数

// // 示例使用
// const originalText = 'Hello, World!'
// const secretKey = 'yourSecretKey123'
// const encrypted = encrypt(originalText, secretKey)
// const decrypted = decrypt(encrypted, secretKey)
//
// console.log('Original Text:', originalText)
// console.log('Encrypted Text:', encrypted)
// console.log('Decrypted Text:', decrypted)

/**
 * 加密函数
 * @param data
 * @param key
 */
export function encrypt(data, key) {
  const encrypted = CryptoJS.AES.encrypt(data, key)
  return encrypted.toString()
}

/**
 * 解密函数
 * @param ciphertext
 * @param key
 */
export function decrypt(ciphertext, key) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key)
  return bytes.toString(CryptoJS.enc.Utf8)
}

// endregion 加密解密函数

// region 下载图片

/**
 * 下载图片
 * @param url 图片下载地址
 * @param fileName 要保存为的文件名（需包含扩展名，如 'image.jpg'）
 */
export async function downloadImage(url?: string, fileName?: string) {
  if (!url) return

  // try {
  //   const response = await fetch(url)
  //   const blob = await response.blob()
  //   saveAs(blob, fileName || 'download') // 默认文件名处理
  // } catch (error) {
  //   console.error('下载失败:', error)
  // }

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous' // 关键设置

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height

      const ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0)

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, fileName || 'download')
          resolve()
        } else {
          reject(new Error('Canvas转换失败'))
        }
      }, 'image/jpeg')
    }

    img.onerror = (err) => reject(err)
    img.src = url
  })
}

// endregion 下载图片

// region 格式化数字为 k
// console.log(formatNumber(999));   // "999"
// console.log(formatNumber(1000));  // "1k"
// console.log(formatNumber(1020));  // "1.02k"
// console.log(formatNumber(1120));  // "1.12k"
// console.log(formatNumber(1500));  // "1.5k"
// console.log(formatNumber(1999));  // "2k"（四舍五入后为 2.00，去零后为 2）
export function formatNumber(value: number): string {
  if (value < 1000) {
    return value.toString()
  }

  const kValue = value / 1000
  // 保留两位小数并移除末尾的零
  let formatted = kValue.toFixed(2).replace(/\.?0+$/, '')
  // 处理如 "2." 变成 "2" 的情况
  if (formatted.endsWith('.')) {
    formatted = formatted.slice(0, -1)
  }

  return `${formatted}k`
}

// endregion 格式化数字为 k
