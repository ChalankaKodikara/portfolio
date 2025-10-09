import { useEffect, useState } from 'react'

export default function TypeWriter({ text, speed = 45, className = '' }) {
  const [output, setOutput] = useState('')

  useEffect(() => {
    let i = 0
    let raf
    const step = () => {
      i += 1
      setOutput(text.slice(0, i))
      if (i < text.length) raf = setTimeout(step, speed)
    }
    setOutput('')
    step()
    return () => raf && clearTimeout(raf)
  }, [text, speed])

  return (
    <span className={className}>
      {output}
      <span className="ml-0.5 inline-block w-0.5 h-5 align-[-2px] bg-slate-900 animate-pulse" />
    </span>
  )
}


