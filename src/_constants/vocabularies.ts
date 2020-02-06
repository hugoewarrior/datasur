interface VocBICG {
    sen: string,
    pu: number
}
interface VocITCG {
    sen: string,
    pu: number
}

export const bicgVoc: VocBICG[] = [
    { sen: "multifuncional", pu: 0 },
    { sen: "multifuncionales", pu: 0 },
    { sen: "impresoras multifuncionales", pu: 0 },
    { sen: "impresora multifuncional", pu: 0 },
    { sen: "impresoras multifuncional", pu: 0 },
    { sen: "equipos y accesorios multifuncional", pu: 0 },
    { sen: "equipo multifuncional", pu: 0 },
    { sen: "impresora", pu: 500 },
    { sen: "plotter", pu: 0 },
    { sen: "plotter multifuncional", pu: 0 },
    { sen: "laser", pu: 0 },
]

export const itcgVoc: VocITCG[] = [
    { sen: "repuesto", pu: 0 },
    { sen: "parte", pu: 0 },
    { sen: "no", pu: 0 },
    { sen: "impresores", pu: 0 },
    { sen: "accesorio", pu: 0 },
    { sen: "3d", pu: 0 },
    { sen: "mantenimiento", pu: 0 },
    { sen: "termico", pu: 0 },
    { sen: "toner", pu: 0 },
    { sen: "tintas", pu: 0 },
    { sen: "tinta", pu: 0 },
    { sen: "para", pu: 0 },
    { sen: "cartucho", pu: 0 },
    { sen: "cera", pu: 0 },
    { sen: "teclado", pu: 0 },
    { sen: "barra", pu: 0 },
    { sen: "serigrafia", pu: 0 },
    { sen: "bombillo", pu: 0 },
]

export const senOwner: string = "DESCRIPCION ARANCELARIA"
export const BICGLimit: number = 500