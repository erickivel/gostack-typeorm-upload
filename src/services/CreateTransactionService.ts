import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    if (type === 'outcome') {
      const { total } = await transactionsRepository.getBalance();

      if (total < value) {
        throw new AppError('The total value is less than outcome value!', 400);
      }
    }

    const existsCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!existsCategory) {
      const newCategory = categoriesRepository.create({ title: category });
      await categoriesRepository.save(newCategory);

      const transactionWithNewCategory = transactionsRepository.create({
        title,
        value,
        type,
        category: newCategory,
      });

      await transactionsRepository.save(transactionWithNewCategory);

      return transactionWithNewCategory;
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: existsCategory,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
