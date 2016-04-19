@echo Off
pushd %~dp0
setlocal

:Build
call npm install
call npm run check
call npm run build
call npm run lint
call npm run coverage:teamcity
call npm run integration-test

if %ERRORLEVEL% neq 0 goto BuildFail
goto BuildSuccess

:BuildFail
echo.
echo *** BUILD FAILED ***
goto End

:BuildSuccess
echo.
echo *** BUILD SUCCEEDED ***
goto End

:End
echo.
popd
exit /B %ERRORLEVEL%
