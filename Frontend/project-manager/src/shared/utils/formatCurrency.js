export const formatCurrency = (amount, currency='NPR') => {
return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
}).format(amount);
};