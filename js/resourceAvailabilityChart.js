const data = [
  {
    type: "Public",
    zone: "Rurale",
    Electricity: "oui",
    Water: "oui",
    PC: "non",
    Books: "oui",
  },
  {
    type: "Privé",
    zone: "Urbaine",
    Electricity: "oui",
    Water: "oui",
    PC: "oui",
    Books: "oui",
  },
  {
    type: "Public",
    zone: "Urbaine",
    Electricity: "oui",
    Water: "oui",
    PC: "oui",
    Books: "oui",
  },
  {
    type: "Privé",
    zone: "Rurale",
    Electricity: "oui",
    Water: "oui",
    PC: "oui",
    Books: "oui",
  },
  {
    type: "Public",
    zone: "Urbaine",
    Electricity: "oui",
    Water: "oui",
    PC: "oui",
    Books: "oui",
  },
  {
    type: "Privé",
    zone: "Rurale",
    Electricity: "oui",
    Water: "oui",
    PC: "oui",
    Books: "oui",
  },
  {
    type: "Public",
    zone: "Urbaine",
    Electricity: "oui",
    Water: "oui",
    PC: "oui",
    Books: "oui",
  },
  {
    type: "Privé",
    zone: "Rurale",
    Electricity: "oui",
    Water: "oui",
    PC: "oui",
    Books: "oui",
  },
  {
    type: "Public",
    zone: "Urbaine",
    Electricity: "oui",
    Water: "oui",
    PC: "oui",
    Books: "oui",
  },
  {
    type: "Privé",
    zone: "Rurale",
    Electricity: "oui",
    Water: "oui",
    PC: "oui",
    Books: "oui",
  },
  {
    type: "Public",
    zone: "Urbaine",
    Electricity: "oui",
    Water: "oui",
    PC: "oui",
    Books: "oui",
  },
  {
    type: "Privé",
    zone: "Rurale",
    Electricity: "oui",
    Water: "oui",
    PC: "oui",
    Books: "oui",
  },
  {
    type: "Public",
    zone: "Urbaine",
    Electricity: "oui",
    Water: "oui",
    PC: "oui",
    Books: "oui",
  },
];

// Process data to count availability for each resource
const resources = ["Electricity", "Water", "PC", "Books"];
const processedData = resources.map((resource) => {
  return {
    resource,
    Public: data.filter((d) => d.type === "Public" && d[resource] === "oui")
      .length,
    Private: data.filter((d) => d.type === "Privé" && d[resource] === "oui")
      .length,
  };
});

// Chart dimensions
const margin = { top: 50, right: 72, bottom: 50, left: 60 };
const width = 820 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create SVG
const svg = d3
  .select("#resourceAvailability")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Scales
const x0 = d3
  .scaleBand()
  .domain(processedData.map((d) => d.resource))
  .range([0, width])
  .padding(0.2);

const x1 = d3
  .scaleBand()
  .domain(["Public", "Private"])
  .range([0, x0.bandwidth()])
  .padding(0.1);

const y = d3
  .scaleLinear()
  .domain([0, d3.max(processedData, (d) => Math.max(d.Public, d.Private))])
  .nice()
  .range([height, 0]);

const color = d3
  .scaleOrdinal()
  .domain(["Public", "Private"])
  .range(["#1f77b4", "#ff7f0e"]);

// Axes
svg
  .append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x0));

svg.append("g").attr("class", "y-axis").call(d3.axisLeft(y));

// Add bars
svg
  .append("g")
  .selectAll("g")
  .data(processedData)
  .join("g")
  .attr("transform", (d) => `translate(${x0(d.resource)}, 0)`)
  .selectAll("rect")
  .data((d) => ["Public", "Private"].map((key) => ({ key, value: d[key] })))
  .join("rect")
  .attr("class", "bar")
  .attr("x", (d) => x1(d.key))
  .attr("y", (d) => y(d.value))
  .attr("width", x1.bandwidth())
  .attr("height", (d) => height - y(d.value))
  .attr("fill", (d) => color(d.key));

// Add legend
const legend = svg
  .append("g")
  .attr("transform", `translate(${width - 100}, -20)`);

legend
  .selectAll("rect")
  .data(["Public", "Private"])
  .join("rect")
  .attr("x", (d, i) => i * 100)
  .attr("y", 0)
  .attr("width", 20)
  .attr("height", 20)
  .attr("fill", color);

legend
  .selectAll("text")
  .data(["Public", "Private"])
  .join("text")
  .attr("x", (d, i) => i * 100 + 25)
  .attr("y", 15)
  .text((d) => d)
  .style("font-size", "14px");

// X-axis label
svg
  .append("text")
  .attr("x", width / 2)
  .attr("y", height + 40)
  .attr("text-anchor", "middle")
  .text("Resources");

// Y-axis label
svg
  .append("text")
  .attr("x", -height / 2)
  .attr("y", -40)
  .attr("transform", "rotate(-90)")
  .attr("text-anchor", "middle")
  .text("Number of Schools");
