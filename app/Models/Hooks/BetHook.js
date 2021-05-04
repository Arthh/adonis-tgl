'use strict'

const Kue = use('Kue')
const Job = use('App/Jobs/NewBetMail')

const BetHook = exports = module.exports = {}

BetHook.sendNewBet = async (betInstance) => {
  const { numbers, price } = await betInstance

  const { type } = await betInstance.game().fetch()

  const { name, email } = await betInstance.user().fetch()

  Kue.dispatch(Job.key, { name, email, type, numbers, price }, { attempts: 3 })
}
