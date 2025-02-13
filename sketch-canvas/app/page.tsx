import SketchCanvas from "../sketch-canvas"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Handwriting ➡ LaTeX</h1>
      <SketchCanvas />
    </main>
  )
}

