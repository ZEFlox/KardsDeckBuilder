const fs = require('fs')
const path = require('path')

// 配置文件路径（根据您的实际项目结构调整）
const DATA_PATH = './src/data/kardsdata_navalwarfare.json' // 卡牌数据文件路径
const IMAGE_FOLDER = './public/kards_cn' // 照片文件夹路径

function checkMissingCardImages() {
  try {
    // 1. 读取卡牌数据
    const rawData = fs.readFileSync(DATA_PATH, 'utf-8')
    const cardData = JSON.parse(rawData)
    const cardIds = new Set(
      cardData.map((card) => card.title_zh_Hans.toUpperCase().replace(/\//g, '')),
    )

    console.log(`已加载 ${cardData.length} 条卡牌数据`)

    // 2. 读取照片文件夹
    const imageFiles = fs.readdirSync(IMAGE_FOLDER)
    const imageNames = imageFiles.map((file) => path.parse(file).name.replace(/_老兵/g, ''))

    console.log(`在 ${IMAGE_FOLDER} 中找到 ${imageFiles.length} 张照片`)

    // 3. 找出无对应卡牌数据的照片
    const missingCards = imageNames.filter((imageName) => !cardIds.has(imageName))

    // 4. 输出结果
    if (missingCards.length === 0) {
      console.log('☑ 所有照片都有对应的卡牌数据')
      return
    }

    console.log('☒ 以下照片没有对应的卡牌数据:')
    missingCards.forEach((name) => console.log(name))
    console.log(`\n共发现 ${missingCards.length} 张照片缺少对应卡牌数据`)

    // 5. 额外检查：是否有卡牌数据但无对应照片
    const missingImages = Array.from(cardIds).filter((id) => !imageNames.includes(id))
    if (missingImages.length > 0) {
      console.log('\n☒ 以下卡牌数据没有对应的照片:')
      missingImages.forEach((id) => console.log(id))
      console.log(`共发现 ${missingImages.length} 条卡牌数据缺少对应照片`)
    }
  } catch (error) {
    console.error('☒ 检查过程中出错:', error.message)
    process.exit(1) // 非零退出码表示错误
  }
}

// 执行检查
console.log('开始检查照片与卡牌数据对应关系...')
checkMissingCardImages()
