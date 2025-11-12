# 创建 .env.local 文件的 PowerShell 脚本

Write-Host "🔧 Firebase 环境变量配置助手" -ForegroundColor Cyan
Write-Host ""

# 检查是否已存在 .env.local
if (Test-Path .env.local) {
    $overwrite = Read-Host ".env.local 文件已存在，是否覆盖？(y/n)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "已取消操作" -ForegroundColor Yellow
        exit
    }
}

Write-Host "请从 Firebase 控制台获取以下信息：" -ForegroundColor Yellow
Write-Host "访问: https://console.firebase.google.com/" -ForegroundColor Cyan
Write-Host "项目设置 → 您的应用 → Web 应用配置" -ForegroundColor Cyan
Write-Host ""

# 获取用户输入
$apiKey = Read-Host "NEXT_PUBLIC_FIREBASE_API_KEY"
$authDomain = Read-Host "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
$projectId = Read-Host "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
$storageBucket = Read-Host "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
$messagingSenderId = Read-Host "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
$appId = Read-Host "NEXT_PUBLIC_FIREBASE_APP_ID"

# 可选配置
Write-Host ""
Write-Host "可选配置（直接回车使用默认值）：" -ForegroundColor Yellow
$siteName = Read-Host "NEXT_PUBLIC_SITE_NAME (默认: kukutx99)"
if ([string]::IsNullOrWhiteSpace($siteName)) {
    $siteName = "kukutx99"
}

$siteDescription = Read-Host "NEXT_PUBLIC_SITE_DESCRIPTION (默认: 个人技术博客)"
if ([string]::IsNullOrWhiteSpace($siteDescription)) {
    $siteDescription = "个人技术博客"
}

$ownerEmail = Read-Host "NEXT_PUBLIC_OWNER_EMAILS (可选，用于限制后台访问)"

# 创建文件内容
$content = @"
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=$apiKey
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$authDomain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=$projectId
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$storageBucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$messagingSenderId
NEXT_PUBLIC_FIREBASE_APP_ID=$appId

# 站点配置
NEXT_PUBLIC_SITE_NAME=$siteName
NEXT_PUBLIC_SITE_DESCRIPTION=$siteDescription
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_START_DATE=2025-01-01
"@

# 添加可选配置
if (![string]::IsNullOrWhiteSpace($ownerEmail)) {
    $content += "`n# 管理员邮箱`nNEXT_PUBLIC_OWNER_EMAILS=$ownerEmail"
}

# 写入文件
$content | Out-File -FilePath .env.local -Encoding utf8

Write-Host ""
Write-Host "✅ .env.local 文件已创建！" -ForegroundColor Green
Write-Host ""
Write-Host "下一步：" -ForegroundColor Cyan
Write-Host "1. 检查 .env.local 文件内容是否正确" -ForegroundColor White
Write-Host "2. 运行 npm run dev 重启开发服务器" -ForegroundColor White
Write-Host "3. 访问 http://localhost:3000/firebase-setup 验证配置" -ForegroundColor White

