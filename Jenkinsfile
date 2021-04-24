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
                sh "npm install"
                sh "npx electron-packager . tungsteno-launcher --out build/ --overwrite"
                sh "cd build/tungsteno-launcher-linux-x64; zip -r ../../build.zip ."
                sh "mcli cp build.zip s3/tungsteno-releases/linux/$RELEASE_TYPE/tungsteno-launcher-$MAJOR_RELEASE.$MINOR_RELEASE.${BUILD_ID}.zip"
            }
        }

        stage('Generate build (Windows Binary)') {
            agent { label 'Windows' }
            steps{
                checkout scm

                bat "npm install"
                bat "npx electron-packager . tungsteno-launcher --out build/ --overwrite"
                bat "cd build/tungsteno-launcher-windows-x64; \"c:\\Program Files\\7-zip\\7z.exe\" a -tzip ..\\..\\build.zip -r ."
                bat "C:\\mc.exe cp build.zip s3/tungsteno-releases/windows/%RELEASE_TYPE%/tungsteno-amd64-%MAJOR_RELEASE%.%MINOR_RELEASE%.%BUILD_ID%.zip"

                deleteDir()
            }
        }

        stage('Clean up') {
            steps {
                deleteDir()
            }
        }

    }
}