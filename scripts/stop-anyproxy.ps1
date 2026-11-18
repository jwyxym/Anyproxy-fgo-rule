$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$entry = Join-Path $root 'node_modules'

# Only stop Node processes running AnyProxy from this project.
$processes = @(Get-CimInstance Win32_Process | Where-Object {
    $_.Name -eq 'node.exe' -and
    $_.CommandLine -and
    $_.CommandLine.IndexOf($entry, [StringComparison]::OrdinalIgnoreCase) -ge 0 -and
    $_.CommandLine -match '[\\/]anyproxy[\\/]bin[\\/]anyproxy(?:["\s]|$)'
})
foreach ($process in $processes) {
    $current = Get-CimInstance Win32_Process -Filter "ProcessId = $($process.ProcessId)"
    if ($current -and $current.CreationDate -eq $process.CreationDate -and $current.CommandLine -eq $process.CommandLine) {
        Stop-Process -Id $process.ProcessId -Force
        Write-Host "Stopped project AnyProxy PID $($process.ProcessId)"
    }
}
if ($processes.Count -eq 0) {
    Write-Host 'No running AnyProxy instance from this project.'
}
$listeners = @(Get-NetTCPConnection -State Listen | Where-Object { $_.LocalPort -in 8888, 8889 })
if ($listeners.Count -gt 0) {
    $listeners | Format-Table LocalAddress, LocalPort, OwningProcess
    Write-Error 'Ports 8888/8889 are still occupied. Other processes were not killed; check the PIDs above.'
    exit 1
}
Write-Host 'Ports 8888 and 8889 are free.'
