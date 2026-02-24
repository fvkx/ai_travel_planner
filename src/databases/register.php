<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

include 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

$first  = trim($data['firstName'] ?? '');
$last   = trim($data['lastName'] ?? '');
$email  = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
$travel = $data['travelStyles'] ?? [];
$home   = trim($data['homeCity'] ?? '');

if (!$first || !$last || !$email || !$password) {
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    $conn->close();
    exit;
}

// Check if email already exists
$stmt = $conn->prepare("SELECT id FROM useracc WHERE email = ? LIMIT 1");
$stmt->bind_param("s", $email);
$stmt->execute();
$res = $stmt->get_result();

if ($res && $res->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Email already registered"]);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

$hash = password_hash($password, PASSWORD_DEFAULT);
$travel_json = json_encode($travel);

$stmt = $conn->prepare("INSERT INTO useracc (firstName, lastName, email, password, travel_styles, home_city, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())");
$stmt->bind_param("ssssss", $first, $last, $email, $hash, $travel_json, $home);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Registered successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "DB insert failed: " . $conn->error]);
}

$stmt->close();
$conn->close();
?>