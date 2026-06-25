@REM ----------------------------------------------------------------------------
@REM Maven Wrapper Startup Script for Windows
@REM ----------------------------------------------------------------------------
@echo off
setlocal enabledelayedexpansion

set "MAVEN_PROJECTBASEDIR=%~dp0"
set "MVNW_REPOURL=https://repo.maven.apache.org/maven2"
set "MVNW_VERBOSE=false"

if not defined MAVEN_USER_HOME set "MAVEN_USER_HOME=%USERPROFILE%\.m2"

set "WRAPPER_DIR=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper"
set "WRAPPER_JAR=%WRAPPER_DIR%\maven-wrapper.jar"
set "WRAPPER_PROPS=%WRAPPER_DIR%\maven-wrapper.properties"

if not exist "%WRAPPER_JAR%" (
    echo 正在下载 Maven Wrapper...
    powershell -Command "Invoke-WebRequest -Uri '%MVNW_REPOURL%/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar' -OutFile '%WRAPPER_JAR%'" >nul 2>&1
    if not exist "%WRAPPER_JAR%" (
        echo 下载失败，请手动下载 maven-wrapper.jar 放到 .mvn\wrapper\ 目录
        exit /b 1
    )
)

rem Read MAVEN_CONFIG from properties file
set "DISTRIBUTION_URL="
for /f "tokens=1,* delims==" %%a in ('findstr "^distributionUrl" "%WRAPPER_PROPS%"') do set "DISTRIBUTION_URL=%%b"
if defined DISTRIBUTION_URL set "DISTRIBUTION_URL=%DISTRIBUTION_URL:~1%"

set "MAVEN_ZIP=%MAVEN_USER_HOME%\wrapper\dists\%DISTRIBUTION_URL:*apache-maven/=%"
set "MAVEN_HOME=%MAVEN_USER_HOME%\wrapper\dists\%DISTRIBUTION_URL:*apache-maven/=%"
set "MAVEN_HOME=%MAVEN_HOME:.zip=%"

rem Check if JDK is available
set "JAVA_HOME_CHECK="
for /f "tokens=*" %%i in ('where java 2^>nul') do set "JAVA_HOME_CHECK=%%i"
if not defined JAVA_HOME_CHECK (
    echo [错误] 未找到 JDK！
    echo 请在 Trae CN 中安装 Extension Pack for Java，它会自动安装 JDK 17
    echo 或手动下载 JDK 17: https://adoptium.net/download/
    exit /b 1
)

java -version 2>&1 | findstr "17" >nul
if errorlevel 1 (
    echo [警告] 当前不是 JDK 17，项目要求 JDK 17
)

if not exist "%MAVEN_HOME%" (
    echo 正在下载 Maven 3.9.6...
    mkdir "%MAVEN_HOME%" 2>nul
    powershell -Command "Invoke-WebRequest -Uri '%DISTRIBUTION_URL%' -OutFile '%TEMP%\maven.zip'" >nul 2>&1
    powershell -Command "Expand-Archive -Path '%TEMP%\maven.zip' -DestinationPath '%MAVEN_HOME%\..' -Force" >nul 2>&1
    if not exist "%MAVEN_HOME%\bin\mvn.cmd" (
        echo Maven 下载失败
        exit /b 1
    )
)

set "MAVEN_CMD=%MAVEN_HOME%\bin\mvn.cmd"
if not exist "%MAVEN_CMD%" (
    echo 未找到 Maven，请手动安装
    exit /b 1
)

echo [MediCare] 正在打包项目...
call "%MAVEN_CMD%" -f "%MAVEN_PROJECTBASEDIR%pom.xml" %*
exit /b %ERRORLEVEL%
