// API url : https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json

// svg dimensions
const height = 410;
const width = 800;
const radius = 6;


// Fetch data from the api
var obj;
fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then(data => data.json())
    .then(response => { obj = response})
    .then(() => {
        // Data is available
        const svg = d3.select('.container')
                    .append('svg')
                    .attr('height', height + 60)
                    .attr('width', width + 100)
        const years = obj.map(data => {
            return parseInt(data.Year);
        })

        // X axis years
        const xScale = d3.scaleLinear().domain([1993, 2016]).range([0, width])
        const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"))

        svg.append('g')
            .attr('id', 'x-axis')
            .attr('transform', `translate(40,${height})`)
            .call(xAxis)

            

        // Y axis minutes and seconds
        const times = obj.map((data) => {
            const parsedTime = data.Time.split(":");
            return new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
        })

        const timeFormat = d3.timeFormat("%M:%S");
        const yScale = d3.scaleTime()
                    .range([10, height]).domain(d3.extent(times, function(d) {
                        return d;
                      }));
        const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);


        // Tooltip
        const tooltip = d3.select(".container")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .attr('id', 'tooltip')
        .style('opacity', 0.9)

        svg.append('g')
            .attr('id', 'y-axis')
            .attr('transform', 'translate(40,0)')
            .call(yAxis)

        const legend = svg.append('g').attr('id', 'legend')

        legend.append('g')
           .append('rect')
           .attr('height', 15)
           .attr('width', 15)
           .attr('x',width - 10)
           .attr('y', height - 200)
           .style('fill','red')

        legend.append('text')
        .attr('x', width - 160)
        .attr('y', height - 189)
        .attr('font-size', '0.70em')
        .attr('fill', 'black')
        .text("Riders with doping allegations")

        legend.append('g')
           .append('rect')
           .attr('height', 15)
           .attr('width', 15)
           .attr('x',width - 10)
           .attr('y', height - 220)
           .style('fill','green')

           legend.append('text')
        .attr('x', width - 160)
        .attr('y', height - 209)
        .attr('font-size', '0.70em')
        .attr('fill', 'black')
        .text("No doping allegations")


        svg.selectAll('circle')
                      .data(obj)
                      .enter()
                      .append('circle')
                      .attr('r', radius)
                      .attr('class', 'dot')
                      .attr('data-xvalue', (d, i) => years[i])
                      .attr('data-yvalue', (d, i) => times[i])
                      .attr('cx', (d,i) => xScale(years[i]) + 40)
                      .attr('cy', (d,i) => yScale(times[i]))
                      .style('fill', (d) => {
                          if(d.Doping === "") {
                            //   No Doping
                            return "green"
                          } else {
                            //   Doping
                            return "red"
                          }
                      })
                      .style('stroke', 'black')
                      .style('stroke-width', '0.5')
                      .on("mouseover", function(d){return tooltip.style("visibility", "visible").attr('data-date', d[0])})
                      .on("mousemove", function(d){return tooltip.style("left", (d3.event.pageX + 10) + "px")
                      .style("top", (d3.event.pageY - 28) + "px").html(() => {
                          if(d.Doping === "") {
                              return `<strong>${d.Name}: ${d.Nationality}</strong><br><span>Year: ${d.Year}, Time: ${d.Time}</span>`
                          } else {
                            return `<strong>${d.Name}: ${d.Nationality}</strong><br><span>Year: ${d.Year}, Time: ${d.Time}</span><br><em>${d.Doping}</em>`
                          }

                      }).attr('data-year', d.Year)})
                      .on("mouseout", function(d){return tooltip.style("visibility", "hidden").attr('data-date', d[0])});

    })
    