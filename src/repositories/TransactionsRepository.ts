import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsRepository = getRepository(Transaction);
    const transactions = await transactionsRepository.find();

    const arrayOfIncomeTransactions = transactions.filter(
      transaction => transaction.type === 'income',
    );
    const income = arrayOfIncomeTransactions.reduce(
      (sum, transaction) => sum + transaction.value,
      0,
    );

    const arrayOfOutcomeTransactions = transactions.filter(
      transaction => transaction.type === 'outcome',
    );
    const outcome = arrayOfOutcomeTransactions.reduce(
      (sum, transaction) => sum + transaction.value,
      0,
    );

    const total = income - outcome;

    const balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }
}

export default TransactionsRepository;
