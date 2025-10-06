import React, { useEffect, useState } from 'react';
import './index.css';
import Header from './components/Header';
import ProblemCard from './components/ProblemCard';
import ProblemBuilder from './components/ProblemBuilder';


export default function App() {
const [problems, setProblems] = useState([])
const [loading, setLoading] = useState(true)


async function fetchProblems() {
try {
const res = await fetch('http://localhost:4000/api/problems')
const data = await res.json()
setProblems(data)
} catch (err) {
console.error('failed to fetch problems', err)
} finally {
setLoading(false)
}
}


useEffect(() => { fetchProblems() }, [])


function addProblemToList(newProblem) {
setProblems(p => [newProblem, ...p])
}


return (
<div className="app-root">
<Header />


<main className="page">
<section className="left">
<h2 className="section-title">Problems</h2>
{loading && <p className="muted">Loading...</p>}
{!loading && problems.length === 0 && <p className="muted">No problems yet. Create one below.</p>}
<div className="cards">
{problems.map(p => (
<ProblemCard key={p.id} problem={p} />
))}
</div>
</section>


<aside className="right">
<h2 className="section-title">Teacher: Build a problem</h2>
<ProblemBuilder onCreated={addProblemToList} />
</aside>
</main>


<footer className="site-footer">Made with ❤️ — Word Problems Demo</footer>
</div>
)
}