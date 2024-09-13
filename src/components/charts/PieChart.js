'use client'
import React from 'react'
import {Pie} from 'react-chartjs-2'
import {Chart as ChartJs} from 'chart.js/auto'

const PieChart = ({lineData,options}) => {
  return <Pie data={lineData} options={options}/>
}

export default PieChart