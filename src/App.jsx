import { useState } from 'react';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [editingId, setEditingId] = useState(null);

  const addExpense = () => {
    if (description && amount) {
      if (editingId !== null) {
        setExpenses(expenses.map(exp => exp.id === editingId ? { ...exp, description, amount: parseFloat(amount) } : exp));
        setEditingId(null);
      } else {
        setExpenses([...expenses, { id: Date.now(), description, amount: parseFloat(amount) }]);
      }
      setDescription('');
      setAmount('');
    }
  };

  const editExpense = (id) => {
    const expense = expenses.find(exp => exp.id === id);
    setDescription(expense.description);
    setAmount(expense.amount);
    setEditingId(id);
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="app">
      <h1>Expense Tracker</h1>
      <div className="add-expense">
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={addExpense}>{editingId !== null ? 'Update Expense' : 'Add Expense'}</button>
      </div>
      <ul className="expense-list">
        {expenses.map((expense) => (
          <li key={expense.id}>
            {expense.description}: ${expense.amount.toFixed(2)}
            <button onClick={() => editExpense(expense.id)}>edit</button>
            <button onClick={() => deleteExpense(expense.id)}>del</button>
          </li>
        ))}
      </ul>
      <h2>Total: ${total.toFixed(2)}</h2>
    </div>
  );
}

export default App;
