import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getRepository(Transaction);
    const transaction = await transactionsRepository.findOne({ id });

    if (!transaction) {
      throw new AppError('Transaction id is not found.');
    }

    await transactionsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
