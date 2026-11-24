import { useState, useEffect } from 'react'

// Blank form values
const emptyForm = { name: '', email: '', course: '', year_level: '' }

function StudentForm({ onSave, editing, onCancel, error }) {
  const [form, setForm] = useState(emptyForm)

  // When Edit is clicked, load that student's data into the form
  useEffect(() => {
    setForm(editing ? editing : emptyForm)
  }, [editing])

  // Update state as the user types
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault() // stop the page from reloading
    const ok = await onSave(form)
    if (ok) setForm(emptyForm) // clear the form only if the save worked
  }

  return (
    <form className="panel form" onSubmit={handleSubmit}>
      <h2>{editing ? 'Edit student' : 'Add student'}</h2>

      <label>
        Full name
        <input name="name" value={form.name} onChange={handleChange} placeholder="Juan Dela Cruz" required />
      </label>

      <label>
        Email
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="juan@school.edu" required />
      </label>

      <div className="row">
        <label>
          Course
          <select name="course" value={form.course} onChange={handleChange} required>
            <option value="">Select</option>
            <option>BSCS</option>
            <option>BSIT</option>
            <option>BSIS</option>
          </select>
        </label>

        <label>
          Year level
          <input name="year_level" type="number" min="1" max="4" value={form.year_level} onChange={handleChange} placeholder="1-4" required />
        </label>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="actions">
        <button type="submit" className="primary">{editing ? 'Save changes' : 'Add student'}</button>
        {editing && <button type="button" className="ghost" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}

export default StudentForm
