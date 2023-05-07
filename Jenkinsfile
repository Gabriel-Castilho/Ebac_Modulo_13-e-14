pipeline {
    agent any

    stages {
        stage('Clonar repositorio') {
            steps {
                git branch: 'master', url: 'https://github.com/Gabriel-Castilho/Testes-Automatizados-API-Jenkins'
            }
        }
        stage('Instalar dependencias') {
            steps {
               bat 'npm install'
            }
        }
        stage('Executar testes') {
            steps {
              bat 'npm run cy:run'
            }
        }
    }
}