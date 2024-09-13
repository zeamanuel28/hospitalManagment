'use client'
import React from 'react'
import {Line} from 'react-chartjs-2'
import {Chart as ChartJs} from 'chart.js/auto'

const LineChart = ({lineData,options}) => {
  return <Line data={lineData} options={options}/>
}

export default LineChart