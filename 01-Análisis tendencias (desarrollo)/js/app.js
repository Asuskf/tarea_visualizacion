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
const layer = svg.append('g').attr('transform', `translate(${margins.left}, ${margins.top})`)

layer.append('rect').attr('height', alto).attr('width', ancho).attr('fill', '#fefae0')
// Titulos
const g = svg.append('g').attr('transform', `translate(${margins.left}, ${margins.top})`)

tipoCrimenList = []
let list_datos = []
const load = async(seleccion) =>{
    const data = await d3.json("data/las_cifras_del_crimen_en_españa.json")
    datos = data.Respuesta.Datos.Metricas[0].Datos
    //
    datos.forEach((element) => {
        if (!tipoCrimenList.includes(element.Parametro)){
            tipoCrimenList.push(element.Parametro);
        }
    });
    
    if (!seleccion){
        seleccion = tipoCrimenList[0]   
    }
    
    datos.forEach((element) => {
        if (element.Parametro == seleccion){
            list_datos.push(element);
        }
    });
    const yAccessor = (d) => d.Valor
    const xAccessor = (d) => d.Agno
    
    const y = d3.scaleLinear().domain([0, d3.max(list_datos, yAccessor)]).range([alto,0])
    const x = d3.scaleBand().domain(d3.map(list_datos, xAccessor)).range([0, ancho ]).paddingOuter(0.2).paddingInner(0.1)
    
    const rect = g
    // Gráfico
    .selectAll('rect')
    .data(list_datos)
    .enter()
    .append('rect')
    .attr('x', (d) => x(xAccessor(d)))
    .attr('y', (d) =>  y(yAccessor(d)))
    .attr('width', x.bandwidth())
    .attr('height', (d) => alto - y(yAccessor(d)))
    .attr('fill', "#faedcd")

    const ct = g
    // Gráfico
    .selectAll('text')
    .data(list_datos)
    .enter()
    .append('text')
    .attr('x', (d) => x(xAccessor(d)) + x.bandwidth() / 2)
    .attr('y', (d) =>  y(yAccessor(d)))
    .text(yAccessor)

    g.append('text').attr("x", ancho/2).attr("y", -15).classed("titulo", true).text(`${seleccion}`)

     // Ejes
     const xAxis = d3.axisBottom(x)
     const yAxis = d3.axisLeft(y).ticks(6)
 
     const xAxisGroup = g.append('g').classed("axis", true).call(xAxis).attr("transform", `translate(0, ${alto} )`)
     const yAxisGroup = g.append('g').classed("axis", true).call(yAxis)
 
    tipoCrimen
        .selectAll('option')
        .data(tipoCrimenList)
        .enter()
        .append('option')
        .attr('value', (d) => d)
        .text(d => d)
    
}


load()

const modi = (delta) => {
    tipo = tipoCrimen.node().value
    g.selectAll("text").remove();
    load(tipo)
    
}

