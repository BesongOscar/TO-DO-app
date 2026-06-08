<# .SYNOPSIS
  Run Maestro E2E tests for the TODO app.
.DESCRIPTION
  Runs Maestro E2E flows against a running app instance.
  Supports Android emulator/device and iOS simulator.
.PARAMETER Platform
  Target platform: "android" (default) or "ios"
.PARAMETER Flow
  Specific flow file to run (optional). Runs all flows if omitted.
.PARAMETER Device
  Device identifier (e.g. emulator-5554). Auto-detected if omitted.
.PARAMETER List
  List available flows instead of running them.
.EXAMPLE
  .\run-e2e.ps1                     # Run all flows on Android
  .\run-e2e.ps1 -Flow auth          # Run only auth flow
  .\run-e2e.ps1 -List               # List all available flows
  .\run-e2e.ps1 -Platform ios       # Run all flows on iOS
#>

param(
  [ValidateSet("android", "ios")]
  [string]$Platform = "android",
  [string]$Flow = "",
  [string]$Device = "",
  [switch]$List = $false
)

$ErrorActionPreference = "Stop"
$MAESTRO_DIR = ".maestro"
$FLOWS_DIR = "$MAESTRO_DIR\flows"

# Check Maestro is installed
$maestroCmd = Get-Command "maestro" -ErrorAction SilentlyContinue
if (-not $maestroCmd) {
  Write-Host "╔══════════════════════════════════════════════════╗" -ForegroundColor Yellow
  Write-Host "║  Maestro CLI is not installed.                  ║" -ForegroundColor Yellow
  Write-Host "║                                                ║" -ForegroundColor Yellow
  Write-Host "║  Install it:                                    ║" -ForegroundColor Yellow
  Write-Host "║  https://maestro.mobile.dev/getting-started     ║" -ForegroundColor Yellow
  Write-Host "║                                                ║" -ForegroundColor Yellow
  Write-Host "║  Or with Scoop:                                 ║" -ForegroundColor Yellow
  Write-Host "║  scoop bucket add maestro                       ║" -ForegroundColor Yellow
  Write-Host "║  scoop install maestro                          ║" -ForegroundColor Yellow
  Write-Host "╚══════════════════════════════════════════════════╝" -ForegroundColor Yellow
  exit 1
}

# Check ADB for Android
if ($Platform -eq "android") {
  $adbCmd = Get-Command "adb" -ErrorAction SilentlyContinue
  if (-not $adbCmd) {
    Write-Host "Warning: ADB not found in PATH. Ensure Android SDK platform-tools is installed." -ForegroundColor Yellow
  }
}

# List flows
if ($List) {
  Write-Host "Available E2E flows:" -ForegroundColor Cyan
  Get-ChildItem "$FLOWS_DIR\*.yaml" | Sort-Object Name | ForEach-Object {
    $name = $_.BaseName
    $desc = switch -wildcard ($name) {
      "01-auth*" { "Onboarding, signup, login, email verification" }
      "02-forgot*" { "Password reset flow" }
      "03-task*" { "Task CRUD: create, complete, edit, delete" }
      "04-nav*" { "Tab navigation across all screens" }
      "05-profile*" { "Profile, theme, i18n, logout" }
      "06-task-detail*" { "Task detail panel: due dates, reminders, notes" }
      "07-bulk*" { "Bulk actions" }
      "08-custom*" { "Custom list creation and management" }
      "09-search*" { "Search and sort" }
      default { "E2E test flow" }
    }
    Write-Host "  $($_.Name)  - $desc" -ForegroundColor White
  }
  exit 0
}

# Build maestro command
$maestroArgs = @("test")

if ($Flow) {
  $flowFile = "$FLOWS_DIR\$Flow"
  if (-not (Test-Path $flowFile)) {
    # Try matching by prefix
    $matches = Get-ChildItem "$FLOWS_DIR\*$Flow*.yaml"
    if ($matches.Count -eq 0) {
      Write-Host "Error: No flow found matching '$Flow'." -ForegroundColor Red
      Write-Host "Use '.\run-e2e.ps1 -List' to see available flows." -ForegroundColor Yellow
      exit 1
    }
    $flowFile = $matches[0].FullName
  }
  $maestroArgs += @("--include-tags", $Flow)
  Write-Host "Running flow: $flowFile" -ForegroundColor Green
}

if ($Device) {
  $maestroArgs += @("--device", $Device)
}

# Run maestro with environment variables from .env
$envVars = @{}
if (Test-Path ".env") {
  Get-Content ".env" | ForEach-Object {
    if ($_ -match "^\s*([^#=]+)=(.*)\s*$") {
      $key = $matches[1].Trim()
      $value = $matches[2].Trim()
      $envVars[$key] = $value
    }
  }
}

Write-Host "╔══════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Running Maestro E2E tests                      ║" -ForegroundColor Cyan
Write-Host "║  Platform: $($Platform.PadRight(35))║" -ForegroundColor Cyan
Write-Host "║  Flows:    $($FLOWS_DIR.PadRight(35))║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════╝" -ForegroundColor Cyan

# Run maestro
$envVars.Keys | ForEach-Object { Set-Item -Path "env:$_" -Value $envVars[$_] }
if ($Flow -and $flowFile) {
  & $maestroCmd.FullName @maestroArgs $flowFile
} else {
  & $maestroCmd.FullName @maestroArgs $FLOWS_DIR
}

if ($LASTEXITCODE -eq 0) {
  Write-Host "All E2E tests passed! ✓" -ForegroundColor Green
} else {
  Write-Host "Some E2E tests failed. See output above." -ForegroundColor Red
}
exit $LASTEXITCODE
