import React, { useState } from 'react'


export default function ProblemCard({ problem }){
const [answer, setAnswer] = useState('')
const [feedback, setFeedback] = useState(null)
const [loading, setLoading] = useState(false)


async function submitAnswer(e){
e.preventDefault()
setLoading(true)
setFeedback(null)
try {
const res = await fetch('http://localhost:4000/api/check', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ problemId: problem.id, answer })
})
const json = await res.json()
setFeedback(json)
} catch (err) {
console.error(err)
setFeedback({ error: 'Network error' })
} finally { setLoading(false) }
}


return (
<article className="problem-card">
<div className="card-body">
<div className="card-top">
{problem.image ? (
<img src={problem.image} alt="problem" className="problem-img" />
) : (
<div className="img-placeholder">🖼️</div>
)}
<div className="card-text">
<h3 className="problem-title">{problem.title}</h3>
<p className="problem-story">{problem.story}</p>
</div>
</div>


<form className="answer-form" onSubmit={submitAnswer}>
<label className="sr-only" htmlFor={`ans-${problem.id}`}>Your answer</label>
<input id={`ans-${problem.id}`} value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Type your answer (number or text)" />
<div className="actions">
<button type="submit" disabled={loading}>Check</button>
</div>
</form>


{feedback && (
<div className={`feedback ${feedback.correct ? 'ok' : 'bad'}`}>
{feedback.error && <div className="muted">{feedback.error}</div>}
{!feedback.error && (
<>
<div className="result">{feedback.correct ? '✅ Correct!' : `❌ Incorrect — expected: ${feedback.expected ?? '—'}`}</div>
<div className="explanation">
<strong>Explanation:</strong>
<ol>
{feedback.explanation && feedback.explanation.map((s, i) => <li key={i}>{s}</li>)}
</ol>
</div>
</>
)}
</div>
)}
</div>
</article>
)
}