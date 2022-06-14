const graf = d3.select("#graf")
const tipoCrimen = d3.select("#tipoCrimen")

const anchoTotal = +graf.style('width').slice(0, -2)
const altoTotal = anchoTotal* 9 / 16

const margins = {
    top: 60,
    right:20,
    button: 75,
    left: 100
}

const ancho = anchoTotal - margins.left - margins.right
const alto = altoTotal - margins.top - margins.button

const svg = graf.append("svg").attr('width', anchoTotal).attr('height', altoTotal).attr('class',"graf")
// Titulos
const g = svg.append('g').attr('transform', `translate(${margins.left}, ${margins.top})`)

tipoCrimenList = []
const load = async(seleccion) =>{
    const data = await d3.json("data/las_cifras_del_crimen_en_españa.json")
    const datos = data.Respuesta.Datos.Metricas[0].Datos
    //
    const yAccessor = (d) => d.seleccion
    datos.forEach((element) => {

        if (!tipoCrimenList.includes(element.Parametro)){
            tipoCrimenList.push(element.Parametro);
        }
        tipoCrimen
        .selectAll('option')
        .data(tipoCrimenList)
        .enter()
        .append('option')
        .attr('value', (d) => d)
        .text(d => d)
    });
    if (seleccion){
        g.append('text').attr("x", ancho/2).attr("y", -15).classed("titulo", true).text(`${seleccion}`)
    }else{
        g.append('text').attr("x", ancho/2).attr("y", -15).classed("titulo", true).text(`${tipoCrimenList[0]}`)
    }
}


load()

const modi = (delta) => {
    tipo = tipoCrimen.node().value
    svg.selectAll("text").remove();
    load(tipo)
    
}

