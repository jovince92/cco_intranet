import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {utils,writeFile} from 'xlsx';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ExportToExcel:(data:any[],fileName:string)=>Promise<void> = async(data,fileName)=>{
  const ws=utils.json_to_sheet(data,{skipHeader:true});
  const columnRange = `A1:${numberToExcelColumn(data[0].length)}`;
  ws['!autofilter'] = { ref:columnRange };
  const wb=utils.book_new();
  utils.book_append_sheet(wb,ws,"Data");
  writeFile(wb, `${fileName}.xlsx`,{bookType:'xlsx',bookSST:true,});
}

function numberToExcelColumn(num:number) {
  let columnName = '';
  while (num > 0) {
      let remainder = (num - 1) % 26;
      columnName = String.fromCharCode(65 + remainder) + columnName;
      num = Math.floor((num - 1) / 26);
  }
  return columnName + '1';
}

export const isValid24HrTime = (time:string) => {
  // Regular expression to match the time format hh:mm:ss
  var regex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

  // Test the input string against the regular expression
  return regex.test(time);
}