'use strict'

const Mail = use('Mail')

class NewUserMail {
  // quantos jobs ao mesmo tempo
  static get concurrency () {
    return 1
  }

  // chave unica para cada job
  static get key () {
    return 'NewUserMail-job'
  }

  // a logica pra enviar
  async handle ({ email, link }) {
    try {
      await Mail.send(
        ['emails.new_user'],
        { email, link },
        message => {
          message
            .to(email)
            .from('teste@teste.com', 'teste')
            .subject('cadastro relizado!')
        }
      )
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = NewUserMail
