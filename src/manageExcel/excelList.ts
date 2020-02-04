import * as XLSX from 'xlsx';
import { bicgVoc, itcgVoc, senOwner, BICGLimit } from '../_constants/vocabularies'



export class ExcelFile {

    reader: FileReader
    working: boolean = false
    currentF: any[]


    constructor() {
        this.reader = new FileReader();
        this.currentF = []

    }

    readmultifiles(files: any[]) {
        return new Promise((resolve) => {
            let resp: any = []
            for (const [i, file] of files.entries() as any) {
                const reader = new FileReader()
                reader.onabort = () => console.log('file reading was aborted')
                reader.onerror = () => console.log('file reading has failed')
                reader.onload = (evt: any) => {
                    const bstr = evt.target.result;
                    const wb = XLSX.read(bstr, { type: 'binary' });
                    const wsname = wb.SheetNames[0];
                    const ws = wb.Sheets[wsname];
                    const data = XLSX.utils.sheet_to_json(ws);
                    resp[i] = data
                    if (i + 1 === files.length) resolve(resp)

                };
                reader.readAsBinaryString(file)
            }
        }
        )

    }

    normalizeFiles(files: any[]) {
        let filteredData: any[] = []
        console.log('Processing...', files)
        /**First filter layer */
        let mergedData: any[] = [].concat.apply([], files)
        /**Calculate price per unit (P/U) */
        for (const row of mergedData) {
            row["P/U"] = (+(row["US$ FOB"] / row.CANTIDAD).toFixed(2))
        }
        /** merged Arrays */
        this.evaluateConditions(mergedData)
    }

    evaluateConditions(mergedData: any[]) {
        let fStage: any[] = mergedData.filter((reg) => (reg["P/U"] >= BICGLimit))
        let sndStage: any[] = fStage.filter((reg) => this.findStringOnSentence((reg[senOwner] as string)
            .toLowerCase()))
        console.log(sndStage, '2nd')
    }

    findStringOnSentence(sentence: string) {
        /** for BICG */
        return (bicgVoc.some((str) => sentence.search(str.sen) >= 0) &&
            !(itcgVoc.some((str) => sentence.search(str.sen) >= 0))) 
            
            
        }


}

