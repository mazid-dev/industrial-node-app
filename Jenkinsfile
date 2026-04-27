pipeline {
    agent any
    environment {
        DOCKER_IMAGE = 'mazidhossain/industrial-node-app'
    }
    stages {
        stage('Checkout') { steps { checkout scm } }
        stage('Build') { steps { sh "docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} ." } }
        stage('Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-cred', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh "echo $PASS | docker login -u $USER --password-stdin"
                    sh "docker tag ${DOCKER_IMAGE}:${BUILD_NUMBER} ${DOCKER_IMAGE}:latest"
                    sh "docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}"
                    sh "docker push ${DOCKER_IMAGE}:latest"
                }
            }
        }
        stage('Deploy') {
            steps {
                withKubeConfig([credentialsId: 'kubeconfig']) {
                    sh "kubectl set image deployment/industrial-app app=${DOCKER_IMAGE}:${BUILD_NUMBER}"
                    sh "kubectl rollout status deployment/industrial-app"
                }
            }
        }
    }
}