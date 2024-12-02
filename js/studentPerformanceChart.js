function createStudentPerformanceChart(data) {
  // Populate student select dropdown
  const studentSelect = d3.select("#student-select");
  studentSelect
    .selectAll("option")
    .data(data)
    .enter()
    .append("option")
    .attr("value", (d, i) => i)
    .text((d, i) => `Student ${i + 1}`);

  // Initial chart creation
  function createRadarChart(student) {
    // Clear previous chart
    d3.select("#spider-chart").html("");

    // Set up chart dimensions
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    // Performance metrics
    const metrics = [
      { name: "Math", value: +student["score en mathématiques"] },
      { name: "Arabic", value: +student["score en langue arabe"] },
      { name: "Primary", value: +student["Score primaire"] },
      { name: "Collégial", value: +student["Score collégial"] },
      { name: "Current", value: +student["Score actuel"] },
    ];

    // Normalize values to 0-10 scale
    const maxValue = 20;
    metrics.forEach((m) => (m.normalized = (m.value / maxValue) * 10));

    // Create SVG
    const svg = d3
      .select("#spider-chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Radial scales
    const angleSlice = (Math.PI * 2) / metrics.length;
    const rScale = d3.scaleLinear().range([0, radius]).domain([0, 10]);

    // Color scale
    const color = d3
      .scaleOrdinal()
      .range(["#3498db", "#2ecc71", "#e74c3c", "#f39c12", "#9b59b6"]);

    // Create axes
    const axisGrid = svg.append("g");
    const levels = 5;
    for (let level = 0; level < levels; level++) {
      const levelRadius = (radius * level) / levels;
      axisGrid
        .append("circle")
        .attr("r", levelRadius)
        .style("fill", "none")
        .style("stroke", "#ccc")
        .style("stroke-dasharray", "4 2");
    }

    // Axis lines and labels
    const axis = svg
      .selectAll(".axis")
      .data(metrics)
      .enter()
      .append("g")
      .attr("class", "axis");

    axis
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d, i) => rScale(10) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y2", (d, i) => rScale(10) * Math.sin(angleSlice * i - Math.PI / 2))
      .style("stroke", "#ccc")
      .style("stroke-width", "1px");

    axis
      .append("text")
      .attr(
        "x",
        (d, i) => rScale(10 + 1) * Math.cos(angleSlice * i - Math.PI / 2)
      )
      .attr(
        "y",
        (d, i) => rScale(10 + 1) * Math.sin(angleSlice * i - Math.PI / 2)
      )
      .text((d) => d.name)
      .style("font-size", "12px")
      .style("text-anchor", "middle");

    // Radar area
    const radarLine = d3
      .lineRadial()
      .radius((d) => rScale(d.normalized))
      .angle((d, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    // Add polygon
    svg
      .append("path")
      .datum(metrics)
      .attr("d", radarLine)
      .style("fill", "#3498db")
      .style("fill-opacity", 0.3)
      .style("stroke", "#3498db")
      .style("stroke-width", 2);

    // Add data points
    svg
      .selectAll(".radar-point")
      .data(metrics)
      .enter()
      .append("circle")
      .attr("class", "radar-point")
      .attr("r", 5)
      .attr(
        "cx",
        (d, i) => rScale(d.normalized) * Math.cos(angleSlice * i - Math.PI / 2)
      )
      .attr(
        "cy",
        (d, i) => rScale(d.normalized) * Math.sin(angleSlice * i - Math.PI / 2)
      )
      .style("fill", "#3498db");
  }

  // Initial chart for first student
  createRadarChart(data[0]);

  // Update chart on student selection
  studentSelect.on("change", function () {
    const selectedStudent = data[this.value];
    createRadarChart(selectedStudent);
  });
}

// Load and process data
d3.csv("data/data.csv").then(createStudentPerformanceChart);
