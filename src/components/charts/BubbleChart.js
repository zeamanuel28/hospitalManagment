'use client'
import React from 'react'
import {Doughnut} from 'react-chartjs-2'
import {Chart as ChartJs} from 'chart.js/auto'

const BubbleChart = ({lineData,options}) => {
  return <Doughnut data={lineData} options={options}/>
}

export default BubbleChart