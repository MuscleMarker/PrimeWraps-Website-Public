# 💰 Settlement Payment Guide

## How to Zero Out Settlements When Someone Pays

The settlement system allows you to mark settlements as paid, which effectively "zeros them out" from the pending settlements list.

### **Methods to Mark Settlements as Paid:**

#### **1. Using the Admin Dashboard (Recommended)**

1. **Navigate to the Payments Tab**
   - Go to Admin Dashboard
   - Click on the "Payments" tab
   - You'll see all pending settlements that need to be paid

2. **Mark a Settlement as Paid**
   - Select a payment method (Cash, Venmo, PayPal, Zelle, etc.)
   - Add optional notes about the payment
   - Click "Mark as Paid"
   - The settlement will be removed from pending and marked as PAID

#### **2. Using the API Directly**

```bash
# Mark a settlement as PAID
PATCH /api/settlements/{settlementId}/status-with-payment?status=PAID&paymentMethod=Venmo&notes=Paid via Venmo
```

#### **3. Using the Basic Status Update**

```bash
# Simple status update (without payment details)
PATCH /api/settlements/{settlementId}/status?status=PAID
```

### **What Happens When You Mark a Settlement as Paid:**

✅ **Status Changes**: `PENDING` → `PAID`  
✅ **Paid Date**: Automatically set to current timestamp  
✅ **Payment Method**: Recorded (if provided)  
✅ **Notes**: Stored (if provided)  
✅ **Removed from Pending**: No longer shows in pending settlements  
✅ **Settlement Calculator**: Updated to reflect the payment  

### **Settlement Statuses:**

- **PENDING**: Settlement is owed and needs to be paid
- **PAID**: Settlement has been paid and is complete
- **OVERDUE**: Settlement is past due date
- **CANCELLED**: Settlement was cancelled (no longer valid)

### **Payment Tracking Features:**

- **Payment Method**: Track how the payment was made
- **Payment Date**: Automatically recorded when marked as paid
- **Notes**: Add context about the payment
- **Audit Trail**: All payment history is preserved

### **Example Workflow:**

1. **Create Shared Expense**: Admin creates a $200 expense split between 3 people
2. **Settlement Generated**: System creates settlement showing who owes what
3. **Payment Made**: Someone pays their share via Venmo
4. **Mark as Paid**: Admin marks the settlement as PAID with "Venmo" as payment method
5. **Settlement Zeroed**: The settlement disappears from pending and shows as PAID in history

### **Benefits:**

- **Clear Tracking**: Know exactly who has paid and who hasn't
- **Payment History**: Complete audit trail of all payments
- **Multiple Payment Methods**: Support for various payment types
- **Automatic Updates**: Settlement calculations update immediately
- **No Manual Math**: System handles all the calculations automatically

### **Security:**

- Only authenticated users can mark settlements as paid
- All payment actions are logged
- Payment details are stored securely
- No sensitive payment information is stored (just method and notes)

This system ensures that settlements are properly tracked and "zeroed out" when payments are made, keeping your expense management accurate and up-to-date.
