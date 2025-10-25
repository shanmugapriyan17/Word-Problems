import React, { useState } from 'react'


export default function ProblemBuilder({ onCreated }){
const [title, setTitle] = useState('')
const [story, setStory] = useState('')
const [image, setImage] = useState('')
const [solution, setSolution] = useState('')
const [steps, setSteps] = useState('')
const [loading, setLoading] = useState(false)
const [msg, setMsg] = useState(null)


async function submit(e){
e.preventDefault()
setLoading(true)
setMsg(null)
try {
const body = { title, story, image, solution, steps }
const res = await fetch('http://localhost:4000/api/add-problem', {
method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
})
const json = await res.json()
if (res.ok) {
onCreated(json)
setMsg('Created!')
setTitle(''); setStory(''); setImage(''); setSolution(''); setSteps('')
} else {
setMsg(json.error || 'Failed')
}
} catch (err) {
setMsg('Network error')
} finally { setLoading(false) }
}


return (
<form className="builder" onSubmit={submit}>
<label>Title<input value={title} onChange={e=>setTitle(e.target.value)} required /></label>
<label>Story<textarea value={story} onChange={e=>setStory(e.target.value)} placeholder="Write the word problem story here" required/></label>
<label>Image URL (optional)<input value={image} onChange={e=>setImage(e.target.value)} /></label>
<label>Solution (what student should answer)<input value={solution} onChange={e=>setSolution(e.target.value)} required /></label>
<label>Explanation steps (one step per line)<textarea value={steps} onChange={e=>setSteps(e.target.value)} placeholder="e.g. Start with 3 apples\nAdd 2 apples\nTotal: 5" /></label>


<div className="builder-actions">
<button type="submit" disabled={loading}>Create problem</button>
</div>


{msg && <div className="muted">{msg}</div>}
</form>
)
}