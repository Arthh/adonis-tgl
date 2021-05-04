'use strict'

const Mail = use('Mail')

class NewBetMail {
  static get concurrency () {
    return 1
  }

  static get key () {
    return 'NewBetMail-job'
  }

  async handle ({ name, email, type, numbers, price }) {
    console.log('entrou handle')
    try {
      console.log('entrou try')
      await Mail.send(
        ['emails.new_bet'],
        { name, type, numbers, price },
        message => {
          message
            .to(email)
            .from('teste@teste.com', 'teste')
            .subject('Nova bet!')
        }
      )
      console.log('foi')
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = NewBetMail
