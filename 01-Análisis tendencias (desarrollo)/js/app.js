const graf = d3.select("#graf")
const colorSelect = d3.select("#colorSelect")

const anchoTotal = +graf.style('width').slice(0, -2)
const altoTotal = anchoTotal* 9 / 16

const svg = graf.append("svg").attr('width', anchoTotal).attr('height', altoTotal).attr('class',"graf")

