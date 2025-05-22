import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { FaPlay, FaPause } from "react-icons/fa";

function BarChartRace() {
  const svgRef = useRef();
  const [data, setData] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true); // สำหรับควบคุมการเล่น
  const intervalRef = useRef(null); // เก็บ interval ID
  const currentYearIndex = useRef(0); // เก็บ index ของปีปัจจุบัน

  let grouped = null;
  let years = [];

  // ⏮️ ฟังก์ชันเรนเดอร์กราฟตามปี
  const renderYear = (year) => {
    if (!grouped || !years.length) return;

    const svg = d3.select(svgRef.current);
    const width = 1200;
    const height = 700;
    const margin = { top: 20, right: 80, bottom: 70, left: 80 };

    const yearData = grouped.get(year)
      .filter(d => d.country !== "World")
      .sort((a, b) => b.population - a.population)
      .slice(0, 12);

    const total = d3.sum(yearData, d => d.population);

    const x = d3.scaleLinear()
      .domain([0, d3.max(yearData, d => d.population)])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleBand()
      .domain(yearData.map(d => d.country))
      .range([margin.top + 40, height - margin.bottom])
      .padding(0.1);

    svg.selectAll(".x-axis").remove();
    svg.selectAll(".y-axis").remove();

    svg.append("g").attr("class", "x-axis")
      .attr("transform", `translate(0,${margin.top + 40})`)
      .call(d3.axisTop(x).ticks(5).tickFormat(d3.format(",")))
      .call(g => g.select(".domain").remove());

    svg.append("g").attr("class", "y-axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickSizeOuter(0))
      .selectAll("text")
      .attr("font-size", 18)
      .attr("fill", "#4c4c4c");

    const yearScale = d3.scaleBand()
      .domain(years)
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const triangle = svg.selectAll("text.year-indicator").data([year]);
    triangle.join(
      enter => enter.append("text")
        .attr("class", "year-indicator")
        .attr("x", yearScale(year) + yearScale.bandwidth() / 2)
        .attr("y", height - margin.bottom + 15)
        .attr("text-anchor", "middle")
        .attr("font-size", 14)
        .attr("fill", "gray")
        .text("▼"),
      update => update
        .transition().duration(800)
        .attr("x", yearScale(year) + yearScale.bandwidth() / 2)
        .text("▼")
    );

    const bars = svg.selectAll("rect.bar").data(yearData, d => d.country);

    bars.exit()
      .transition().duration(500)
      .attr("width", 0)
      .remove();

    bars
      .transition().duration(800)
      .attr("y", d => y(d.country))
      .attr("width", d => x(d.population) - margin.left)
      .attr("height", y.bandwidth());

    bars.enter().append("rect")
      .attr("class", "bar")
      .attr("y", d => y(d.country))
      .attr("x", margin.left)
      .attr("height", y.bandwidth())
      .attr("width", 0)
      .attr("fill", d => d.color)
      .transition().duration(800)
      .attr("width", d => x(d.population) - margin.left);

    const labels = svg.selectAll("text.label").data(yearData, d => d.country);

    labels.exit()
      .transition().duration(500)
      .attr("x", margin.left)
      .remove();

    labels
      .transition().duration(800)
      .attr("y", d => y(d.country) + y.bandwidth() / 2 + 5)
      .attr("x", d => {
        const pos = x(d.population) + 8;
        return pos > width - margin.right - 80 ? x(d.population) - 80 : pos;
      })
      .attr("text-anchor", d => {
        const pos = x(d.population) + 8;
        return pos > width - margin.right - 80 ? "end" : "start";
      })
      .attr("font-size", 14)
      .text(d => d3.format(",")(d.population));

    labels.enter()
      .append("text")
      .attr("class", "label")
      .attr("y", d => y(d.country) + y.bandwidth() / 2 + 5)
      .attr("x", margin.left)
      .attr("fill", "#000")
      .attr("font-size", 14)
      .text(d => d3.format(",")(d.population))
      .transition().duration(800)
      .attr("x", d => {
        const pos = x(d.population) + 8;
        return pos > width - margin.right - 80 ? x(d.population) - 80 : pos;
      })
      .attr("text-anchor", d => {
        const pos = x(d.population) + 8;
        return pos > width - margin.right - 80 ? "end" : "start";
      });

    svg.selectAll("text.year").data([year]).join(
      enter => enter.append("text")
        .attr("class", "year")
        .attr("x", width - margin.right)
        .attr("y", margin.top + 520)
        .attr("font-size", 50)
        .attr("font-weight", "bold")
        .attr("fill", "#696969")
        .attr("text-anchor", "end")
        .text(year),
      update => update.transition().duration(600).text(year)
    );

    svg.selectAll("text.total").data([total]).join(
      enter => enter.append("text")
        .attr("class", "total")
        .attr("x", width - margin.right)
        .attr("y", margin.top + 550)
        .attr("font-size", 18)
        .attr("fill", "#696969")
        .attr("text-anchor", "end")
        .text(`Total: ${d3.format(",")(total)}`),
      update => update.transition().duration(800)
        .text(`Total: ${d3.format(",")(total)}`)
    );

    // ธง
    const flags = svg.selectAll("image.flag").data(yearData, d => d.country);

    flags.exit().remove();

    flags
      .transition().duration(600)
      .attr("x", margin.left + 10)
      .attr("y", d => y(d.country))
      .attr("width", y.bandwidth())
      .attr("height", y.bandwidth());

    flags.enter()
      .append("svg:image")
      .attr("class", "flag")
      .attr("xlink:href", d => d.flag)
      .attr("x", margin.left)
      .attr("y", d => y(d.country))
      .attr("width", y.bandwidth())
      .attr("height", y.bandwidth());

  };

  // โหลดข้อมูลและเริ่มเล่นกราฟ
  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3000/api/population").then(res => res.json()),
      fetch("http://localhost:3000/api/continentcolor").then(res => res.json()),
      fetch("http://localhost:3000/api/flags").then(res => res.json())
    ]).then(([populationData, continentData, flagData]) => {
      const continentMap = {};
      continentData.forEach(d => {
        continentMap[d.country] = { continent: d.continent, color: d.color };
      });

      const flagMap = {};
      flagData.forEach(d => {
        flagMap[d.country] = d.flagUrl;
        console.log("Flag Map:", flagMap);
      });

      const merged = populationData.map(d => ({
        country: d["Country name"],
        year: +d["Year"],
        population: +d["Population"],
        continent: continentMap[d["Country name"]]?.continent || "Unknown",
        color: continentMap[d["Country name"]]?.color || "#999999",
        flag: flagMap[d["Country name"]] || "default.png"
      }));

      setData(merged);
    });
  }, []);

  // ควบคุม animation ตาม isPlaying
  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 1200;
    const height = 700;
    const margin = { top: 20, right: 80, bottom: 70, left: 80 };

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    grouped = d3.group(data, d => d.year);
    years = Array.from(grouped.keys()).sort((a, b) => a - b);

    const yearScale = d3.scaleBand()
      .domain(years)
      .range([margin.left, width - margin.right])
      .padding(0.1);

    svg.append("g")
      .attr("class", "year-axis")
      .attr("transform", `translate(0,${height - margin.bottom + 15})`)
      .call(
        d3.axisBottom(yearScale)
          .tickValues(years)
          .tickFormat(d => (d % 5 === 0 ? d : ""))
      )
      .call(g => g.select(".domain").remove());

    // แสดงปีล่าสุด (จาก currentYearIndex)
    renderYear(years[currentYearIndex.current]);

    if (intervalRef.current) clearInterval(intervalRef.current);

    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        currentYearIndex.current = (currentYearIndex.current + 1) % years.length;
        renderYear(years[currentYearIndex.current]);
      }, 800);
    }

    return () => clearInterval(intervalRef.current);
  }, [data, isPlaying]);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg ref={svgRef} width="100%" height="700"></svg>

      {/*ปุ่ม Play/Pause */}
      {data.length > 0 && (
        <div style={{ position: "absolute", right: "80px", bottom: "40px" }}>
          <button
            onClick={() => setIsPlaying(prev => !prev)}
            style={{
              // marginRight: "10px",
              padding: "16px",
              fontSize: "25px",
              background: isPlaying ? "#ff6666" : "#66cc66",
              color: "#fff",
              border: "none",
              borderRadius: "50px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
        </div>
      )}
    </div>
  );
}

export default BarChartRace;
