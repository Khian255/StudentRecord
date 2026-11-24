// Get initials for the avatar circle, e.g. "Juan Dela Cruz" -> "JD"
function initials(name) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

// Table component: receives data and handlers from App through props
function StudentList({ students, total, search, onSearch, onEdit, onDelete }) {
  return (
    <section className="panel list">
      <div className="list-head">
        <h2>All students</h2>
        <input
          className="search"
          type="search"
          placeholder="Search by name, email or course"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* Empty states: no data at all vs. no search matches */}
      {total === 0 && <p className="empty">No students yet. Add the first one using the form.</p>}
      {total > 0 && students.length === 0 && <p className="empty">No students match "{search}".</p>}

      {students.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Year</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* Loop through students; React needs a unique key for each row */}
              {students.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="person">
                      <span className="avatar">{initials(s.name)}</span>
                      <div>
                        <strong>{s.name}</strong>
                        <span className="muted">{s.email}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className={`badge ${s.course.toLowerCase()}`}>{s.course}</span></td>
                  <td>Year {s.year_level}</td>
                  <td className="row-actions">
                    <button className="ghost" onClick={() => onEdit(s)}>Edit</button>
                    <button className="danger" onClick={() => onDelete(s.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default StudentList
