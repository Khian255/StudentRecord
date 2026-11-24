<?php
// api.php - backend for the Student Records app (handles all CRUD requests)

// CORS headers: React (port 5173) and Apache (port 80) run on different ports
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Browsers send an OPTIONS "preflight" request first, so just reply OK
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Connect to SQLite (the file is created automatically if it doesn't exist)
$db = new PDO('sqlite:' . __DIR__ . '/students.db');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Create the table on first run
$db->exec("CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    course TEXT NOT NULL,
    year_level INTEGER NOT NULL
)");

$method = $_SERVER['REQUEST_METHOD'];
// Read the JSON body sent by React
$data = json_decode(file_get_contents('php://input'), true);

// Validate on the server too, so bad data can't skip the form checks
if ($method === 'POST' || $method === 'PUT') {
    if (empty($data['name']) || empty($data['email']) || empty($data['course'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Name, email and course are required.']);
        exit;
    }
    if ($data['year_level'] < 1 || $data['year_level'] > 4) {
        http_response_code(400);
        echo json_encode(['error' => 'Year level must be between 1 and 4.']);
        exit;
    }
}

try {
    if ($method === 'GET') {
        // READ: get all students, newest first
        $rows = $db->query("SELECT * FROM students ORDER BY id DESC")->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($rows);

    } elseif ($method === 'POST') {
        // CREATE: insert a new student
        $stmt = $db->prepare("INSERT INTO students (name, email, course, year_level) VALUES (?, ?, ?, ?)");
        $stmt->execute([$data['name'], $data['email'], $data['course'], $data['year_level']]);
        echo json_encode(['message' => 'Student added.']);

    } elseif ($method === 'PUT') {
        // UPDATE: edit an existing student by id
        $stmt = $db->prepare("UPDATE students SET name=?, email=?, course=?, year_level=? WHERE id=?");
        $stmt->execute([$data['name'], $data['email'], $data['course'], $data['year_level'], $data['id']]);
        echo json_encode(['message' => 'Student updated.']);

    } elseif ($method === 'DELETE') {
        // DELETE: remove a student by id
        $stmt = $db->prepare("DELETE FROM students WHERE id=?");
        $stmt->execute([$data['id']]);
        echo json_encode(['message' => 'Student deleted.']);
    }
} catch (Exception $e) {
    // Send the error back to the frontend
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
