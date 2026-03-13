"use client"

import React from "react"
import ReactFlow from "reactflow"
import "reactflow/dist/style.css"

export default function RoadmapGraph({ path }: { path: string[] }) {

  const nodes = path.map((skill, index) => ({
    id: index.toString(),
    data: { label: skill },
    position: { x: index * 200, y: 100 }
  }))

  const edges = path.slice(1).map((_, index) => ({
    id: `e${index}-${index+1}`,
    source: index.toString(),
    target: (index + 1).toString()
  }))

  return (
    <div style={{ height: 400 }}>
      <ReactFlow nodes={nodes} edges={edges} fitView />
    </div>
  )
}