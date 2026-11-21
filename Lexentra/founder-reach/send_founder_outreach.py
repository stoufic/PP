import os
import json
import smtplib
import ssl
import time
import threading
import webbrowser
from http.server import HTTPServer, BaseHTTPRequestHandler
from email.message import EmailMessage
import openpyxl

# =====================================================================
# LOCK WORKING DIRECTORY TO THIS SCRIPT'S FOLDER
# =====================================================================
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(SCRIPT_DIR)

DEFAULT_EXCEL_NAME = "founder_sheet.xlsx"
EXCEL_FILE = os.path.join(SCRIPT_DIR, DEFAULT_EXCEL_NAME)

if not os.path.exists(EXCEL_FILE):
    xlsx_files = [f for f in os.listdir(SCRIPT_DIR) if f.lower().endswith(".xlsx") and not f.startswith("~$")]
    if xlsx_files:
        EXCEL_FILE = os.path.join(SCRIPT_DIR, xlsx_files[0])

# =====================================================================
# DEFAULT EMAIL CONFIGURATION
# =====================================================================
DEFAULT_SMTP_SERVER = "smtp.gmail.com"
DEFAULT_SMTP_PORT = 465
DEFAULT_EMAIL = "touficsaleh.2003@gmail.com"
DEFAULT_APP_PASSWORD = "tczl neam nkxq ecwz"
DEFAULT_SUBJECT_TEMPLATE = "Quick question re: {company}"
DELAY_SECONDS = 5

STATE = {
    "is_running": False,
    "progress": 0,
    "total": 128,
    "logs": [
        f"Working Directory locked to: {SCRIPT_DIR}",
        f"Detected Excel file: {os.path.basename(EXCEL_FILE)}" if os.path.exists(EXCEL_FILE)
        else f"[!] Could not find '{DEFAULT_EXCEL_NAME}' in {SCRIPT_DIR}"
    ]
}


def add_log(msg):
    print(msg)
    STATE["logs"].append(msg)


def extract_subject_and_body(raw_text, company_name, contact_name, subject_template):
    """
    Extracts or formats the subject and email body.
    If the cell begins with 'Subject:', extracts it.
    Otherwise, applies the custom template (e.g., 'Quick question re: {company}').
    """
    text = str(raw_text).strip()
    lines = text.splitlines()

    if lines and lines[0].lower().startswith("subject:"):
        subject = lines[0][len("subject:"):].strip()
        body = "\n".join(lines[1:]).strip()
    else:
        first_name = contact_name.split()[0] if contact_name else "there"
        subject = subject_template.format(
            company=company_name or "your team",
            contact=contact_name or "there",
            first_name=first_name
        ).strip()
        body = text

    if not subject:
        subject = f"Quick question re: {company_name}"
    return subject, body


