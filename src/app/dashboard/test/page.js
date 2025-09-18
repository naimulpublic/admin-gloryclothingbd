"use client"
import KeyValue from '@/custom/keyvaluefild/KeyValue'
import { useState } from 'react'
import React from 'react'

export default function page() {
    const [includedServices, setIncludedServices] = useState([]);
  return (
    <KeyValue
  items={includedServices}
  setItems={setIncludedServices}
  title="Included Services"
/>
  )
}
