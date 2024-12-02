// studentPerformanceChart.js

// Import D3.js
(async function () {
  const margin = { top: 50, right: 80, bottom: 50, left: 80 };
  const width = 400 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;
  const radius = Math.min(width, height) / 2;

  // Load the CSV data
  const data = await d3.csv("data/studentPerformance.csv");

  // Prepare the SVG container
  const svg = d3
    .select("#spider-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr(
      "transform",
      `translate(${width / 2 + margin.left}, ${height / 2 + margin.top})`
    );

  // Performance categories
  const categories = [
    "Score primaire",
    "Score collégial",
    "Score actuel",
    "score en mathématiques",
    "score en langue arabe",
    "score en première langue",
  ];

  // Scale for radius
  const maxValue = 20; // Maximum score (you can adjust as per your data)
  const rScale = d3.scaleLinear().range([0, radius]).domain([0, maxValue]);

  // Number of axes
  const numAxes = categories.length;

  // Radial grid and axes
  const angleSlice = (Math.PI * 2) / numAxes;
  const axisGrid = svg.append("g").attr("class", "axisGrid");

  // Draw radial grid
  const levels = 5; // Number of concentric circles
  Array.from({ length: levels }, (_, i) => i + 1).forEach((level) => {
    axisGrid
      .append("circle")
      .attr("r", (radius / levels) * level)
      .style("fill", "none")
      .style("stroke", "#CDCDCD")
      .style("stroke-dasharray", "3,3");
  });

  // Draw axes
  categories.forEach((category, i) => {
    const angle = angleSlice * i;
    svg
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", rScale(maxValue) * Math.cos(angle - Math.PI / 2))
      .attr("y2", rScale(maxValue) * Math.sin(angle - Math.PI / 2))
      .style("stroke", "gray")
      .style("stroke-width", "1px");

    svg
      .append("text")
      .attr("x", rScale(maxValue + 1) * Math.cos(angle - Math.PI / 2) - 10)
      .attr("y", rScale(maxValue + 1) * Math.sin(angle - Math.PI / 2) + 5)
      .style("font-size", "12px")
      .style("text-anchor", "middle")
      .text(category);
  });

  // Function to draw radar chart
  const drawRadarChart = (student) => {
    // Prepare student-specific data
    const studentData = categories.map((cat) => +student[cat]);

    // Radar path generator
    const radarLine = d3
      .lineRadial()
      .radius((d) => rScale(d))
      .angle((_, i) => i * angleSlice);

    // Remove old data
    svg.selectAll(".radarWrapper").remove();

    // Add radar chart
    const radarWrapper = svg.append("g").attr("class", "radarWrapper");

    radarWrapper
      .append("path")
      .datum(studentData)
      .attr("d", radarLine)
      .style("fill", "rgba(0, 123, 255, 0.5)")
      .style("stroke", "#007BFF")
      .style("stroke-width", "2px");
  };

  // Populate the dropdown
  const dropdown = d3.select("#student-select");
  data.forEach((student, index) => {
    dropdown
      .append("option")
      .attr("value", index)
      .text(`Student ${index + 1}`);
  });

  // Handle dropdown change
  dropdown.on("change", (event) => {
    const selectedIndex = event.target.value;
    drawRadarChart(data[selectedIndex]);
  });

  // Initial chart
  drawRadarChart(data[0]);
})();
