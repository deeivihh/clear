@echo off
upx --ultra-brute src-tauri\target\x86_64-pc-windows-msvc\release\clear.exe
makensis "/XOutFile '..\builds\setup\clear v1.1.0 setup.exe'" scripts\installer.nsi
copy "src-tauri\target\x86_64-pc-windows-msvc\release\clear.exe" "builds\portable\clear v1.1.0 portable.exe" 
echo ===----------------------------------------------------------------------------------------------------------------------------
echo ===   portable available in %cd%\builds\portable\
echo ===   setup available in %cd%builds\setup\
echo ===   following are the tauri auto generated bundles
echo ===----------------------------------------------------------------------------------------------------------------------------