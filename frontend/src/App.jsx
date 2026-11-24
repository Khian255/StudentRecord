import { useState, useEffect } from 'react'
import StudentForm from './StudentForm'
import StudentList from './StudentList'
import './App.css'

// URL of the PHP backend hosted on XAMPP
const API = 'http://localhost/student-records/backend/api.php'

function App() {
  const [students, setStudents] = useState([]) // list from the database
  const [editing, setEditing] = useState(null) // student being edited (null = none)
  const [search, setSearch] = useState('')     // text in the search box
  const [error, setError] = useState('')       // error message from the backend

  // Fetch all students from the backend
  const loadStudents = async () => {
    const res = await fetch(API)
    setStudents(await res.json())
  }

  // Run once when the page loads
  useEffect(() => {
    loadStudents()
  }, [])

  // Save a student: PUT if it has an id (update), POST otherwise (create)
  const saveStudent = async (student) => {
    const res = await fetch(API, {
      method: student.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    })
    const result = await res.json()

    if (!res.ok) {
      setError(result.error || 'Something went wrong.')
      return false
    }
    setError('')
    setEditing(null)
    loadStudents()
    return true
  }

  // Delete a student after the user confirms
  const deleteStudent = async (id) => {
    if (!window.confirm('Delete this student? This cannot be undone.')) return
    await fetch(API, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    loadStudents()
  }

  // Filter the list by name, email or course
  const q = search.toLowerCase()
  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.course.toLowerCase().includes(q)
  )

  return (
    <>
      <header className="topbar">
        <h1>Student Records</h1>
        <p>{students.length} enrolled</p>
      </header>

      <main className="layout">
        <StudentForm
          onSave={saveStudent}
          editing={editing}
          onCancel={() => { setEditing(null); setError('') }}
          error={error}
        />
        <StudentList
          students={filtered}
          total={students.length}
          search={search}
          onSearch={setSearch}
          onEdit={setEditing}
          onDelete={deleteStudent}
        />
      </main>
    </>
  )
}

export default App
