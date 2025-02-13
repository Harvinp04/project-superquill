"use client"

import type React from "react"
import { useRef, useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Undo, Redo, Eraser, Pencil } from "lucide-react"

const CANVAS_SCALE = 2
const MAX_HISTORY = 10

const SketchCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const offScreenCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState("#000000")
  const [brushSize, setBrushSize] = useState(5)
  const [isEraser, setIsEraser] = useState(false)
  const historyRef = useRef<ImageData[]>([])
  const historyIndexRef = useRef(-1)

  const initializeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const offScreenCanvas = document.createElement("canvas")
    offScreenCanvasRef.current = offScreenCanvas

    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * 2 
      canvas.height = rect.height * 2
      offScreenCanvas.width = rect.width * CANVAS_SCALE * 2
      offScreenCanvas.height = rect.height * CANVAS_SCALE * 2

      const context = canvas.getContext("2d")
      const offScreenContext = offScreenCanvas.getContext("2d")

      if (context && offScreenContext) {
        context.scale(1 / CANVAS_SCALE, 1 / CANVAS_SCALE)
        context.lineCap = "round"
        context.lineJoin = "round"
        offScreenContext.lineCap = "round"
        offScreenContext.lineJoin = "round"
        context.drawImage(offScreenCanvas, 0, 0)
      }
    }
  }, [])

  useEffect(() => {
    initializeCanvas()
    window.addEventListener("resize", initializeCanvas)
    return () => window.removeEventListener("resize", initializeCanvas)
  }, [initializeCanvas])

  const saveState = () => {
    const offScreenCanvas = offScreenCanvasRef.current
    if (offScreenCanvas) {
      const context = offScreenCanvas.getContext("2d")
      if (context) {
        historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1)
        historyRef.current.push(context.getImageData(0, 0, offScreenCanvas.width, offScreenCanvas.height))
        if (historyRef.current.length > MAX_HISTORY) {
          historyRef.current.shift()
        }
        historyIndexRef.current = historyRef.current.length - 1
      }
    }
  }

  const startDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const offScreenCanvas = offScreenCanvasRef.current
    if (!canvas || !offScreenCanvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (event.clientX - rect.left) * CANVAS_SCALE * 2
    const y = (event.clientY - rect.top) * CANVAS_SCALE * 2

    const context = offScreenCanvas.getContext("2d")
    if (context) {
      context.beginPath()
      context.moveTo(x, y)
      setIsDrawing(true)
    }
  }

  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    const offScreenCanvas = offScreenCanvasRef.current
    if (!canvas || !offScreenCanvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (event.clientX - rect.left) * CANVAS_SCALE*2
    const y = (event.clientY - rect.top) * CANVAS_SCALE*2

    const context = offScreenCanvas.getContext("2d")
    if (context) {
      context.lineTo(x, y)
      context.strokeStyle = isEraser ? "#FFFFFF" : color
      context.lineWidth = brushSize * CANVAS_SCALE
      context.stroke()

      // Update the visible canvas
      const visibleContext = canvas.getContext("2d")
      if (visibleContext) {
        visibleContext.clearRect(0, 0, canvas.width * CANVAS_SCALE, canvas.height * CANVAS_SCALE)
        visibleContext.drawImage(offScreenCanvas, 0, 0)
      }
    }
  }

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false)
      saveState()
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const offScreenCanvas = offScreenCanvasRef.current
    if (canvas && offScreenCanvas) {
      const context = canvas.getContext("2d")
      const offScreenContext = offScreenCanvas.getContext("2d")
      if (context && offScreenContext) {
        offScreenContext.clearRect(0, 0, offScreenCanvas.width, offScreenCanvas.height)
        context.clearRect(0, 0, canvas.width * CANVAS_SCALE, canvas.height * CANVAS_SCALE)
        saveState()
      }
    }
  }

  const copyCanvasToClipboard = () => {
    const offScreenCanvas = offScreenCanvasRef.current
    if (offScreenCanvas) {
      const base64Image = offScreenCanvas.toDataURL("image/png")
      navigator.clipboard
        .writeText(base64Image)
        .then(() => {
          toast({
            title: "Copied!",
            description: "Canvas image copied to clipboard as base64 string.",
          })
        })
        .catch((err) => {
          console.error("Failed to copy: ", err)
          toast({
            title: "Error",
            description: "Failed to copy canvas image to clipboard.",
            variant: "destructive",
          })
        })
    }
  }

  const undo = () => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--
      const offScreenCanvas = offScreenCanvasRef.current
      const canvas = canvasRef.current
      if (offScreenCanvas && canvas) {
        const context = offScreenCanvas.getContext("2d")
        const visibleContext = canvas.getContext("2d")
        if (context && visibleContext) {
          context.putImageData(historyRef.current[historyIndexRef.current], 0, 0)
          visibleContext.clearRect(0, 0, canvas.width * CANVAS_SCALE, canvas.height * CANVAS_SCALE)
          visibleContext.drawImage(offScreenCanvas, 0, 0)
        }
      }
    }
  }

  const redo = () => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++
      const offScreenCanvas = offScreenCanvasRef.current
      const canvas = canvasRef.current
      if (offScreenCanvas && canvas) {
        const context = offScreenCanvas.getContext("2d")
        const visibleContext = canvas.getContext("2d")
        if (context && visibleContext) {
          context.putImageData(historyRef.current[historyIndexRef.current], 0, 0)
          visibleContext.clearRect(0, 0, canvas.width * CANVAS_SCALE, canvas.height * CANVAS_SCALE)
          visibleContext.drawImage(offScreenCanvas, 0, 0)
        }
      }
    }
  }

  const toggleEraser = () => {
    setIsEraser(!isEraser)
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <div className="w-full max-w-3xl aspect-video relative">
        <canvas
          ref={canvasRef}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerOut={stopDrawing}
          className="border border-gray-300 rounded-lg w-full h-full touch-none"
          style={{ touchAction: "none" }}
        />
      </div>
      <div className="flex flex-wrap justify-center gap-4 items-center">
        <Button onClick={undo} variant="outline" title="Undo">
          <Undo className="h-4 w-4" />
        </Button>
        <Button onClick={redo} variant="outline" title="Redo">
          <Redo className="h-4 w-4" />
        </Button>
        <Button onClick={clearCanvas} variant="outline">
          Clear Canvas
        </Button>
        <Button onClick={copyCanvasToClipboard} variant="outline">
          Copy as Base64
        </Button>
        <Button
          onClick={toggleEraser}
          variant={isEraser ? "secondary" : "outline"}
          title={isEraser ? "Switch to Pen" : "Switch to Eraser"}
        >
          {isEraser ? <Pencil className="h-4 w-4" /> : <Eraser className="h-4 w-4" />}
        </Button>
        <div className="flex items-center space-x-2">
          <Label htmlFor="color">Color:</Label>
          <Input
            type="color"
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-12 h-8 p-0 border-none"
            disabled={isEraser}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="brushSize">Brush Size:</Label>
          <Input
            type="range"
            id="brushSize"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-32"
          />
        </div>
      </div>
    </div>
  )
}

export default SketchCanvas

