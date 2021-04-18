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
                sh "npx electron-packager . tungsteno-launcher --out build/"
                sh "zip -r build.zip build/*"
                // sh "sleep 5"
                // sh "mcli cp build.zip s3/tungsteno-releases/linux/$RELEASE_TYPE/tungsteno-launcher-$MAJOR_RELEASE.$MINOR_RELEASE.$BUILD_ID.zip"
            }
        }

        stage('Generate build (Windows Binary)') {
            agent { label 'Windows' }
            steps{
                checkout scm

                bat "npm install"
                bat "npx electron-packager . tungsteno-launcher --out build/"
                // bat "C:\\mc.exe cp dist/tungsteno.exe s3/tungsteno-releases/windows/%RELEASE_TYPE%/tungsteno-amd64-%MAJOR_RELEASE%.%MINOR_RELEASE%.%BUILD_ID%.exe"

                // deleteDir()
            }
        }

        stage('Clean up') {
            steps {
                deleteDir()
            }
        }

    }
}