def run_outreach_worker(config):
    filepath = config.get("filepath", "").strip()
    if not os.path.isabs(filepath):
        filepath = os.path.join(SCRIPT_DIR, filepath)

    smtp_server = config.get("smtp_server", "").strip()
    sender_email = config.get("email", "").strip()
    sender_password = config.get("password", "").strip().replace(" ", "")
    dry_run = config.get("dry_run", True)
    sheet_choice = config.get("sheet", "Sheet1").strip()
    subject_template = config.get("subject_template", DEFAULT_SUBJECT_TEMPLATE).strip()

    try:
        smtp_port = int(config.get("smtp_port", 465))
        delay = float(config.get("delay", 5))
    except ValueError:
        add_log("[ERROR] Port and Delay must be valid numbers.")
        STATE["is_running"] = False
        return

    if not os.path.exists(filepath):
        add_log(f"[ERROR] File not found at: {filepath}")
        STATE["is_running"] = False
        return

    try:
        wb = openpyxl.load_workbook(filepath)
    except Exception as e:
        add_log(f"[ERROR] Failed to open Excel workbook: {e}")
        STATE["is_running"] = False
        return

    ws = wb[sheet_choice] if sheet_choice in wb.sheetnames else wb.active

    # Identify column indexes dynamically from Row 1
    col_company = None
    col_contact = None
    col_email = None
    col_draft = None
    col_status = None

    for c in range(1, ws.max_column + 1):
        val = str(ws.cell(1, c).value or "").strip().lower()
        if val == "company":
            col_company = c
        elif val in ["contact", "first name", "name"]:
            col_contact = c
        elif val == "email":
            col_email = c
        elif "draft" in val:
            col_draft = c
        elif "status" in val:
            col_status = c

    # Fallback to column indices if headers do not match
    col_company = col_company or 2
    col_contact = col_contact or 8
    col_email = col_email or 9
    col_draft = col_draft or 10

    # Ensure an Outreach Status column exists
    if col_status is None:
        col_status = max(ws.max_column + 1, 11)
        ws.cell(1, col_status).value = "Outreach Status"
        wb.save(filepath)

    # Gather rows ready to send (Headers on Row 1, Data starts on Row 2)
    pending_rows = []
    for r in range(2, ws.max_row + 1):
        email_val = ws.cell(r, col_email).value
        draft_val = ws.cell(r, col_draft).value
        status_val = ws.cell(r, col_status).value

        if not email_val or not draft_val:
            continue

        if str(status_val).strip().lower() in ["sent", "replied", "meeting scheduled"]:
            continue

        pending_rows.append(r)

    total = len(pending_rows)
    STATE["total"] = max(total, 1)
    STATE["progress"] = 0

    if total == 0:
        add_log("No pending contacts found. All contacts are already marked as 'Sent'!")
        STATE["is_running"] = False
        return

    add_log(f"Workbook loaded -> Found {total} unsent contacts across Rows 2 to {ws.max_row}.")
    if dry_run:
        add_log("=== DRY RUN MODE: Simulating email delivery. No emails will be sent. ===\n")

    server = None
    if not dry_run:
        try:
            add_log(f"Connecting to SMTP server {smtp_server}:{smtp_port}...")
            context = ssl.create_default_context()
            if smtp_port == 465:
                server = smtplib.SMTP_SSL(smtp_server, smtp_port, context=context)
            else:
                server = smtplib.SMTP(smtp_server, smtp_port)
                server.starttls(context=context)
            server.login(sender_email, sender_password)
            add_log("Authenticated successfully!\n")
        except Exception as e:
            add_log(f"[SMTP LOGIN ERROR] {e}\nPlease check your email address and 16-character App Password.")
            STATE["is_running"] = False
            return

    sent_count = 0
    for idx, r in enumerate(pending_rows, start=1):
        if not STATE["is_running"]:
            add_log("\n[!] Execution cancelled by user.")
            break

        company = str(ws.cell(r, col_company).value or "").strip()
        contact = str(ws.cell(r, col_contact).value or "").strip()
        recipient = str(ws.cell(r, col_email).value or "").strip()
        raw_draft = ws.cell(r, col_draft).value

        try:
            subject, body = extract_subject_and_body(raw_draft, company, contact, subject_template)
        except Exception as e:
            add_log(f"[Row {r} - SKIP] Failed parsing message: {e}")
            continue

        if dry_run:
            first_line = body.splitlines()[0] if body.splitlines() else ""
            add_log(f"[{idx}/{total} - DRY RUN] Row {r}: To: {recipient} ({contact} @ {company})")
            add_log(f"   Subject: {subject}")
            add_log(f"   Preview: {first_line} ... ({len(body)} chars)\n")
            sent_count += 1
        else:
            msg = EmailMessage()
            msg["From"] = sender_email
            msg["To"] = recipient
            msg["Subject"] = subject
            msg.set_content(body)

            try:
                server.send_message(msg)
                sent_count += 1
                add_log(f"[{idx}/{total} - SENT] Row {r}: {recipient} ({company}) | Subject: '{subject}'")

                # Mark as Sent in Column 11 and save immediately
                ws.cell(r, col_status).value = "Sent"
                wb.save(filepath)

                if idx < total and STATE["is_running"]:
                    time.sleep(delay)
            except Exception as e:
                add_log(f"[Row {r} - ERROR] Failed sending to {recipient}: {e}")

        STATE["progress"] = idx

    if server:
        try:
            server.quit()
        except Exception:
            pass

    add_log("--------------------------------------------------")
    if dry_run:
        add_log(f"Dry Run Finished: Verified {sent_count}/{total} contacts cleanly.")
        add_log("Uncheck 'DRY RUN MODE' and click 'START OUTREACH NOW' when ready to send for real.")
    else:
        add_log(f"Finished: Successfully sent {sent_count}/{total} emails.")
        add_log(f"Updated '{os.path.basename(filepath)}' with 'Sent' statuses.")

    STATE["is_running"] = False


