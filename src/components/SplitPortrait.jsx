import { useEffect, useRef, useState } from 'react'

export default function SplitPortrait({ leftSrc, rightSrc, className = '' }) {
  const canvasRef = useRef(null)
  const [dataUrl, setDataUrl] = useState('')

  useEffect(() => {
    const left = new Image()
    const right = new Image()
    left.src = leftSrc
    right.src = rightSrc

    let cancelled = false

    const draw = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')

      // Target aspect similar to container (20/13)
      const width = 1000
      const height = Math.round((13 / 20) * width)
      canvas.width = width
      canvas.height = height

      // Compute cover sizing for each image
      const drawCover = (img, dx, dw) => {
        const scale = Math.max(dw / img.width, height / img.height)
        const sw = img.width * scale
        const sh = img.height * scale
        const sx = dx + (dw - sw) / 2
        const sy = (height - sh) / 2
        ctx.drawImage(img, sx, sy, sw, sh)
      }

      // Fill white background
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)

      // Left half clip and draw
      ctx.save()
      ctx.beginPath()
      ctx.rect(0, 0, width / 2, height)
      ctx.clip()
      drawCover(left, 0, width / 2)
      ctx.restore()

      // Right half clip and draw
      ctx.save()
      ctx.beginPath()
      ctx.rect(width / 2, 0, width / 2, height)
      ctx.clip()
      drawCover(right, width / 2, width / 2)
      ctx.restore()

      // Soft center blend gradient to hide seam
      const grd = ctx.createLinearGradient(width / 2 - 12, 0, width / 2 + 12, 0)
      grd.addColorStop(0, 'rgba(255,255,255,0)')
      grd.addColorStop(0.5, 'rgba(0,0,0,0.06)')
      grd.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = grd
      ctx.fillRect(width / 2 - 12, 0, 24, height)

      if (!cancelled) setDataUrl(canvas.toDataURL('image/png'))
    }

    const maybeDraw = () => {
      if (left.complete && right.complete) draw()
    }
    left.onload = maybeDraw
    right.onload = maybeDraw
    // In case images are cached
    maybeDraw()

    return () => {
      cancelled = true
    }
  }, [leftSrc, rightSrc])

  return (
    <div className={"relative overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5 bg-white " + className}>
      {dataUrl ? (
        <img src={dataUrl} alt="Split portrait" className="block w-full h-full object-cover" />
      ) : (
        <canvas ref={canvasRef} className="block w-full h-full" />
      )}
    </div>
  )
}


