import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import data1 from './test1.json';
import data2 from './test2.json';
import data3 from './test3.json';
import data4 from './test4.json';

interface IData {
  amount: number;
  price: number;
}

interface IProps {
  mode: string;
}

const Chart: React.FC<IProps> = ({ mode }) => {
  const chartContainer = useRef(null);
  const [transactionData, setTransactionData] = useState(data3);
  const [reactionData, setReactionData] = useState(data1);

  // transaction
  const transactionProps = {
    width: 800,
    height: 500,
    padding: {
      top: 50,
      bottom: 50,
      left: 50,
      right: 50,
    },
  };

  const transactionScales = {
    scaleX: d3
      .scaleLinear()
      .range([
        0,
        transactionProps.width -
          transactionProps.padding.left -
          transactionProps.padding.right,
      ])
      .domain([0, 300]),

    scaleY: d3
      .scaleLinear()
      .range([
        transactionProps.height -
          transactionProps.padding.top -
          transactionProps.padding.bottom,
        0,
      ])
      .domain([0, 40]),
  };

  const transactionAxes = {
    axisX: d3
      .axisBottom(transactionScales.scaleX)
      .tickValues([50, 100, 150, 200, 250])
      .tickPadding(15)
      .tickSize(0),

    grid: d3
      .axisLeft(transactionScales.scaleY)
      .ticks(5)
      .tickValues([10, 20, 30])
      .tickPadding(15)
      .tickSize(
        0 -
          transactionProps.width +
          transactionProps.padding.left +
          transactionProps.padding.right,
      ),
  };

  const transactionLine = d3
    .line<IData>()
    .x((d: IData) => transactionScales.scaleX(d.amount))
    .y((d: IData) => transactionScales.scaleY(d.price))
    .curve(d3.curveCardinal);

  //  reaction
  const reactionProps = {
    width: 800,
    height: 500,
    barWidth: 30,
    padding: {
      top: 100,
      bottom: 50,
      left: 50,
      right: 75,
    },
  };

  const reactionScales = {
    scaleX: d3
      .scaleLinear()
      .range([
        0,
        reactionProps.width -
          1 * reactionProps.barWidth -
          reactionProps.padding.left -
          reactionProps.padding.right,
      ])
      .domain([7, 19]),

    scaleY: d3
      .scaleLinear()
      .range([
        0,
        reactionProps.height -
          reactionProps.padding.top -
          reactionProps.padding.bottom,
      ])
      .domain([0, 10]),

    scaleAxisY: d3
      .scaleLinear()
      .range([
        reactionProps.height -
          reactionProps.padding.top -
          reactionProps.padding.bottom,
        0,
      ])
      .domain([0, 10]),
  };

  const reactionAxes = {
    axisX: d3
      .axisBottom(reactionScales.scaleX)
      .tickValues([7, 9, 11, 13, 15, 17, 19])
      .tickSize(0)
      .tickPadding(15),

    axisY: d3
      .axisLeft(reactionScales.scaleAxisY)
      .tickValues([2, 4, 6, 8, 10])
      .tickSize(0)
      .tickPadding(15),
  };

  // handle change data
  const changeData = () => {
    if (mode === '需量反應') {
      if (reactionData === data1) {
        setReactionData(data2);
      } else {
        setReactionData(data1);
      }
    } else if (transactionData === data3) {
      setTransactionData(data4);
    } else {
      setTransactionData(data3);
    }
  };

  useEffect(() => {
    // append svg
    const svg = d3.select(chartContainer.current);

    if (mode === '需量反應') {
      svg
        .attr('width', reactionProps.width)
        .attr('height', reactionProps.height)
        .style('border-radius', '10px')
        .style('background-color', 'white');

      // append bar
      svg
        .selectAll('rect')
        .data(reactionData)
        .enter()
        .append('rect')
        .attr(
          'x',
          (d) => reactionScales.scaleX(d.time) + reactionProps.padding.left,
        )
        .attr(
          'y',
          (d) =>
            reactionProps.height -
            reactionScales.scaleY(d.DR) -
            reactionProps.padding.bottom,
        )
        .attr('width', reactionProps.barWidth)
        .attr('height', (d) => reactionScales.scaleY(d.DR))
        .attr('fill', (d) => {
          if (d.time > 12) return '#2d3161';
          return '#d8d8d8';
        });

      // append axis
      svg
        .append('g')
        .call(reactionAxes.axisX)
        .call((g) => g.select('.domain').attr('stroke', '#f1f2f1'))
        .attr('font-size', '15px')
        .attr('color', '#707070')
        .attr(
          'transform',
          `translate(${
            reactionProps.barWidth / 2 + reactionProps.padding.left
          },${reactionProps.height - reactionProps.padding.bottom})`,
        );
      svg
        .append('g')
        .call(reactionAxes.axisY)
        .call((g) => g.select('.domain').remove())
        .attr('font-size', '15px')
        .attr('color', '#707070')
        .attr(
          'transform',
          `translate(${reactionProps.padding.left},${reactionProps.padding.top})`,
        );

      // append axis title
      svg
        .append('text')
        .attr('text-anchor', 'end')
        .attr('x', reactionProps.width - reactionProps.padding.right / 3.5)
        .attr('y', reactionProps.height - reactionProps.padding.bottom / 2)
        .attr('fill', '#707070')
        .attr('font-size', '20px')
        .text('時間');
      svg
        .append('text')
        .attr('text-anchor', 'end')
        .attr('x', reactionProps.padding.left * 1.1)
        .attr('y', reactionProps.padding.top / 2)
        .attr('fill', '#707070')
        .attr('font-size', '20px')
        .text('DR量');
      svg
        .append('text')
        .attr('text-anchor', 'end')
        .attr('x', reactionProps.width - reactionProps.padding.right / 1.5)
        .attr('y', reactionProps.padding.top / 2)
        .attr('fill', '#707070')
        .attr('font-size', '20px')
        .attr('font-weight', 'bold')
        .text('每小時DR量預覽');
    } else if (mode === '綠能交易') {
      // bisect
      const bisectX = d3.bisector((d: IData) => d.amount).left;

      // append tooltip-canvas
      const tooltipCvs = svg
        .append('rect')
        .attr(
          'width',
          transactionProps.width -
            2 * transactionProps.padding.right -
            2 * transactionProps.padding.left -
            40,
        )
        .attr(
          'height',
          transactionProps.height -
            transactionProps.padding.top -
            transactionProps.padding.bottom,
        )
        .attr(
          'x',
          transactionProps.padding.right + transactionProps.padding.left + 20,
        )
        .attr('y', transactionProps.padding.top)
        .attr('opacity', 0);

      // tooltip-rect
      const tooltipRect = svg
        .append('rect')
        .attr('width', 115)
        .attr('height', 70)
        .attr('fill', '#e5e5e5')
        .style('display', 'none');

      // tooltip-line
      const tooltipLine = svg
        .append('line')
        .attr('stroke', '#717171')
        .attr('stroke-width', '1px')
        .style('display', 'none');

      // tooltip-text-title
      const tooltipTitleBuy = svg
        .append('text')
        .text('text')
        .style('display', 'none');

      const tooltipTitleSell = svg
        .append('text')
        .text('text')
        .style('display', 'none');

      // tooltip-text-data
      const tooltipDataBuy = svg
        .append('text')
        .text('text')
        .style('display', 'none');

      const tooltipDataSell = svg
        .append('text')
        .text('text')
        .style('display', 'none');

      // tooltip-circle
      const tooltipCircleBuy = svg
        .append('circle')
        .attr('fill', '#717171')
        .attr('r', 6)
        .attr('display', 'none');

      const tooltipCircleSell = svg
        .append('circle')
        .attr('fill', '#717171')
        .attr('r', 6)
        .style('display', 'none');

      // append path of dataBuy
      svg
        .append('path')
        .datum(transactionData.dataBuy)
        .attr('d', transactionLine)
        .attr('y', 0)
        .attr('stroke', '#d32f2f')
        .attr('stroke-width', '3px')
        .attr('fill', 'none')
        .attr(
          'transform',
          `translate(${transactionProps.padding.left}, ${transactionProps.padding.top})`,
        );

      // append path of dataSell
      svg
        .append('path')
        .datum(transactionData.dataSell)
        .attr('d', transactionLine)
        .attr('y', 0)
        .attr('stroke', '#2e7e32')
        .attr('stroke-width', '3px')
        .attr('fill', 'none')
        .attr(
          'transform',
          `translate(${transactionProps.padding.left}, ${transactionProps.padding.top})`,
        );

      // append axis
      svg
        .append('g')
        .call(transactionAxes.axisX)
        /* .call((g) => g.select('.domain').remove()) */
        .attr('color', '#707070')
        .attr('stroke-width', '0.5px')
        .attr('font-size', '15px')
        .attr(
          'transform',
          `translate(${transactionProps.padding.left}, ${
            transactionProps.height - transactionProps.padding.bottom
          })`,
        );

      // append grid
      svg
        .append('g')
        .call(transactionAxes.grid)
        .call((g) => g.select('.domain').remove())
        /* .call((g) => g.select('.tick:last-of-type').remove()) */
        .call((g) => g.selectAll('.tick').attr('color', 'gray'))
        .attr('stroke-width', '0.5px')
        .attr('font-size', '15px')
        .attr('fill', 'none')
        .attr(
          'transform',
          `translate(${transactionProps.padding.left}, ${transactionProps.padding.top})`,
        );

      // append axis title
      svg
        .append('text')
        .attr('text-anchor', 'end')
        .attr('x', transactionProps.padding.left)
        .attr('y', transactionProps.padding.top / 1.5)
        .attr('fill', '#707070')
        .attr('font-size', '20px')
        .text('單價');
      svg
        .append('text')
        .attr('text-anchor', 'end')
        .attr('x', transactionProps.width - transactionProps.padding.right / 2)
        .attr(
          'y',
          transactionProps.height - transactionProps.padding.bottom / 2,
        )
        .attr('fill', '#707070')
        .attr('font-size', '20px')
        .text('量');

      // append legend
      svg
        .append('circle')
        .attr(
          'cx',
          transactionProps.width - 2.5 * transactionProps.padding.right,
        )
        .attr('cy', transactionProps.padding.top / 1.7)
        .attr('r', 7)
        .attr('fill', '#d32f2f');
      svg
        .append('circle')
        .attr(
          'cx',
          transactionProps.width - 1.3 * transactionProps.padding.right,
        )
        .attr('cy', transactionProps.padding.top / 1.7)
        .attr('r', 7)
        .attr('fill', '#2e7d32');
      svg
        .append('text')
        .attr('text-anchor', 'end')
        .attr(
          'x',
          transactionProps.width - 1.8 * transactionProps.padding.right,
        )
        .attr('y', transactionProps.padding.top / 1.5)
        .attr('fill', '#707070')
        .attr('font-size', '20px')
        .text('買');
      svg
        .append('text')
        .attr('text-anchor', 'end')
        .attr(
          'x',
          transactionProps.width - 0.6 * transactionProps.padding.right,
        )
        .attr('y', transactionProps.padding.top / 1.5)
        .attr('fill', '#707070')
        .attr('font-size', '20px')
        .text('賣');

      // append tooltip
      tooltipCvs
        .raise()
        .on('mouseover', () => {
          // tooltip-line
          tooltipLine.style('display', 'block').raise();

          // tooltip-circle
          tooltipCircleBuy.style('display', 'block').raise();
          tooltipCircleSell.style('display', 'block').raise();

          // tooltip-rect
          tooltipRect.style('display', 'block').raise();

          // tooltip-title
          tooltipTitleBuy.style('display', 'block').raise();
          tooltipTitleSell.style('display', 'block').raise();

          // tooltip-data
          tooltipDataBuy.style('display', 'block').raise();
          tooltipDataSell.style('display', 'block').raise();
        })
        .on('mousemove', () => {
          // tooltip-rect
          tooltipRect
            .attr('x', d3.event.pageX - 225)
            .attr('y', d3.event.pageY - 100);

          // tooltip-line
          tooltipLine
            .attr(
              'x1',
              transactionProps.padding.right +
                transactionScales.scaleX(
                  transactionData.dataBuy[
                    bisectX(
                      transactionData.dataBuy,
                      transactionScales.scaleX.invert(d3.event.pageX - 375),
                    )
                  ].amount,
                ),
            )
            .attr(
              'y1',
              transactionProps.padding.top +
                Math.min(
                  transactionScales.scaleY(
                    transactionData.dataBuy[
                      bisectX(
                        transactionData.dataBuy,
                        transactionScales.scaleX.invert(d3.event.pageX - 375),
                      )
                    ].price,
                  ),
                  transactionScales.scaleY(
                    transactionData.dataSell[
                      bisectX(
                        transactionData.dataSell,
                        transactionScales.scaleX.invert(d3.event.pageX - 375),
                      )
                    ].price,
                  ),
                ),
            )
            .attr(
              'x2',
              transactionProps.padding.right +
                transactionScales.scaleX(
                  transactionData.dataBuy[
                    bisectX(
                      transactionData.dataBuy,
                      transactionScales.scaleX.invert(d3.event.pageX - 375),
                    )
                  ].amount,
                ),
            )
            .attr(
              'y2',
              transactionProps.height - transactionProps.padding.bottom,
            );

          // tooltip-title-buy
          tooltipTitleBuy
            .text('買')
            .attr('x', d3.event.pageX - 215)
            .attr('y', d3.event.pageY - 75);

          // tooltip-title-buy
          tooltipTitleSell
            .text('賣')
            .attr('x', d3.event.pageX - 215)
            .attr('y', d3.event.pageY - 45);

          // tooltip-data-buy
          tooltipDataBuy
            .text(
              `(${
                transactionData.dataBuy[
                  bisectX(
                    transactionData.dataBuy,
                    transactionScales.scaleX.invert(d3.event.pageX - 375),
                  )
                ].amount
              }, ${
                transactionData.dataBuy[
                  bisectX(
                    transactionData.dataBuy,
                    transactionScales.scaleX.invert(d3.event.pageX - 375),
                  )
                ].price
              })`,
            )
            .attr('text-anchor', 'end')
            .attr('x', d3.event.pageX - 120)
            .attr('y', d3.event.pageY - 76);

          // tooltip-data-sell
          tooltipDataSell
            .text(
              `(${
                transactionData.dataSell[
                  bisectX(
                    transactionData.dataSell,
                    transactionScales.scaleX.invert(d3.event.pageX - 375),
                  )
                ].amount
              }, ${
                transactionData.dataSell[
                  bisectX(
                    transactionData.dataSell,
                    transactionScales.scaleX.invert(d3.event.pageX - 375),
                  )
                ].price
              })`,
            )
            .attr('text-anchor', 'end')
            .attr('x', d3.event.pageX - 120)
            .attr('y', d3.event.pageY - 46);

          // tooltip-circle-buy
          tooltipCircleBuy
            .attr(
              'cx',
              transactionProps.padding.right +
                transactionScales.scaleX(
                  transactionData.dataBuy[
                    bisectX(
                      transactionData.dataBuy,
                      transactionScales.scaleX.invert(d3.event.pageX - 375),
                    )
                  ].amount,
                ),
            )
            .attr(
              'cy',
              transactionProps.padding.top +
                transactionScales.scaleY(
                  transactionData.dataBuy[
                    bisectX(
                      transactionData.dataBuy,
                      transactionScales.scaleX.invert(d3.event.pageX - 375),
                    )
                  ].price,
                ),
            );

          // tooltip-circle-sell
          tooltipCircleSell
            .attr(
              'cx',
              transactionProps.padding.right +
                transactionScales.scaleX(
                  transactionData.dataSell[
                    bisectX(
                      transactionData.dataSell,
                      transactionScales.scaleX.invert(d3.event.pageX - 375),
                    )
                  ].amount,
                ),
            )
            .attr(
              'cy',
              transactionProps.padding.top +
                transactionScales.scaleY(
                  transactionData.dataSell[
                    bisectX(
                      transactionData.dataSell,
                      transactionScales.scaleX.invert(d3.event.pageX - 375),
                    )
                  ].price,
                ),
            );
        })
        .on('mouseout', () => {
          // tooltip-line
          tooltipLine.style('display', 'none');

          // tooltip-circle
          tooltipCircleBuy.style('display', 'none');
          tooltipCircleSell.style('display', 'none');

          // tooltip-rect
          tooltipRect.style('display', 'none');

          // tooltip-title
          tooltipTitleBuy.style('display', 'none');
          tooltipTitleSell.style('display', 'none');

          // tooltip-data
          tooltipDataBuy.style('display', 'none');
          tooltipDataSell.style('display', 'none');
        });
    }

    // clear effect
    return () => {
      svg.selectAll('*').remove();
    };
  });

  return (
    <div>
      <svg className="chart" ref={chartContainer} />
      <button type="button" onClick={() => changeData()}>
        Change Data
      </button>
    </div>
  );
};

export default Chart;