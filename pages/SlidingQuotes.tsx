import { useEffect, useRef, useState } from "react"

type Message = {
	id: string
	message: string
}

export default function MessagesPage() {
	const [messages, setMessages] = useState<Message[]>([])
	const [lastMessageId, setLastMessageId] = useState<string | null>(null)

	useEffect(() => {
		const checkForUpdates = () => {
			fetch("/api/messages")
				.then((res) => res.json())
				.then((data: Message[]) => {
					const newest = data[0]
					if (!lastMessageId || newest?.id !== lastMessageId) {
						setMessages(data)
						setLastMessageId(newest?.id || "")
					}
				})
				.catch((err) => console.error("Fehler beim Laden:", err))
		}

		checkForUpdates()

		// Optionales Polling:
		// const interval = setInterval(checkForUpdates, 5000)
		// return () => clearInterval(interval)
	}, [lastMessageId])

	return (
		<main
			style={{
				padding: "2rem",
				fontFamily: "sans-serif",
				backgroundColor: "#000000",
				minHeight: "100vh",
				color: "#8B0000",
				overflow: "hidden",
			}}
		>
			<Headline />
			<div>
				{messages.map((msg) => (
					<FloatingMessage key={msg.id} message={msg.message} />
				))}
			</div>

			<button
				onClick={() => {
					if (document.documentElement.requestFullscreen) {
						document.documentElement.requestFullscreen()
					}
				}}
				style={{
					position: "fixed",
					bottom: "1rem",
					right: "1rem",
					padding: "0.5rem 1rem",
					backgroundColor: "#8B0000",
					color: "white",
					border: "none",
					borderRadius: "4px",
					cursor: "pointer",
					fontSize: "1rem",
				}}
			>
				Vollbild
			</button>
		</main>
	)
}

function Headline() {
	return (
		<div
			style={{
				position: "absolute",
				top: "50%",
				left: "50%",
				transform: "translate(-50%, -50%)",
				color: "#FFFFFF",
				textAlign: "center",
				fontSize: "19rem",
				fontWeight: "bold",
			}}
		>
			FEEDBACK WAND
		</div>
	)
}

type FloatingMessageProps = {
	message: string
}

function FloatingMessage({ message }: FloatingMessageProps) {
	const [position, setPosition] = useState({
		x: Math.random() * window.innerWidth,
		y: Math.random() * window.innerHeight,
	})

	const speed = 1 // Geschwindigkeit (je höher, desto schneller)

	const messageRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		let animationFrameId: number

		const move = () => {
			setPosition((prev) => {
				const el = messageRef.current
				const width = el?.offsetWidth || 220
				let x = prev.x + speed
				const y = prev.y

				// Wenn die Nachricht rechts raus ist → links wieder einsteigen
				if (x > window.innerWidth) {
					x = -width
				}

				return { x, y }
			})

			animationFrameId = requestAnimationFrame(move)
		}

		animationFrameId = requestAnimationFrame(move)
		return () => cancelAnimationFrame(animationFrameId)
	}, [])

	return (
		<div
			ref={messageRef}
			style={{
				position: "absolute",
				left: position.x,
				top: position.y,
				backgroundColor: "#f5f5dc",
				color: "#8B0000",
				padding: "1rem",
				width: "220px",
				minHeight: "100px",
				borderRadius: "8px",
				boxShadow: "2px 2px 10px rgba(0,0,0,0.4)",
				fontSize: "1rem",
				whiteSpace: "pre-wrap",
			}}
		>
			{message}
		</div>
	)
}

