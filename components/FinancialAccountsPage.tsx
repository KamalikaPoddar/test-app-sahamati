'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NomineeAllocationPopup } from './NomineeAllocationPopup'

interface FinancialAccount {
  id: string
  bankName: string
  accountType: string
  accountNumber: string
  balance: number
  hasNominee: boolean
}

export default function FinancialAccountsPage() {
  const [accounts, setAccounts] = useState<FinancialAccount[]>([])
  const [selectedAccount, setSelectedAccount] = useState<FinancialAccount | null>(null)
  const [isNomineePopupOpen, setIsNomineePopupOpen] = useState(false)

  useEffect(() => {
    // In a real application, this would be an API call to fetch the user's accounts
    const fetchAccounts = async () => {
      // Simulating an API call with dummy data
      const dummyAccounts: FinancialAccount[] = [
        { id: '1', bankName: 'Ignosis Bank', accountType: 'Savings', accountNumber: 'XXXX6f22', balance: 50000, hasNominee: true },
        { id: '2', bankName: 'Ignosis Bank', accountType: 'Term Deposit', accountNumber: 'XXXX1201', balance: 105622, hasNominee: false },
        { id: '3', bankName: 'Ignosis Bank', accountType: 'Recurring Deposit', accountNumber: 'XXXX9012', balance: 20, hasNominee: false },
         { id: '4', bankName: 'BankB', accountType: 'Savings', accountNumber: 'XXXX9012', balance: 100000, hasNominee: false },
      ]
      setAccounts(dummyAccounts)
    }

    fetchAccounts()
  }, [])

  const handleAddNominee = (account: FinancialAccount) => {
    setSelectedAccount(account)
    setIsNomineePopupOpen(true)
  }

  const handleNomineeAdded = (accountId: string) => {
    setAccounts(accounts.map(account => 
      account.id === accountId ? { ...account, hasNominee: true } : account
    ))
    setIsNomineePopupOpen(false)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Financial Accounts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map(account => (
          <Card key={account.id}>
            <CardHeader>
              <CardTitle>{account.bankName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Account Type:</strong> {account.accountType}</p>
              <p><strong>Account Number:</strong> {account.accountNumber}</p>
              <p><strong>Balance:</strong> ₹{account.balance.toLocaleString()}</p>
              <p><strong>Nominee Status:</strong> {account.hasNominee ? 'Registered' : 'Not Registered'}</p>
              {!account.hasNominee && (
                <Button onClick={() => handleAddNominee(account)} className="mt-2">
                  Add Nominee
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedAccount && (
        <NomineeAllocationPopup
          isOpen={isNomineePopupOpen}
          onClose={() => setIsNomineePopupOpen(false)}
          account={selectedAccount}
          onNomineeAdded={handleNomineeAdded}
        />
      )}
    </div>
  )
}
