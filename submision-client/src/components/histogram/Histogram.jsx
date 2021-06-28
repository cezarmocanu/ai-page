import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';
import './Histogram.scss';

function mapRange(value, min1,max1,min2, max2){
    return min2 + ((max2 - min2) / (max1 - min1)) * (value - min1);
}

function Histogram({data, colors}) {
    const figureRef = useRef();

    

    const renderFigure = () => {
        
        const { current: canvas } = figureRef;
        const { clientWidth: width, clientHeight: height } = canvas;
        canvas.innerHTML = "";

        const svg = d3.select(canvas).append('svg');

        let maxValue = data[0];
 
        for (let i = 1; i < data.length; i++) {
            if (maxValue < data[i]) {
                maxValue = data[i];
            }
        }

        const barWidth = width / data.length * 0.8;
        
        // const getColor = d3.scaleLinear().domain([0,maxValue]).range(["#29b0ff", '#FAC05E']);

        svg
            .selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr('class', 'histogram-bar')
            .attr("x", (d, i) => i * (1.2 * barWidth) + 0.1 * barWidth)
            .attr("rx", 15)
            .attr("ry", 15)
            .attr("y", maxValue === 0 ? height - 0.1 * height : (d, i) => height - mapRange(d, 0, maxValue, 0.1 * height, height))
            .attr("width", barWidth)
            .attr("height", (d, i) => maxValue === 0 ? 0.1*height :  mapRange(d, 0, maxValue, 0.1 * height, height))
            .attr("fill", colors.length <= 0 ? '#f00' : (d,i) => colors[i]);



        

        // svg.selectAll("rect").data(data).enter().append("rect")

        
    };

    useEffect(()=> {
        renderFigure();
    },[data, colors]);

    return <div className='histogram' ref={figureRef}></div>;
};

export {Histogram};

