import * as XLSX from 'xlsx';
import { bicgVoc, itcgVoc, senOwner, BICGLimit } from '../_constants/vocabularies'
import _ from "lodash";
import { resolve } from 'dns';



export class ExcelFile {

    reader: FileReader
    working: boolean = false
    public currentF: any[]


    constructor() {
        this.reader = new FileReader();
        this.currentF = []

    }

    readmultifiles(files: any[]) {
        return new Promise((resolve) => {
            let resp: any = []
            for (const [i, file] of files.entries() as any) {
                const reader = new FileReader();
                reader.onabort = () => console.log('file reading was aborted');
                reader.onerror = () => console.log('file reading has failed');
                reader.onload = (evt: any) => {
                    const bstr = evt.target.result;
                    const wb = XLSX.read(bstr, { type: 'binary' });
                    const wsname = wb.SheetNames[0];
                    const ws = wb.Sheets[wsname];
                    const data = XLSX.utils.sheet_to_json(ws);
                    resp[i] = data;
                    if (i + 1 === files.length) resolve(resp);

                };
                reader.readAsBinaryString(file);
            }
        }
        )

    }

    normalizeFiles(files: any[]) {
        console.log('Processing...', files)
        return new Promise((resolve) => {
            /**First filter layer */
            let mergedData: any[] = [].concat.apply([], files);

            /**Calculate price per unit (P/U) */
            for (const row of mergedData) {
                row["P/U"] = (+(row["US$ FOB"] / row.CANTIDAD).toFixed(2));
                row.DIA = parseInt(row.DIA);
                row.MES = parseInt(row.MES);
                row.AÑO = parseInt(row.AÑO);
            }
            /** merged Arrays */
            let resp: any[] = this.evaluateConditions(mergedData);
            resolve(resp)
            //assign val
            //console.log(console.log(mergedData, resp, _.differenceWith(mergedData, resp, _.isEqual)));
        })
    }

    evaluateConditions(mergedData: any[]) {
        let fStage: any[] = mergedData.filter((reg) => (reg["P/U"] >= BICGLimit));
        let sndStage: any[] = fStage.filter((reg) => this.findStringOnSentence((reg[senOwner] as string)
            .toLowerCase()));
        return _.uniqWith(sndStage, _.isEqual);
    }

    findStringOnSentence(sentence: string) {
        /** for BICG */
        let resp = (bicgVoc.some((str) => sentence.search(str.sen) >= 0) &&
            !(itcgVoc.some((str) => sentence.search(str.sen) >= 0)));
        /* console.log(resp, sentence) */
        return resp
    }

    generateExcelFile(importVal: Object[]) {
        return new Promise((resolve) => {
            if (importVal.length > 0) {
                let ws = XLSX.utils.json_to_sheet(importVal);
                let wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Reporte");
                XLSX.writeFile(wb, "sheetjs.xlsx");
                resolve(true)
            }
            else resolve(false)
        })


    }

}

