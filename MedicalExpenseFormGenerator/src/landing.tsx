import { useState } from 'react'
import App from './App.tsx'
import Introduction from './Introduction.tsx'

const Landing = () => {
    const [showIntro, setShowIntro] = useState(true)

    return showIntro ? (
        <Introduction onComplete={() => setShowIntro(false)} />
    ) : (
        <App />
    )
}

export default Landing;