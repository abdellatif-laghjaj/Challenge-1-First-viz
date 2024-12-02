function createSchoolTypeAreaDistribution(data) {
  // Clear previous chart
  d3.select("#schoolTypeAreaDistribution").html("");

  // Set up chart dimensions
  const width = 500;
  const height = 400;
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
    .attr("width", width)
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

  const outerArc = d3
    .arc()
    .innerRadius(radius * 0.6)
    .outerRadius(radius * 0.6);

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

  // Add labels
  svg
    .selectAll("text")
    .data(pieData)
    .enter()
    .append("text")
    .attr("transform", (d) => `translate(${outerArc.centroid(d)})`)
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .text((d) => d.data.key);

  // Title
  svg
    .append("text")
    .attr("x", 0)
    .attr("y", -height / 2 + margin)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("School Type and Area Distribution");
}

// Load and process data
d3.csv("data/data.csv").then(createSchoolTypeAreaDistribution);
