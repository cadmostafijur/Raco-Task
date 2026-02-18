const BASE = "http://localhost:4000/api";

async function request(method, path, body, token) {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);
  if (token) opts.headers.Authorization = `Bearer ${token}`;
  const res = await fetch(BASE + path, opts);
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

async function run() {
  console.log("=== API Manual Tests ===\n");

  // 1. Admin Login
  console.log("1. Admin Login...");
  const loginRes = await request("POST", "/auth/login", {
    email: "admin@marketplace.com",
    password: "Admin123!",
  });
  if (!loginRes.data.success) {
    console.log("   FAIL:", loginRes.data.error || loginRes.data);
    return;
  }
  const adminToken = loginRes.data.data.accessToken;
  console.log("   OK - Admin logged in\n");

  const ts = Date.now();
  // 2. Register Buyer
  console.log("2. Register Buyer...");
  const buyerRes = await request("POST", "/auth/register", {
    email: `buyer${ts}@test.com`,
    password: "Buyer123!",
    name: "Test Buyer",
  });
  if (!buyerRes.data.success) {
    console.log("   FAIL:", buyerRes.data.error || buyerRes.data);
    return;
  }
  let buyerToken = buyerRes.data.data.accessToken;
  console.log("   OK - Buyer registered\n");

  // 3. Admin assigns BUYER role
  console.log("3. Admin assigns BUYER role...");
  const buyerUser = buyerRes.data.data.user;
  const roleRes = await request(
    "PUT",
    `/users/${buyerUser.id}/role`,
    { role: "BUYER" },
    adminToken
  );
  if (!roleRes.data.success) {
    console.log("   FAIL:", roleRes.data.error);
    return;
  }
  console.log("   OK - Buyer role assigned\n");

  // Re-login buyer to get token with new role
  const buyerLoginRes = await request("POST", "/auth/login", {
    email: `buyer${ts}@test.com`,
    password: "Buyer123!",
  });
  buyerToken = buyerLoginRes.data.data.accessToken;

  // 4. Register Solver
  console.log("4. Register Problem Solver...");
  const solverRes = await request("POST", "/auth/register", {
    email: `solver${ts}@test.com`,
    password: "Solver123!",
    name: "Test Solver",
  });
  if (!solverRes.data.success) {
    console.log("   FAIL:", solverRes.data.error || solverRes.data);
    return;
  }
  const solverToken = solverRes.data.data.accessToken;
  console.log("   OK - Solver registered\n");

  // 5. Buyer creates project
  console.log("5. Buyer creates project...");
  const projectRes = await request(
    "POST",
    "/projects",
    { title: "Test Project", description: "E2E test project" },
    buyerToken
  );
  if (!projectRes.data.success) {
    console.log("   FAIL:", projectRes.data.error);
    return;
  }
  const projectId = projectRes.data.data.id;
  console.log("   OK - Project created:", projectId, "\n");

  // 6. Solver requests to work
  console.log("6. Solver requests to work...");
  const requestRes = await request(
    "POST",
    `/projects/${projectId}/requests`,
    { message: "I want to work on this" },
    solverToken
  );
  if (!requestRes.data.success) {
    console.log("   FAIL:", requestRes.data.error);
    return;
  }
  console.log("   OK - Request created\n");

  // 7. Buyer assigns solver
  console.log("7. Buyer assigns solver...");
  const projRes = await request("GET", `/projects/${projectId}`, null, buyerToken);
  const pendingReq = projRes.data.data?.requests?.find((r) => r.status === "PENDING");
  if (!pendingReq) {
    console.log("   FAIL: No pending request found");
    return;
  }
  const assignRes = await request(
    "PUT",
    `/projects/${projectId}/assign`,
    { solverId: pendingReq.userId },
    buyerToken
  );
  if (!assignRes.data.success) {
    console.log("   FAIL:", assignRes.data.error);
    return;
  }
  console.log("   OK - Solver assigned\n");

  // 8. Solver creates task
  console.log("8. Solver creates task...");
  const taskRes = await request(
    "POST",
    `/projects/${projectId}/tasks`,
    { title: "Task 1", description: "First task" },
    solverToken
  );
  if (!taskRes.data.success) {
    console.log("   FAIL:", taskRes.data.error);
    return;
  }
  const taskId = taskRes.data.data.id;
  console.log("   OK - Task created:", taskId, "\n");

  // 9. Get project status
  console.log("9. Get project...");
  const getProj = await request("GET", `/projects/${projectId}`, null, buyerToken);
  if (!getProj.data.success) {
    console.log("   FAIL:", getProj.data.error);
    return;
  }
  console.log("   OK - Status:", getProj.data.data.status, "\n");

  // 10. ZIP upload (create minimal zip and test)
  console.log("10. Solver uploads ZIP...");
  const fs = await import("fs");
  const path = await import("path");
  const zipPath = path.join(process.cwd(), "test-upload.zip");
  const txtPath = path.join(process.cwd(), "test-file.txt");
  let zipCreated = false;
  try {
    fs.writeFileSync(txtPath, "test content");
    const { execSync } = await import("child_process");
    const psCmd = `Compress-Archive -Path '${txtPath.replace(/'/g, "''")}' -DestinationPath '${zipPath.replace(/'/g, "''")}' -Force`;
    execSync(`powershell -Command "${psCmd.replace(/"/g, '\\"')}"`, { stdio: "pipe", cwd: process.cwd() });
    zipCreated = fs.existsSync(zipPath);
  } catch {
    // Try alternative: create minimal valid zip (PK header)
    const minimalZip = Buffer.from([
      0x50, 0x4b, 0x05, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    ]);
    fs.writeFileSync(zipPath, minimalZip);
    zipCreated = true;
  }
  if (!zipCreated) {
    console.log("   SKIP - Could not create zip file");
  }
  if (fs.existsSync(zipPath)) {
    const formData = new FormData();
    const fileBuffer = fs.readFileSync(zipPath);
    formData.append("file", new Blob([fileBuffer], { type: "application/zip" }), "test.zip");
    const uploadRes = await fetch(BASE + `/projects/${projectId}/tasks/${taskId}/submissions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${solverToken}` },
      body: formData,
    });
    const uploadData = await uploadRes.json();
    try { fs.unlinkSync(zipPath); } catch {}
    try { fs.unlinkSync(txtPath); } catch {}
    if (!uploadData.success) {
      console.log("   FAIL:", uploadData.error);
      return;
    }
    const submissionId = uploadData.data.id;
    console.log("   OK - Submission created\n");

    // 11. Buyer reviews submission
    console.log("11. Buyer accepts submission...");
    const reviewRes = await request(
      "PUT",
      `/projects/${projectId}/tasks/${taskId}/submissions/${submissionId}/review`,
      { status: "ACCEPTED" },
      buyerToken
    );
    if (!reviewRes.data.success) {
      console.log("   FAIL:", reviewRes.data.error);
      return;
    }
    console.log("   OK - Submission accepted\n");
  }

  console.log("=== All API tests PASSED ===");
}

run().catch((e) => console.error("Error:", e));
