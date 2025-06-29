import {useEffect, useState} from "react"

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
					const newest = data[0] // erste (neueste) Nachricht

					// Nur wenn sie neu ist → Seite updaten
					if (!lastMessageId || newest?.id !== lastMessageId) {
						setMessages(data) // Zeige neue Nachrichten
						setLastMessageId(newest?.id || "") // Merke neueste ID
					}
				})
				.catch((err) => console.error("Fehler beim Laden:", err))
		}

		checkForUpdates() // direkt einmal laden

		// const interval = setInterval(checkForUpdates, 1000) // alle 5 Sek.

		// return () => clearInterval(interval) // Aufräumen bei Verlassen
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
			<div
				style={{
					display: "flex",
					flexWrap: "wrap",
					gap: "1rem",
				}}
			>
				{messages.map((msg) => (
					<Message {...msg} />
				))}
			</div>

			{/* Vollbild-Button */}
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

function Message(msg: Message) {
	return (
		<div
			key={msg.id}
			style={{
				position: "absolute",
				top: Math.random() * 80 + "vh", // Zufällige Position
				left: Math.random() * 80 + "vw", // Zufällige Position
				transform: `translate(-50%, -50%) rotate(${Math.random() * 20 - 10}deg)`, // Leichte Drehung
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
			{msg.message}
		</div>
	)
}

function Headline() {
	return (
		<h1
			style={{
				fontSize: "2rem",
				marginBottom: "1.5rem",
				color: "#FFFFFF",
			}}
		>
			💬 Feedback-Wand
		</h1>
	)
}

// const useFrameTime = () => {
//   const [frameTime, setFrameTime] = useState(0);
//   useEffect(() => {
//     let frameId;
//     const frame = time:any => {
//       setFrameTime(time)
//       frameId = requestAnimationFrame(frame);
//     }

//   }
// }
