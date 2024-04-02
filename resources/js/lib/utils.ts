import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {utils,writeFile} from 'xlsx';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ExportToExcel:(data:any[],fileName:string)=>Promise<void> = async(data,fileName)=>{
  const ws=utils.json_to_sheet(data,{skipHeader:true});
  ws['!autofilter'] = { ref:"A1:AB1" };
  const wb=utils.book_new();
  utils.book_append_sheet(wb,ws,"Data");
  writeFile(wb, `${fileName}.xlsx`,{bookType:'xlsx',bookSST:true,});
}