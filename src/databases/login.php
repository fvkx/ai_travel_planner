<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

include 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

$email    = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (!$email || !$password) {
    echo json_encode(["status" => "error", "message" => "Missing credentials"]);
    $conn->close();
    exit;
}

// ✅ Column name must match your DB: 'password' not 'password_hash'
$stmt = $conn->prepare("SELECT id, firstName, lastName, email, password FROM useracc WHERE email = ? LIMIT 1");
$stmt->bind_param("s", $email);
$stmt->execute();
$res = $stmt->get_result();

if (!$res || $res->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "Invalid credentials"]);
    $stmt->close();
    $conn->close();
    exit;
}

$row = $res->fetch_assoc();

if (password_verify($password, $row['password'])) {
    unset($row['password']); // ✅ Never send password to frontend
    echo json_encode(["status" => "success", "user" => $row]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid credentials"]);
}

$stmt->close();
$conn->close();
?>