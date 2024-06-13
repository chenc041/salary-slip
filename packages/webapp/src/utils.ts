import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const analysis = (file: File) => {
  return new Promise(function (resolve) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = e.target?.result;
      const datajson = XLSX.read(data, { type: 'binary' });
      const result: any[] = [];
      datajson.SheetNames.forEach((sheetName) => {
        result.push({
          sheetName: sheetName,
          sheet: XLSX.utils.sheet_to_json(datajson.Sheets[sheetName]),
        });
      });
      resolve(result);
    };
    reader.readAsBinaryString(file);
  });
};

export function exportToExcel(data: any, fileName = 'export.xlsx') {
  // 构造工作簿和工作表
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // 生成Excel文件的二进制内容
  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  // 转换为Blob对象并触发下载
  const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, fileName);
}
