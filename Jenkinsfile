pipeline {
    agent any

    environment {
        MAJOR_RELEASE = "1"
        MINOR_RELEASE = "0"
        RELEASE_TYPE = "launcher"
        RELEASE_CAPTION = "v$MAJOR_RELEASE.$MINOR_RELEASE.$BUILD_ID"
        GIT_LOCAL_BRANCH = "master"
    }

    stages {
        stage('Build') {
            steps {
                sh 'printenv'
            }
        }

        stage('Generate build (Linux Binary)') {
            steps {
                sh "sed -i 's/prebuild/$MAJOR_RELEASE.$MINOR_RELEASE.${BUILD_ID}/g' package.json"
                sh "npm install"
                sh "npx electron-packager . tungsteno-launcher --out build/ --overwrite --icon=assets/logo_app.png"
                sh "npx electron-packager . tungsteno-launcher --out build/ --overwrite --platform=win32 --arch=x64 --icon=assets/logo_app.png"
                sh "npx electron-installer-debian --src build/tungsteno-launcher-linux-x64/ --arch amd64 --config installers/linux/debian.json"
                sh "node installers/windows/create_installer.js"
                sh "cd build/tungsteno-launcher-linux-x64; zip -r ../../build-linux.zip ."
                sh "cd build/tungsteno-launcher-win32-x64; zip -r ../../build-windows.zip ."

                sh "mcli cp build-linux.zip s3/tungsteno-releases/linux/$RELEASE_TYPE/tungsteno-launcher-$MAJOR_RELEASE.$MINOR_RELEASE.${BUILD_ID}.zip"
                sh "mcli cp build-windows.zip s3/tungsteno-releases/windows/$RELEASE_TYPE/tungsteno-launcher-$MAJOR_RELEASE.$MINOR_RELEASE.${BUILD_ID}.zip"
                sh "mcli cp build/debian-installer/tungsteno-launcher_$MAJOR_RELEASE.$MINOR_RELEASE.${BUILD_ID}_amd64.deb s3/tungsteno-releases/debian/installer/tungsteno-launcher-$MAJOR_RELEASE.$MINOR_RELEASE.${BUILD_ID}.deb"

            }
        }

        stage('Clean up') {
            steps {
                // deleteDir()
            }
        }
    }
}