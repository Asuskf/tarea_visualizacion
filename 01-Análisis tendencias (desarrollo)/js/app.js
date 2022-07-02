const graf = d3.select("#graf")
const tipoCrimen = d3.select("#tipoCrimen")
const mayorIncidentes = d3.select("#mayorIncidentes")
const totalIncidentes = d3.select("#totalIncidentes")
const anchoTotal = +graf.style('width').slice(0, -2)
const altoTotal = anchoTotal* 9 / 16
const formatComma = d3.format(",")

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

layer.append('rect').attr('height', alto).attr('width', ancho).attr('fill', '#f0f2f7')
// SVG donde se van a dibujar los datos
const g = svg.append('g').attr('transform', `translate(${margins.left}, ${margins.top})`)
    
tipoCrimenList = []

const load = async(seleccion) =>{
    let list_datos = []
    let colorBarras ="";
    g.selectAll("text").remove();
    d3.selectAll("g.axis").remove();
    d3.selectAll("p").remove();
    
    const data = await d3.json("data/las_cifras_del_crimen_en_españa.json")
    datos = data.Respuesta.Datos.Metricas[0].Datos
    // Opciones de crimenes
    datos.forEach((element) => {
        if (!tipoCrimenList.includes(element.Parametro)){
            tipoCrimenList.push(element.Parametro);
        }
    });
    // Llenar con las opciones de crimenes
    tipoCrimen
        .selectAll('option')
        .data(tipoCrimenList)
        .enter()
        .append('option')
        .attr('value', (d) => d)
        .text(d => d)
    // Tomar el tipo de crimen seleccionado por el usuario
    seleccion = tipoCrimen.node().value
    // Filtro de datos por el tipo de crimen seleccionado
    datos.forEach((element) => {
        if (element.Parametro == seleccion){
            list_datos.push(element);
        }
    });


    const yAccessor = (d) => d.Valor
    //Variable con comma
    const yAccessor2 = (d) => formatComma(d.Valor)
    const xAccessor = (d) => d.Agno

    function onMouseOver(d, i) {
        d3.select(this).attr("fill", "#7b6dbf"); 
    }
    mayorNumberIncidentes = d3.max(list_datos, yAccessor)
    numberIncidentes = d3.map(list_datos, yAccessor) 
    yearsIncidentes = d3.map(list_datos, xAccessor)
    anioMayorIncidentes = yearsIncidentes[d3.maxIndex(list_datos, yAccessor)]
    colorBarras=function(d){
        if(yAccessor(d)==mayorNumberIncidentes){
            return "#1526A4"
        }
        else{
            return "#4B94D9"
        }
    }
    
    
    const y = d3.scaleLinear().domain([0, d3.max(list_datos, yAccessor)]).range([alto,0])
    const x = d3.scaleBand().domain(d3.map(list_datos, xAccessor)).range([0, ancho ]).paddingOuter(0.2).paddingInner(0.1)
    const rect = g
    // Barras
    .selectAll('rect')
    .data(list_datos)
    rect
    .enter()
    .append('rect')
    .merge(rect)
    .attr('x', (d) => x(xAccessor(d)))
    .attr('y', (d) =>  y(yAccessor(d)))
    .attr('width', x.bandwidth())
    .attr('height', (d) => alto - y(yAccessor(d)))
    .attr('fill', colorBarras)
    .attr('opacity', 0.90)
  //  .on("mouseover", function() { d3.select(this).attr("fill", "#7b6dbf");  })
    .on("mouseover", onMouseOver)
    .on("mouseout", function() { d3.select(this) .attr('fill',colorBarras) ; });
    const ct = g
    // Etiquetas
    .selectAll('text')
    .data(list_datos)
    ct
    .enter()
    .append('text')
    .classed("leyendas", true)
    .attr("text-anchor", "middle")
    .attr('x', (d) => x(xAccessor(d)) + x.bandwidth()/2)
    .attr('y', (d) =>   y(yAccessor(d)/2)) 
    .style('fill', function(d){
        if(yAccessor(d)==mayorNumberIncidentes){
            return "#f0f2f7"
        }        
    })
    .text(yAccessor2)
    
    

   

    // Titulo del gráfico
    if (seleccion == 'Total'){
        g.append('text').attr("x", ancho/2).attr("y", -15).classed("titulo", true).text(`${seleccion} de crimenes por año`)
        totalIncidentes.append("p").classed("titulo", true).text(`Total de incidentes reportados fue ${formatComma(d3.sum(numberIncidentes))}`);
    }else{
        g.append('text').attr("x", ancho/2).attr("y", -15).classed("titulo", true).text(`${seleccion} por año`)
        totalIncidentes.append("p").classed("titulo", true).text(`Total de incidentes del tipo ${seleccion} reportados fue ${formatComma(d3.sum(numberIncidentes))}`);
    }
    
     // Ejes
    const xAxis = d3.axisBottom(x)
    const yAxis = d3.axisLeft(y).ticks(6)
   const xAxisGroup = g.append('g').classed("axis", true).call(xAxis).attr("transform", `translate(0, ${alto} )`)
 //   const xAxisGroup = g.append('g').classed("axis", true).call(xAxis).attr("transform", `translate(0, ${alto} )`).attr("text-anchor", "end").text("anioo");
    const yAxisGroup = g.append('g').classed("axis", true).call(yAxis)
    //Tamaño de los ticks del eje y, se varia por el espacio para el titulo del eje 
    if(mayorNumberIncidentes>=10000){
        yAxisGroup.selectAll(".tick text").attr("font-size","17")
    }
   

    // Titulos de Eje
    g.append('text').attr("text-anchor", "end").attr("x", ancho/2).attr("y",altoTotal - margins.button).attr("font-size","24").text("Año");
    g.append('text').attr("text-anchor", "end").attr("transform", "rotate(-90)").attr("x",-alto/2).attr("y",-margins.left+20).attr("font-size","22").text("Incidencias");


}

load()