import React from 'react'
import { useNavigate } from 'react-router-dom'

function Dashboard() {

    const navigate = useNavigate();
  return (
    <div>
      <h1 className='mt-20'>Dashboard</h1>
      <button onClick={() => navigate('/tvara')}>Go to Tvara</button>
    </div>
  )
}

export default Dashboard
