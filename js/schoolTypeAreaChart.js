function createSchoolTypeAreaDistribution(data) {
  // Clear previous chart
  d3.select("#schoolTypeAreaDistribution").html("");

  // Set up chart dimensions
  const width = 400;
  const height = 300;
  const margin = 40;

  // Radius
  const radius = Math.min(width, height) / 2 - margin;

  // Group data by School Type and Area
  const groupedData = d3.rollup(
    data,
    (v) => v.length,
    (d) => `${d["Public / Privé"]}-${d.Zone}`
  );

  // Convert grouped data to array
  const chartData = Array.from(groupedData, ([key, count]) => ({
    key,
    count,
  }));

  // Color scale
  const colorScale = d3
    .scaleOrdinal()
    .domain(chartData.map((d) => d.key))
    .range(d3.schemeCategory10);

  // Create SVG
  const svg = d3
    .select("#schoolTypeAreaDistribution")
    .append("svg")
    .attr("width", width + 200) // Extra width for the legend
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  // Create pie generator
  const pie = d3
    .pie()
    .value((d) => d.count)
    .sort(null);

  const pieData = pie(chartData);

  // Create arc generator
  const arc = d3
    .arc()
    .innerRadius(radius * 0.5) // Inner radius for donut effect
    .outerRadius(radius);

  // Add slices
  svg
    .selectAll("path")
    .data(pieData)
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", (d) => colorScale(d.data.key))
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 0.8);

  // Title
  svg
    .append("text")
    .attr("x", 0)
    .attr("y", -height / 2 + margin)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("School Type and Area Distribution");

  // Add legend
  const legend = d3
    .select("#schoolTypeAreaDistribution")
    .select("svg")
    .append("g")
    .attr(
      "transform",
      `translate(${width + 20}, ${height / 2 - (chartData.length * 10) / 2})`
    ); // Place legend to the right

  legend
    .selectAll(".legend-item")
    .data(chartData)
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform", (d, i) => `translate(0, ${i * 20})`); // Space each legend item vertically

  // Add colored squares to the legend
  legend
    .selectAll(".legend-item")
    .append("rect")
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", (d) => colorScale(d.key));

  // Add labels to the legend
  legend
    .selectAll(".legend-item")
    .append("text")
    .attr("x", 20)
    .attr("y", 12)
    .style("font-size", "12px")
    .text((d) => d.key);
}

// Load and process data
d3.csv("data/data.csv").then(createSchoolTypeAreaDistribution);
