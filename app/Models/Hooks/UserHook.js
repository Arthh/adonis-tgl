'use strict'

const Kue = use('Kue')
const Job = use('App/Jobs/NewUserMail')

const UserHook = exports = module.exports = {}

UserHook.sendNewUser = async (userInstance) => {
  const { email } = await userInstance

  Kue.dispatch(Job.key, { email, link: 'https://www.oi.com.br' }, { attempts: 3 })
}
