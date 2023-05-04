/// <reference types = "cypress" />

describe('Login - Teste da API ServerRest', ()=>{
    it('Deve fazer login com sucesso',()=>{
        let email = `usuario.admin${Math.floor(Math.random() * 1000)}@email.com.br`
        cy.cadastrarUsuario("Usuario Admin", email, "senha123", "true").then(response => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal("Cadastro realizado com sucesso")
        })
        cy.request({
            method:'POST',
            url:"https://serverest.dev/login",
            body: {
                "email": email,
                "password": "senha123"
              }
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal('Login realizado com sucesso')
            cy.log(response.body.authorization)
        })
    })
})