HTML_PAGE = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Founder Outreach Mailer</title>
<style>
  body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; color: #0f172a; max-width: 800px; margin: 25px auto; padding: 0 20px; }}
  .card {{ background: white; border-radius: 10px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 18px; border: 1px solid #e2e8f0; }}
  h2 {{ margin-top: 0; font-size: 18px; color: #1e293b; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; }}
  .row {{ display: flex; align-items: center; margin-bottom: 12px; }}
  .row label {{ width: 185px; font-weight: 500; font-size: 14px; }}
  .row input, .row select {{ flex: 1; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; }}
  .btn-row {{ display: flex; gap: 10px; margin-top: 12px; }}
  button {{ border: none; border-radius: 6px; padding: 12px 20px; font-size: 15px; font-weight: 600; cursor: pointer; }}
  #startBtn {{ flex: 1; background: #16a34a; color: white; }}
  #startBtn:disabled {{ background: #94a3b8; cursor: not-allowed; }}
  #stopBtn {{ background: #dc2626; color: white; }}
  #stopBtn:disabled {{ background: #fca5a5; cursor: not-allowed; }}
  progress {{ width: 100%; height: 18px; margin-bottom: 10px; }}
  #logBox {{ background: #0f172a; color: #e2e8f0; font-family: Menlo, Consolas, monospace; font-size: 12px; padding: 14px; border-radius: 6px; height: 280px; overflow-y: auto; white-space: pre-wrap; }}
  .hint {{ font-size: 12px; color: #64748b; margin-left: 185px; margin-top: -6px; margin-bottom: 8px; }}
</style>
</head>
<body>
  <div class="card">
    <h2>1. Configuration ({os.path.basename(EXCEL_FILE)})</h2>
    <div class="row"><label>Excel File:</label><input id="filepath" value="{os.path.basename(EXCEL_FILE)}"></div>
    <div class="row"><label>Sheet Name:</label><input id="sheet" value="Sheet1"></div>
    <div class="row">
      <label>Subject Line Template:</label>
      <input id="subject_template" value="{DEFAULT_SUBJECT_TEMPLATE}">
    </div>
    <div class="hint">Supports <code>{{company}}</code>, <code>{{contact}}</code>, and <code>{{first_name}}</code></div>
    <div class="row"><label>SMTP Server & Port:</label>
      <input id="smtp_server" value="{DEFAULT_SMTP_SERVER}" style="flex:2; margin-right:8px;">
      <input id="smtp_port" value="{DEFAULT_SMTP_PORT}" style="flex:0.6;">
    </div>
    <div class="row"><label>Your Email:</label><input id="email" value="{DEFAULT_EMAIL}"></div>
    <div class="row"><label>App Password:</label><input id="password" type="password" value="{DEFAULT_APP_PASSWORD}"></div>
    <div class="row"><label>Delay (Seconds):</label><input id="delay" value="{DELAY_SECONDS}" style="max-width:100px;"></div>
  </div>

  <div class="card">
    <h2>2. Launch Outreach</h2>
    <label style="display:flex; align-items:center; gap:8px; font-size:14px; cursor:pointer;">
      <input type="checkbox" id="dry_run" checked style="width:18px; height:18px;">
      <b>DRY RUN MODE</b> (Preview and verify emails in the log without sending)
    </label>
    <div class="btn-row">
      <button id="startBtn" onclick="startSend()">🚀 START OUTREACH NOW</button>
      <button id="stopBtn" onclick="stopSend()" disabled>⏹ STOP</button>
    </div>
  </div>

  <div class="card">
    <h2>Live Execution Log</h2>
    <progress id="prog" value="0" max="100"></progress>
    <div id="logBox"></div>
  </div>

<script>
async function startSend() {{
  const dryRun = document.getElementById('dry_run').checked;
  if (!dryRun) {{
    if (!confirm("DRY RUN is unchecked.\\n\\nThis will send REAL emails to the founders in your sheet.\\n\\nProceed?")) return;
  }}
  const payload = {{
    filepath: document.getElementById('filepath').value,
    sheet: document.getElementById('sheet').value,
    subject_template: document.getElementById('subject_template').value,
    smtp_server: document.getElementById('smtp_server').value,
    smtp_port: document.getElementById('smtp_port').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    delay: document.getElementById('delay').value,
    dry_run: dryRun
  }};
  await fetch('/start', {{ method: 'POST', body: JSON.stringify(payload) }});
}}

async function stopSend() {{
  await fetch('/stop', {{ method: 'POST' }});
}}

setInterval(async () => {{
  try {{
    const res = await fetch('/status');
    const data = await res.json();
    document.getElementById('startBtn').disabled = data.is_running;
    document.getElementById('stopBtn').disabled = !data.is_running;
    const prog = document.getElementById('prog');
    prog.max = data.total;
    prog.value = data.progress;
    const logBox = document.getElementById('logBox');
    const newText = data.logs.join("\\n");
    if (logBox.textContent !== newText) {{
      logBox.textContent = newText;
      logBox.scrollTop = logBox.scrollHeight;
    }}
  }} catch (e) {{}}
}}, 400);
</script>
</body>
</html>
"""


class RequestHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

    def do_GET(self):
        if self.path == "/status":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(STATE).encode("utf-8"))
        else:
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(HTML_PAGE.encode("utf-8"))

    def do_POST(self):
        if self.path == "/start" and not STATE["is_running"]:
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length).decode("utf-8"))
            STATE["logs"] = []
            STATE["is_running"] = True
            threading.Thread(target=run_outreach_worker, args=(body,), daemon=True).start()
        elif self.path == "/stop":
            STATE["is_running"] = False

        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"OK")


if __name__ == "__main__":
    port = 8765
    url = f"http://127.0.0.1:{port}"
    print(f"Starting Founder Outreach Mailer at {url} ...")
    webbrowser.open(url)
    server = HTTPServer(("127.0.0.1", port), RequestHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down.")