import { default as models } from '../models/index';
import of from 'await-of';
import Sequelize from 'sequelize';
import uuidv1 from 'uuid/v1'
import { BadRequestError, ServiceUnavailableError } from '../errors';
import Responder from '../lib/expressResponder';
import logger from '../lib/logger'
const { Op } = Sequelize
const { user, transaction } = models;
let insertDB
const currencies = ['bitcoin', 'ethereum']
let balance, wallet, max, currency
export default class Transactions {

  static async validateAndPerformTransaction(req, res) {
    //transaction object
    let transactionObj = req.body
    logger.info("validateAndPerformTransaction begin for transaction", transactionObj)
    transactionObj.transactionId = uuidv1()
    logger.info("Transaction Id", transactionObj.transactionId)
    //variable for key for generic for all currencies
    currency = transactionObj.currencyType
    balance = currency + 'Balance'
    wallet = currency + 'Wallet'
    max = 'max' + currency.charAt(0).toUpperCase() + currency.slice(1)

    //time when transaction begun
    transactionObj.createdAt = Date.now();
    logger.info("transaction begun at", transactionObj.createdAt)
    //validate transaction
    logger.info("Validating Transaction")
    const validateRes = await Transactions.validateTransaction(req,transactionObj)
    //if not valid return error
    if (!validateRes.valid) return Responder.operationFailed(res, new BadRequestError(validateRes))
    //if valid then perform it 
    logger.info("Transaction Validated")
    logger.info("Performing Transaction")
    const response = await Transactions.performTransaction(req,transactionObj, validateRes.sourceUser, validateRes.targetUser)
    logger.info("Transaction Response", response)
    Responder.created(res, response)

  }
  static async validateTransaction(req,transactionObj) {
    //currency check
    logger.info("Validating Currency type")
    if (!currencies.includes(currency)) return { valid: false, message: 'Invalid Currency' }
    // zero amount check    
    if (transactionObj.currencyAmount <= 0) return { valid: false, message: 'Invalid Amount' }

    //retrieve source user account from DB
    let query = {}
    query["email"] = req.session.user.email
    logger.info("Fetching user for email id", query)
    let [sourceUser, sourceError] = await of(user.findOne({ where: query }))

    if (!(sourceUser !== null && sourceUser !== '')) {
      return { valid: false, message: 'user not found' }
    }
    sourceUser = sourceUser.dataValues

    //check if transaction amount is less than max
    if (sourceUser[max] < transactionObj.currencyAmount)
      return { valid: false, message: 'Transaction amount greater than limit' }
    //check account have sufficient balance 
    if (sourceUser[balance] < transactionObj.currencyAmount)
      return { valid: false, message: 'Insufficient Balance' }

    //retrieve target account 
    query = {}
    query[wallet] = transactionObj.targetWallet

    let [targetUser, err2] = await of(user.findOne({ where: query }))
    if (!(targetUser !== null && targetUser !== '')) {
      return { valid: false, message: 'user not found' }
    }
    targetUser = targetUser.dataValues

    //check for accepting max currency by target
    if (targetUser[max] < transactionObj.currencyAmount) {
      return { valid: false, message: 'Transaction amount greater than limit' }
    }
    //if all pass return valid signal
    return { valid: true, sourceUser, targetUser, message: 'Transaction valid' }
  }
  static async performTransaction(req,transactionObj, sourceUser, targetUser) {
    //update source user account 
    let sourceUpdate = {}
    sourceUpdate[balance] = sourceUser[balance] - transactionObj.currencyAmount
    let query = {}
    query[wallet] = sourceUser[wallet]
    query["email"] = req.session.user.email

    insertDB = await of(user.update(sourceUpdate, { where: query }))
    if (insertDB[1]) return { status: 500, error: insertDB[1] }

    //update target user account
    let targetUpdate = {}
    targetUpdate[balance] = targetUser[balance] - transactionObj.currencyAmount
    query = {}
    query[wallet] = targetUser[wallet]

    insertDB = await of(user.update(targetUpdate, { where: query }))
    if (insertDB[1]) return { status: 500, error: insertDB[1] }
    //add transaction to DB and then return response 

    //transaction object
    transactionObj.sourceUserId = sourceUser["email"]
    transactionObj.targetUserId = targetUser["email"]
    delete transactionObj.targetWallet
    return await Transactions.insertTransaction(transactionObj)
  }
  static async insertTransaction(transactionObj) {
    //current time when transaction is processed
    transactionObj.processedAt = Date.now();
    transactionObj.state = 'success'
    insertDB = await of(transaction.create(transactionObj))
    if (insertDB[1]) {
      return { status: 500, error: insertDB[1] }
    }
    return { status: 201, Response: { transactionObj, message: 'transaction confirmed' } }
  }
  static async transactionHistory(req, res) {
    let email = req.session.user.email
    let currencyType = req.body.currencyType
    const [userTx, TxFetchError] = await of(transaction.findAll({
      where: { currencyType, [Op.or]: [{ sourceUserId: email }, { targetUserId: email }] }
    }))
    let Sent = []
    let Received = []
    if (userTx == null) return Responder.success(res, { Transactions: { Sent: [], Received: [] } })

    userTx.forEach(element => {
      element.sourceUserId == name ? Sent.push(element) : Received.push(element)
    });
    if (TxFetchError) Responder.operationFailed(res, new ServiceUnavailableError("DB Error"))
    return Responder.success(res, { Transactions: { Sent, Received } })
  }
  static async transactionStatus(req, res) {
    const transactionId = req.body.transactionId
    const regEx = /^[0-9A-F]{8}-[0-9A-F]{4}-[1][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
    if (!regEx.test(transactionId)) Responder.operationFailed(res, new BadRequestError("Invalid Transaction ID"))
    const [fetchTx, fetchEr] = await of(transaction.findOne({ where: { transactionId } }))
    if (fetchEr) Responder.operationFailed(res, new ServiceUnavailableError("DB Error"))
    return Responder.success(res, { TransactionStatus: fetchTx.dataValues.state })
  }
}

