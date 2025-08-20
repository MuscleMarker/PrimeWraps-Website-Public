import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  username: string;
}

interface Expense {
  id: number;
  description: string;
  amount: number;
  paidByUser: {
    id: number;
    username: string;
  };
  createdBy: {
    id: number;
    username: string;
  };
  sharedExpense: boolean;
  splitCount: number;
  date: string;
  splitUsers: {
    id: number;
    userId: number;
    username: string;
  }[];
}

interface Settlement {
  fromUser: string;
  toUser: string;
  amount: number;
  description: string;
}

interface ExistingSettlement {
  id: number;
  fromUser: {
    id: number;
    username: string;
  };
  toUser: {
    id: number;
    username: string;
  };
  amount: number;
  status: string;
}

interface SettlementCalculatorProps {
  refreshTrigger?: number;
}

const SettlementCalculator: React.FC<SettlementCalculatorProps> = ({ refreshTrigger = 0 }) => {

  const [users, setUsers] = useState<User[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [existingSettlements, setExistingSettlements] = useState<ExistingSettlement[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [userBalances, setUserBalances] = useState<Map<number, number>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>('ALL');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (users.length > 0 && expenses.length > 0) {
      calculateSettlements();
    }
  }, [users, expenses, existingSettlements, selectedUser]);

  // Refresh when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchData();
    }
  }, [refreshTrigger]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jwtToken');
      
      // Fetch users
      const usersResponse = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsers(usersResponse.data);

      // Fetch shared expenses
      const expensesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/expenses/shared`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setExpenses(expensesResponse.data);
      console.log('SettlementCalculator: Fetched', expensesResponse.data.length, 'shared expenses');
      console.log('SettlementCalculator: Expense details:', expensesResponse.data);

      // Fetch existing settlements (both pending and paid)
      const settlementsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/settlements`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setExistingSettlements(settlementsResponse.data);
      console.log('SettlementCalculator: Fetched', settlementsResponse.data.length, 'existing settlements');
      console.log('SettlementCalculator: Settlement details:', settlementsResponse.data);

      setError(null);
      setLastRefresh(new Date());
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  const calculateSettlements = () => {
    console.log('SettlementCalculator: Starting calculation with', users.length, 'users and', expenses.length, 'expenses');

    const userBalances = new Map<number, number>();
    const userNames = new Map<number, string>();

    // Initialize user balances and names
    users.forEach(user => {
      userBalances.set(user.id, 0);
      userNames.set(user.id, user.username);
    });

    // Calculate balances from shared expenses
    expenses.forEach(expense => {
      console.log('SettlementCalculator: Processing expense:', expense);
      if (expense.sharedExpense && expense.splitCount > 1 && expense.paidByUser) {
        const paidByUserId = expense.paidByUser.id;
        // Use integer arithmetic to avoid floating point precision errors
        const amountPerPerson = Math.round((expense.amount * 100) / expense.splitCount) / 100;
        console.log('SettlementCalculator: Expense is shared, paidByUserId:', paidByUserId, 'amountPerPerson:', amountPerPerson);

        // Add the full amount to the person who paid
        const currentBalance = userBalances.get(paidByUserId)!;
        userBalances.set(paidByUserId, currentBalance + expense.amount);

        // Subtract the payer's own share from their balance
        userBalances.set(paidByUserId, userBalances.get(paidByUserId)! - amountPerPerson);

        // Subtract the split amount from each other person in the split
        console.log('SettlementCalculator: splitUsers array:', expense.splitUsers);
        expense.splitUsers.forEach(splitUser => {
          console.log('SettlementCalculator: Processing splitUser:', splitUser.userId, 'subtracting:', amountPerPerson);
          const currentBalance = userBalances.get(splitUser.userId)!;
          userBalances.set(splitUser.userId, currentBalance - amountPerPerson);
          console.log('SettlementCalculator: Updated balance for user', splitUser.userId, 'to:', userBalances.get(splitUser.userId));
        });
        
        console.log('SettlementCalculator: After processing expense, balances:', Object.fromEntries(userBalances));
      } else {
        console.log('SettlementCalculator: Expense skipped - sharedExpense:', expense.sharedExpense, 'splitCount:', expense.splitCount, 'paidByUser:', expense.paidByUser);
      }
    });

    // Account for existing settlements (both pending and paid)
    console.log('SettlementCalculator: Processing', existingSettlements.length, 'existing settlements');
    existingSettlements.forEach(settlement => {
      console.log('SettlementCalculator: Processing settlement:', settlement);
      
      // For PAID settlements, the debt has been settled
      if (settlement.status === 'PAID') {
        // fromUser (debtor) has paid toUser (creditor)
        // This reduces the debt that fromUser owes and reduces what toUser is owed
        
        // fromUser (debtor) gets credited (reduces their negative balance)
        const fromUserBalance = userBalances.get(settlement.fromUser.id) || 0;
        userBalances.set(settlement.fromUser.id, fromUserBalance + settlement.amount);
        
        // toUser (creditor) gets debited (reduces their positive balance)
        const toUserBalance = userBalances.get(settlement.toUser.id) || 0;
        userBalances.set(settlement.toUser.id, toUserBalance - settlement.amount);
        
        console.log('SettlementCalculator: PAID settlement processed - fromUser (debtor):', settlement.fromUser.username, 'toUser (creditor):', settlement.toUser.username, 'amount:', settlement.amount);
        console.log('SettlementCalculator: fromUser balance changed from', fromUserBalance, 'to', userBalances.get(settlement.fromUser.id));
        console.log('SettlementCalculator: toUser balance changed from', toUserBalance, 'to', userBalances.get(settlement.toUser.id));
      }
      // For PENDING settlements, the debt is still outstanding, so we don't adjust balances
      // The original expense calculation already accounts for the full debt
    });

    console.log('SettlementCalculator: Final balances after settlements:', Object.fromEntries(userBalances));

    // Save the calculated balances to state
    setUserBalances(new Map(userBalances));

    // Calculate settlements
    const newSettlements: Settlement[] = [];
    const processedUsers = new Set<number>();

    users.forEach(user => {
      if (processedUsers.has(user.id)) return;

      const balance = userBalances.get(user.id)!;
      if (Math.abs(balance) < 0.01) return; // Skip if balance is essentially zero

      if (balance > 0) {
        // This user is owed money
        users.forEach(otherUser => {
          if (otherUser.id === user.id || processedUsers.has(otherUser.id)) return;

          const otherBalance = userBalances.get(otherUser.id)!;
          if (otherBalance < 0) {
            // This user owes money
            const settlementAmount = Math.min(balance, Math.abs(otherBalance));
            if (settlementAmount > 0.01) {
              newSettlements.push({
                fromUser: otherUser.username,
                toUser: user.username,
                amount: settlementAmount,
                description: `Settlement for shared expenses`
              });

              // Update balances
              userBalances.set(user.id, balance - settlementAmount);
              userBalances.set(otherUser.id, otherBalance + settlementAmount);

              if (Math.abs(userBalances.get(user.id)!) < 0.01) {
                processedUsers.add(user.id);
              }
              if (Math.abs(userBalances.get(otherUser.id)!) < 0.01) {
                processedUsers.add(otherUser.id);
              }
            }
          }
        });
      }
    });

    setSettlements(newSettlements);
  };

  

  const getTotalExpensesByUser = (userId: number) => {
    return expenses
      .filter(expense => expense.paidByUser && expense.paidByUser.id === userId)
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getSharedExpensesByUser = (userId: number) => {
    return expenses
      .filter(expense => expense.sharedExpense && expense.paidByUser && expense.paidByUser.id === userId)
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getTotalOwedByUser = (userId: number) => {
    return expenses
      .filter(expense => expense.sharedExpense && expense.splitCount > 1)
      .reduce((sum, expense) => {
        const isUserInSplit = expense.splitUsers.some(split => split.userId === userId);
        if (isUserInSplit) {
          // Use integer arithmetic to avoid floating point precision errors
          const amountPerPerson = Math.round((expense.amount * 100) / expense.splitCount) / 100;
          return sum + amountPerPerson;
        }
        return sum;
      }, 0);
  };

  const getNetBalance = (userId: number) => {
    // Use the calculated balances that account for existing settlements
    return userBalances.get(userId) || 0;
  };

  const filteredUsers = selectedUser === 'ALL' 
    ? users 
    : users.filter(user => user.username === selectedUser);

  if (loading) {
    return <div className="text-center py-8">Loading settlement data...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 font-gwendolyn">Settlement Calculator</h2>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by User:</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="ALL">All Users</option>
            {users.map(user => (
              <option key={user.id} value={user.username}>
                {user.username}
              </option>
            ))}
          </select>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            title="Refresh Data"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${loading ? 'animate-spin' : ''}`}>
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
            </svg>
            <span className="text-sm">Refresh</span>
          </button>
          {lastRefresh && (
            <span className="text-xs text-gray-500">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-600">Total Shared Expenses</h3>
          <p className="text-2xl font-bold text-blue-800">
            ${expenses
              .filter(expense => expense.sharedExpense)
              .reduce((sum, expense) => sum + expense.amount, 0)
              .toFixed(2)}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-600">Total Settlements</h3>
          <p className="text-2xl font-bold text-green-800">
            ${settlements.reduce((sum, settlement) => sum + settlement.amount, 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-600">Pending Settlements</h3>
          <p className="text-2xl font-bold text-yellow-800">{settlements.length}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-600">Team Members</h3>
          <p className="text-2xl font-bold text-purple-800">{users.length}</p>
        </div>
      </div>

      {/* User Balances */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">User Balances</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">User</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Total Paid</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Shared Expenses</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Total Owed</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Net Balance</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const totalPaid = getTotalExpensesByUser(user.id);
                const sharedExpenses = getSharedExpensesByUser(user.id);
                const totalOwed = getTotalOwedByUser(user.id);
                const netBalance = getNetBalance(user.id);
                
                return (
                  <tr key={user.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-700">{user.username}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">${totalPaid.toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">${sharedExpenses.toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">${totalOwed.toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm font-semibold">
                      <span className={netBalance >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {netBalance >= 0 ? '+' : ''}${netBalance.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Settlements */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Settlements</h3>
        {settlements.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No settlements needed. All expenses are balanced.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">From</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">To</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Amount</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Description</th>
                </tr>
              </thead>
              <tbody>
                {settlements.map((settlement, index) => (
                  <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-red-600">
                      {settlement.fromUser}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-green-600">
                      {settlement.toUser}
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-700">
                      ${settlement.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {settlement.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">How Settlements Work:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Total Paid:</strong> Amount the user has paid for all expenses</li>
          <li>• <strong>Shared Expenses:</strong> Amount the user has paid for shared expenses</li>
          <li>• <strong>Total Owed:</strong> Amount the user owes for their share of shared expenses</li>
          <li>• <strong>Net Balance:</strong> Positive = money owed to them, Negative = money they owe</li>
          <li>• <strong>Settlements:</strong> Shows who needs to pay whom to balance everything</li>
        </ul>
      </div>
    </div>
  );
};

export default SettlementCalculator;
