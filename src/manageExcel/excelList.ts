import * as XLSX from 'xlsx';



export class ExcelFile {

    reader: FileReader
    currentFiles: any[]
    working: boolean = false

    constructor() {
        this.reader = new FileReader();
        this.currentFiles = []
    }

    normalizeFiles() {
        console.log('Processing...')
    }

    readmultifiles(files: any[]) {
        this.working = true
        let reader = new FileReader();
        let newData: any[] = []
        function readFile(index: number) {
            if (index >= files.length) return;
            var file = files[index];

            reader.onload = (evt: any) => {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);
                newData[index] = data
                readFile(index + 1)
            };

            reader.readAsBinaryString(file);
        }
        readFile(0);
        if (newData.length > 0) {
            this.working = false
            return newData
        }
    }

}
