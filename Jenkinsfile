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
            // ১. কন্টেইনারের ইমেজ আপডেট করা (ইমেজ ট্যাগ ৪ বা লেটেস্ট যাই হোক)
            sh "kubectl set image deployment/industrial-app app=mazidhossain/industrial-node-app:4"
            
            // ২. ফোর্স রিস্টার্ট (এটি নিশ্চিত করবে আপনার নতুন কোড ব্রাউজারে দেখা যাচ্ছে)
            sh "kubectl rollout restart deployment/industrial-app"
            
            // ৩. স্ট্যাটাস চেক
            sh "kubectl rollout status deployment/industrial-app"
        }
    }
}