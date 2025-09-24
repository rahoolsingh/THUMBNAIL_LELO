import React from 'react'

function layout({children}: {children: React.ReactNode}) {
  return (
    <div>
      <div>layout</div>
      {children}
    </div>
  )
}

export default layout