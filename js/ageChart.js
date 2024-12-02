// Age Distribution Chart
function createAgeDistribution(data) {
  // Clear previous chart
  d3.select("#ageDistribution").html("");

  // Set up chart dimensions
  const margin = { top: 40, right: 30, bottom: 70, left: 60 };
  const width = 500 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Parse dates and create age groups
  const parseDate = d3.timeParse("%d/%m/%Y");
  const currentYear = new Date().getFullYear();

  data.forEach((d) => {
    const birthDate = parseDate(d.Age);
    d.age = currentYear - birthDate.getFullYear();
  });

  // Create age groups
  const ageGroups = d3.group(data, (d) => {
    if (d.age < 15) return "< 15";
    if (d.age < 18) return "15-17";
    if (d.age < 21) return "18-20";
    return "21+";
  });

  // Prepare data for chart
  const groupedData = Array.from(ageGroups, ([key, value]) => ({
    ageGroup: key,
    count: value.length,
  }));

  // Create SVG
  const svg = d3
    .select("#ageDistribution")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Color scale
  const colorScale = d3
    .scaleOrdinal()
    .domain(groupedData.map((d) => d.ageGroup))
    .range(["#3498db", "#2ecc71", "#e74c3c", "#f39c12"]);

  // X Scale
  const x = d3
    .scaleBand()
    .range([0, width])
    .domain(groupedData.map((d) => d.ageGroup))
    .padding(0.1);

  // Y Scale
  const y = d3
    .scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(groupedData, (d) => d.count)]);

  // X Axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("text-anchor", "middle");

  // Y Axis
  svg.append("g").call(d3.axisLeft(y));

  // Bars
  svg
    .selectAll(".bar")
    .data(groupedData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d.ageGroup))
    .attr("width", x.bandwidth())
    .attr("y", (d) => y(d.count))
    .attr("height", (d) => height - y(d.count))
    .attr("fill", (d) => colorScale(d.ageGroup))
    .attr("opacity", 0.7);

  // Title
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", -20)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("Student Age Distribution");

  // X Axis Label
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + 40)
    .attr("text-anchor", "middle")
    .text("Age Group");

  // Y Axis Label
  svg
    .append("text")
    .attr("x", -height / 2)
    .attr("y", -40)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text("Count");
}

// Load and process data
d3.csv("data/data.csv").then(createAgeDistribution);
