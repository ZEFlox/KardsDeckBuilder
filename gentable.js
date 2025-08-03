//用于获取ImportId表 一次性

const ExcelJS = require('exceljs')

async function exportToExcel(data, outputFile) {
  // 验证输入是否为数组
  if (!Array.isArray(data)) {
    throw new Error('输入必须是JSON数组')
  }

  // 创建新的工作簿
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('数据表格')

  // 收集所有行和列索引
  const rowKeys = new Set()
  const colKeys = new Set()
  const map = new Map()

  // 处理数据
  data.forEach((item) => {
    if (!item.importId || item.importId.length !== 2 || typeof item.title_zh_Hans === 'undefined') {
      return // 跳过无效条目
    }
    const col = item.importId[0] // 列索引（第一个字符）
    const row = item.importId[1] // 行索引（第二个字符）
    rowKeys.add(row)
    colKeys.add(col)
    map.set(`${col}${row}`, item.title_zh_Hans)
  })

  // 排序行列索引
  const sortedRows = Array.from(rowKeys).sort()
  const sortedCols = Array.from(colKeys).sort()

  // 设置表头（列标题）
  worksheet.getCell(1, 1).value = '行/列'
  sortedCols.forEach((col, index) => {
    worksheet.getCell(1, index + 2).value = col
  })

  // 设置行标题和数据
  sortedRows.forEach((row, rowIndex) => {
    // 行标题
    worksheet.getCell(rowIndex + 2, 1).value = row

    // 填充数据
    sortedCols.forEach((col, colIndex) => {
      const key = `${col}${row}`
      const value = map.has(key) ? map.get(key) : ''
      worksheet.getCell(rowIndex + 2, colIndex + 2).value = value
    })
  })

  // 设置列宽自适应内容
  worksheet.columns = [
    { header: '行/列', key: 'rowCol', width: 10 },
    ...sortedCols.map((col) => ({ header: col, key: col, width: 20 })),
  ]

  // 添加表格样式
  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      // 表头样式
      if (rowNumber === 1) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD9D9D9' },
        }
        cell.font = { bold: true }
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        }
      }
      // 行标题样式
      else if (colNumber === 1) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFEBEBEB' },
        }
        cell.font = { bold: true }
      }
      // 数据单元格样式
      else {
        cell.border = {
          left: { style: 'thin' },
          top: { style: 'thin' },
        }
      }
    })
  })

  // 保存Excel文件
  await workbook.xlsx.writeFile(outputFile)
  console.log(`Excel文件已保存至: ${outputFile}`)
}

// 主函数：读取JSON并导出Excel
async function main() {
  try {
    const jsonData = require('./src/data/kardsdata_navalwarfare.json')
    await exportToExcel(jsonData, 'output.xlsx')
  } catch (err) {
    console.error('处理失败:', err.message)
  }
}

// 执行主函数
main()
