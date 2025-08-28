import { Cursor as CursorType } from "@/types"
import { MousePointer2 } from "lucide-react"

interface CursorProps {
  cursor: CursorType
}

export function Cursor({cursor}: CursorProps) {
  // Não renderiza se não tivermos as coordenadas
  if (typeof cursor.x !== 'number' || typeof cursor.y !== 'number') return null

  return (
    <div
      className="absolute top-0 left-0 transition-transform duration-100 ease-out"
      style={{
        transform: `translate(${cursor.x}px, ${cursor.y}px)`,
      }}
    >
      <MousePointer2 
        className="h-6 w-6"
        style={{ color: cursor.color }}
        strokeWidth={2}
      />
      <span
        className="ml-2 mt-1 rounded-full px-2 py-0.5 text-xs text-white"
        style={{ backgroundColor: cursor.color }}
      >
        {cursor.id.substring(0, 5)} {/* Mostra os 5 primeiros chars do ID */}
      </span>
    </div>
  )
}