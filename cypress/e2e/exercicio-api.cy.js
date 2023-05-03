/// <reference types="cypress" />
import contrato from '../contracts/usuarios.produtos'

describe('Testes da Funcionalidade Usuários', () => {

    it('Deve validar contrato de usuários', () => {
         cy.request('usuarios').then(response =>{
            return contrato.validateAsync(response.body)
         })
    });

    it('Deve listar usuários cadastrados', () => {
         cy.request({
            method:'GET',
            url:'usuarios',
         }).then(response=>{
            expect(response.body.usuarios[0].nome).to.equal("Fulano da Silva")
            expect(response.status).to.equal(200)
            expect(response.body).have.property('usuarios')
         })
    });

    it('Deve cadastrar um usuário com sucesso', () => {
        let email = `usuario.admin${Math.floor(Math.random()*1000)}@email.com.br`
        cy.cadastrarUsuario("Usuario Admin",email,"senha123","true").then(response=>{
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal("Cadastro realizado com sucesso")
        })
    });

    it('Deve validar um usuário com email inválido', () => {
            cy.cadastrarUsuario("Usuario Invalido","fulano@qa.com","teste123","true").then(response=>{
                expect(response.status).to.equal(400)
                expect(response.body.message).to.equal("Este email já está sendo usado")
            })
    });

    it('Deve editar um usuário previamente cadastrado', () => {
        let email = `maria.clara${Math.floor(Math.random()*1000)}@email.com.br`
        cy.cadastrarUsuario("Maria Clara",email,"senha123","true").then(response=>{
            let id = response.body._id
            cy.request({
                method:'PUT',
                url:`usuarios/${id}`,
                body:{
                        "nome":"Maria Clara editado",
                        "email":email,
                        "password":"senha123",
                        "administrador":"true"
                }
            }).then(response=>{
                    expect(response.status).to.equal(200)
                    expect(response.body.message).to.equal("Registro alterado com sucesso")
                })
            
        })
    });

    it('Deve deletar um usuário previamente cadastrado', () => {
        let email = `maria.clara${Math.floor(Math.random()*1000)}@email.com.br`
        cy.cadastrarUsuario("Maria Clara",email,"senha123","true").then(response=>{
            let id = response.body._id
            cy.request({
                method:'DELETE',
                url:`usuarios/${id}`,
            }).then(response=>{
                    expect(response.status).to.equal(200)
                    expect(response.body.message).to.equal("Registro excluído com sucesso")
                })
    });


});
})