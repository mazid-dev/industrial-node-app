pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "mazidhossain/industrial-node-app:latest"
        // আপনার বিল্ড নাম্বার অনুযায়ী ট্যাগ সেট করা (ইমেজ ক্যাশিং এড়াতে এটি সেরা উপায়)
        BUILD_TAG = "v${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/mazid-dev/industrial-node-app.git'
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    // ইমেজ বিল্ড (v1, v2 ট্যাগ সহ)
                    sh "docker build -t ${DOCKER_IMAGE} ."
                    sh "docker tag ${DOCKER_IMAGE} mazidhossain/industrial-node-app:${BUILD_TAG}"
                    
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                        sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"
                        // latest এবং ভার্সন ট্যাগ দুটোই পুশ করা
                        sh "docker push ${DOCKER_IMAGE}"
                        sh "docker push mazidhossain/industrial-node-app:${BUILD_TAG}"
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    withKubeConfig([credentialsId: 'kubeconfig']) {
                        // ১. কনফিগারেশন ফাইল অ্যাপ্লাই
                        sh "kubectl apply -f k8s/deployment.yaml"
                        
                        // ২. ইমেজের নতুন ট্যাগ সেট করা (এটিই আপনার অটো-আপডেট নিশ্চিত করবে)
                        sh "kubectl set image deployment/industrial-app app=mazidhossain/industrial-node-app:${BUILD_TAG}"
                        
                        // ৩. রোলআউট স্ট্যাটাস চেক
                        sh "kubectl rollout status deployment/industrial-app"
                    }
                }
            }
        }
    }
    
    post {
        always {
            sh "docker logout"
        }
    }
}