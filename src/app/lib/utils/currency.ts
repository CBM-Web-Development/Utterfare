export function getCurrencySymbol(symbol: string): string{
    switch(symbol){
        case 'usd': return '$';
        default: break;
    }
    return '';
}