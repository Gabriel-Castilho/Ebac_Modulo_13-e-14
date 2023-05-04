/// <reference types = "cypress" />
import contrato from '../contracts/produtos.contract'

describe('Teste da funcionalidade produtos', () => {

    let token
    let email = `usuario.admin${Math.floor(Math.random() * 1000)}@email.com.br`
    let senha = "senha123"
    before(() => {

        cy.cadastrarUsuario("Usuario Admin", email, senha, "true").then(response => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal("Cadastro realizado com sucesso")
        })

        cy.token(email, senha).then(tkn => {
            token = tkn

        })
    })

    it('Deve validar contrato de produtos', () => {
        cy.request('produtos').then(response => {
            return contrato.validateAsync(response.body)
        })
    })

    it('Listar produtos', () => {
        cy.request({
            method: 'GET',
            url: 'produtos'
        }).then((response) => {
            expect(response.body.produtos[0].nome).to.contain("Logitech")
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('produtos')
            expect(response.duration).to.be.lessThan(500)
        })
    });

    it('Cadastrar produto', () => {
        let produto = `Headset Gamer modelo ${Math.floor(Math.random() * 1000000)}`
        cy.cadastrarProduto(token, produto, 200, "Descrição do produto novo inserido", 400).then(response => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })
    });

    it('Deve validar mensagem de erro ao cadastrar produto repetido', () => {
        cy.cadastrarProduto(token, "Samsung 60 polegadas", 5240, "Descrição produto existente", 400)
            .then(response => {
                expect(response.status).to.equal(400)
                expect(response.body.message).to.equal('Já existe produto com esse nome')
            })
    })

    it('Deve editar um produto cadastrado', () => {
        let quantidade = Math.floor(Math.random() * 999)
        cy.request('produtos').then(response => {
            let id = response.body.produtos[0]._id
            cy.request({
                method: 'PUT',
                url: `produtos/${id}`,
                headers: { authorization: token },
                body:
                {
                    "nome": "Logitech MX Vertical editado",
                    "preco": 470,
                    "descricao": "Mouse",
                    "quantidade": quantidade,
                }
            }).then(response => {
                expect(response.body.message).to.equal("Registro alterado com sucesso")
            })
        })
    })

    it("Deve editar um produto cadastrado previamente", () => {
        let quantidade = Math.floor(Math.random() * 999)
        let produto = `Headset Gamer modelo ${Math.floor(Math.random() * 1000000)} editado`
        cy.cadastrarProduto(token, produto, 250, "Descrição produto novo", 180)
            .then(response => {
                let id = response.body._id
                cy.request({
                    method: 'PUT',
                    url: `produtos/${id}`,
                    headers: { authorization: token },
                    body:
                    {
                        "nome": produto,
                        "preco": 470,
                        "descricao": "Mouse",
                        "quantidade": quantidade,
                    }
                }).then(response => {
                    expect(response.body.message).to.equal("Registro alterado com sucesso")
                })
            })
    })

    it("Deve deletar um produto previamente cadastrado", () => {
        let produto = `Headset Gamer modelo ${Math.floor(Math.random() * 1000000)} editado`
        cy.cadastrarProduto(token, produto, 250, "Descrição produto novo", 180)
            .then(response => {
                let id = response.body._id
                cy.request({
                    method: 'DELETE',
                    url: `produtos/${id}`,
                    headers: { authorization: token },
                }).then(response => {
                    expect(response.body.message).to.equal("Registro excluído com sucesso")
                    expect(response.status).to.equal(200)
                })
            })
    })


});