// 1️⃣ Import dependencies
const express = require('express')
const cors = require('cors')
const fs = require('fs').promises
const path = require('path')

// 2️⃣ Initialize app
const app = express()
const PORT = process.env.PORT || 4000

// 3️⃣ Middleware
app.use(cors())
app.use(express.json())

// 4️⃣ Data file
const DATA = path.join(__dirname, 'problems.json')

// 5️⃣ Helper functions
async function readData() {
  try {
    const raw = await fs.readFile(DATA, 'utf8')
    return JSON.parse(raw)
  } catch (err) {
    return [] // return empty array if file doesn't exist
  }
}

async function writeData(obj) {
  await fs.writeFile(DATA, JSON.stringify(obj, null, 2), 'utf8')
}

// 6️⃣ Routes

// Get all problems
app.get('/api/problems', async (req, res) => {
  try {
    const data = await readData()
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to load problems' })
  }
})

// Check answer
app.post('/api/check', async (req, res) => {
  try {
    const { problemId, answer } = req.body
    const data = await readData()
    const problem = data.find(p => p.id === Number(problemId))
    if (!problem) return res.status(404).json({ error: 'Problem not found' })

    const expected = problem.solution
    const parsedExpected = Number(expected)
    const parsedAnswer = Number(answer)
    let correct = false

    if (!isNaN(parsedExpected) && !isNaN(parsedAnswer)) {
      const eps = 1e-6
      correct = Math.abs(parsedExpected - parsedAnswer) < eps
    } else {
      correct = String(answer).trim().toLowerCase() === String(expected).trim().toLowerCase()
    }

    const explanation = problem.steps && problem.steps.length ? problem.steps : [
      `Expected: ${expected}`,
      `Student answered: ${answer}`,
      correct ? 'Answer matches expected.' : 'Answer does not match expected.'
    ]

    res.json({ correct, expected, explanation })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Add a new problem
app.post('/api/add-problem', async (req, res) => {
  try {
    const { title, story, image, solution, steps } = req.body
    if (!title || !story || (solution === undefined)) return res.status(400).json({ error: 'title, story, solution are required' })

    const data = await readData()
    const maxId = data.reduce((mx, p) => Math.max(mx, p.id || 0), 0)
    const newP = {
      id: maxId + 1,
      title,
      story,
      image: image || '',
      solution: String(solution),
      steps: steps ? steps.split('\n').map(s => s.trim()).filter(Boolean) : []
    }

    data.unshift(newP)
    await writeData(data)
    res.json(newP)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to add problem' })
  }
})

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
