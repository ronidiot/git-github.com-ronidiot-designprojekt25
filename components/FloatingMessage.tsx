import { useEffect, useRef, useState } from "react"

type FloatingMessageProps = {
	message: string
}

export function FloatingMessage({ message }: FloatingMessageProps) {
	const [position, setPosition] = useState({
		x: Math.random() * window.innerWidth,
		y: Math.random() * window.innerHeight,
	})

	const [direction, setDirection] = useState({
		dx: (Math.random() - 0.5) * 0.5, // Geschwindigkeit X (zwischen -1 und 1)
		dy: (Math.random() - 0.5) * 0.5 // Geschwindigkeit Y
	})

	const messageRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		let animationFrameId: number

		const move = () => {
			setPosition((prev) => {
				let { x, y } = prev
				let { dx, dy } = direction

				const el = messageRef.current
				const width = el?.offsetWidth || 220
				const height = el?.offsetHeight || 100

				// Prüfen, ob die Nachricht an den Bildschirmrand stößt
				if (x + dx < 0 || x + dx + width > window.innerWidth) {
					dx = -dx
				}
				if (y + dy < 0 || y + dy + height > window.innerHeight) {
					dy = -dy
				}

				setDirection({ dx, dy })
				return { x: x + dx, y: y + dy }
			})

			animationFrameId = requestAnimationFrame(move)
		}

		animationFrameId = requestAnimationFrame(move)

		return () => cancelAnimationFrame(animationFrameId)
	}, [direction])

	return (
		<div
			ref={messageRef}
			style={{
				position: "absolute",
				left: position.x,
				top: position.y,
				//transform: `translate(-50%, -50%) //rotate(${Math.random() * 20 - 10}deg)`,
				backgroundColor: "#f5f5dc",
				color: "#8B0000",
				padding: "1rem",
				width: "220px",
				minHeight: "100px",
				borderRadius: "8px",
				boxShadow: "2px 2px 10px rgba(0,0,0,0.4)",
				fontSize: "1rem",
				whiteSpace: "pre-wrap",
				//pointerEvents: "none", // Kein Hover/Click
			}}
		>
			{message}
		</div>
	)
}
