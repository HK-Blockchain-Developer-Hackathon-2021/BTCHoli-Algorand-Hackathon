import React, {useEffect, useState} from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';



export function Chart(props) {
  const theme = useTheme();
  const [chartData,setChartData] = useState([]);

  useEffect(()=>{
      const result = props.chartData.map((elem, index)=>{
         return {index, elem}
      })
      setChartData(result);
  },[props])


  return (
    <React.Fragment>
      <Title>Total Asset Worth</Title>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="index" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >Worth ($)
            </Label>
          </YAxis>
          <Line type="monotone" dataKey="elem" stroke={theme.palette.primary.main} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
