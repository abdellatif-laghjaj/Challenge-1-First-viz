function createSchoolTypeAreaDistribution(data) {
  // Clear previous chart
  d3.select("#schoolTypeAreaDistribution").html("");

  // Set up chart dimensions
  const margin = { top: 40, right: 30, bottom: 70, left: 60 };
  const width = 500 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Group data by School Type and Area
  const groupedData = d3.rollup(
    data,
    (v) => v.length,
    (d) => `${d["Public / Privé"]}-${d.Zone}`
  );

  // Convert grouped data to array
  const chartData = Array.from(groupedData, ([key, count]) => {
    const [schoolType, area] = key.split("-");
    return { schoolType, area, count };
  });

  // Create SVG
  const svg = d3
    .select("#schoolTypeAreaDistribution")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Color scale
  const colorScale = d3
    .scaleOrdinal()
    .domain(chartData.map((d) => d.schoolType + "-" + d.area))
    .range(["#3498db", "#2ecc71", "#e74c3c", "#f39c12"]);

  // X Scale
  const x = d3
    .scaleBand()
    .range([0, width])
    .domain(chartData.map((d) => d.schoolType + "-" + d.area))
    .padding(0.1);

  // Y Scale
  const y = d3
    .scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(chartData, (d) => d.count)]);

  // X Axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("text-anchor", "middle")
    .attr("transform", "rotate(-45)");

  // Y Axis
  svg.append("g").call(d3.axisLeft(y));

  // Bars
  svg
    .selectAll(".bar")
    .data(chartData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d.schoolType + "-" + d.area))
    .attr("width", x.bandwidth())
    .attr("y", (d) => y(d.count))
    .attr("height", (d) => height - y(d.count))
    .attr("fill", (d) => colorScale(d.schoolType + "-" + d.area))
    .attr("opacity", 0.7);

  // Title
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", -20)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("School Type and Area Distribution");
}

// Load and process data
d3.csv("data/data.csv").then(createSchoolTypeAreaDistribution);
